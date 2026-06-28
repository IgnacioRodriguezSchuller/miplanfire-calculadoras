/* ============================================================
   Mi Plan FIRE · Loader + parser de guías
   ------------------------------------------------------------
   Lee content/guias/*.md → objetos de guía listos para renderizar.
   - Frontmatter con gray-matter (title, description, pubDate,
     updatedDate, draft, cluster, slug, tags, relatedCalculators,
     relatedGuides, cta).
   - Cuerpo Markdown → HTML con marked.
   - Extrae la FAQ de la sección "Preguntas frecuentes"
     (negrita = pregunta, párrafo(s) siguiente(s) = respuesta)
     leyendo los TOKENS de marked (no regex sobre HTML), para el
     schema FAQPage y para pintarla como acordeón (misma piel que
     las calculadoras). Si la estructura no encaja → faq vacío y
     NO se emite FAQPage (mejor sin schema que con schema roto).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const GUIAS_DIR = path.resolve(__dirname, '..', 'content', 'guias');

// marked: GFM, sin obfuscación de emails, con ids en los encabezados (anclas).
marked.setOptions({ gfm: true, mangle: false, headerIds: true, headerPrefix: '' });

// Enlaces externos → nueva pestaña + rel noopener. Internos (miplanfire) intactos.
const renderer = new marked.Renderer();
const baseLink = renderer.link.bind(renderer);
renderer.link = function (href, title, text) {
  const html = baseLink(href, title, text);
  if (/^https?:\/\//.test(href || '') && !/miplanfire\.com/.test(href)) {
    return html.replace(/^<a /, '<a target="_blank" rel="noopener" ');
  }
  return html;
};
marked.use({ renderer });

// ---- fechas -----------------------------------------------------------
function toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
function isoDay(d) { return d ? d.toISOString().slice(0, 10) : null; }
function labelEs(d) {
  if (!d) return null;
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

// ---- FAQ desde tokens -------------------------------------------------
function isQuestion(t) {
  if (t.type !== 'paragraph' || !Array.isArray(t.tokens)) return false;
  const meaningful = t.tokens.filter(x => !(x.type === 'text' && !x.text.trim()));
  return meaningful.length === 1 && meaningful[0].type === 'strong';
}

function finishItem(cur, links) {
  const toks = cur.answerTokens.slice();
  toks.links = links || {};
  const aHtml = marked.parser(toks).trim();
  const a = aHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return { q: cur.q, a, aHtml };
}

function parseFaqItems(sectionTokens, links) {
  const items = [];
  let current = null;
  sectionTokens.forEach(t => {
    if (isQuestion(t)) {
      if (current) items.push(finishItem(current, links));
      const strong = t.tokens.find(x => x.type === 'strong');
      current = { q: strong.text.trim(), answerTokens: [] };
    } else if (current) {
      current.answerTokens.push(t);
    }
  });
  if (current) items.push(finishItem(current, links));
  return items.filter(it => it.q && it.aHtml);
}

// Separa el cuerpo en: tokens del artículo (sin la sección FAQ) + items de FAQ.
function splitFaq(tokens) {
  const faqStart = tokens.findIndex(t =>
    t.type === 'heading' && t.depth <= 2 && /preguntas\s+frecuentes/i.test(t.text || ''));
  if (faqStart === -1) return { articleTokens: tokens, faq: [] };

  const faqDepth = tokens[faqStart].depth;
  let faqEnd = tokens.length;
  for (let i = faqStart + 1; i < tokens.length; i++) {
    if (tokens[i].type === 'heading' && tokens[i].depth <= faqDepth) { faqEnd = i; break; }
  }
  const sectionTokens = tokens.slice(faqStart + 1, faqEnd);
  const faq = parseFaqItems(sectionTokens, tokens.links);

  // Artículo = todo MENOS la sección FAQ (encabezado incluido). Conserva "Fuentes" y demás.
  const articleTokens = tokens.slice(0, faqStart).concat(tokens.slice(faqEnd));
  articleTokens.links = tokens.links;
  return { articleTokens, faq };
}

// ---- parseo de una guía ----------------------------------------------
function parseGuia(filepath, filename) {
  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);
  const slug = (data.slug || filename.replace(/\.md$/, '')).trim();

  const tokens = marked.lexer(content);
  const { articleTokens, faq } = splitFaq(tokens);
  const articleHtml = marked.parser(articleTokens);

  const pub = toDate(data.pubDate);
  const upd = toDate(data.updatedDate) || pub;

  return {
    slug,
    draft: data.draft === true,
    title: (data.title || slug).trim(),
    description: (data.description || '').trim(),
    cluster: (data.cluster || 'Guías').trim(),
    tags: Array.isArray(data.tags) ? data.tags : [],
    relatedCalculators: Array.isArray(data.relatedCalculators) ? data.relatedCalculators : [],
    relatedGuides: Array.isArray(data.relatedGuides) ? data.relatedGuides : [],
    sources: Array.isArray(data.sources) ? data.sources : [],   // [{title,url}] → citation en el schema (E-E-A-T)
    cta: data.cta || null,            // slug de calculadora opcional; si no, CTA a la app
    pubISO: isoDay(pub),
    updISO: isoDay(upd),
    pubLabel: labelEs(pub),
    updLabel: labelEs(upd),
    articleHtml,
    faq,
    _file: filename
  };
}

function loadGuias() {
  if (!fs.existsSync(GUIAS_DIR)) return [];
  return fs.readdirSync(GUIAS_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))   // _foo.md = ignorado
    .sort()
    .map(f => parseGuia(path.join(GUIAS_DIR, f), f));
}

module.exports = { loadGuias, GUIAS_DIR };
