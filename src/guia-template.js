/* ============================================================
   Mi Plan FIRE · Plantilla de GUÍAS
   ------------------------------------------------------------
   Misma piel que las calculadoras: reutiliza CSS, fonts y esc de
   template.js. Solo añade los estilos de prosa larga del artículo.
   - renderGuiaPage(guia, site, allCalcs, allGuias)
   - renderGuiasIndexPage(guias, site)
   SEO completo: meta + OG + canonical + JSON-LD
   (Article + FAQPage[si hay FAQ] + BreadcrumbList).
   ============================================================ */
const { CSS, fonts, esc } = require('./template.js');

// CSS extra SOLO para guías (se añade al CSS base; no afecta a las calculadoras).
const GUIA_CSS = `
.guia-wrap{max-width:760px;}
.article{margin:8px 0 0;}
.article h2{font-size:clamp(22px,3.4vw,31px);letter-spacing:-.01em;margin:36px 0 12px;color:var(--ink);}
.article h3{font-size:clamp(18px,2.6vw,22px);margin:28px 0 8px;color:var(--ink);}
.article p{color:var(--inksoft);font-size:17.5px;line-height:1.68;margin:0 0 17px;}
.article ul,.article ol{color:var(--inksoft);font-size:17.5px;line-height:1.66;margin:0 0 17px;padding-left:24px;}
.article li{margin:7px 0;}
.article li::marker{color:var(--terra);}
.article a{color:var(--terradeep);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px;}
.article a:hover{color:var(--terra);}
.article strong{color:var(--ink);font-weight:600;}
.article blockquote{border-left:3px solid var(--terra);margin:20px 0;padding:6px 0 6px 18px;color:var(--inksoft);font-style:italic;}
.article blockquote p{margin:0;}
.article code{font-family:"DM Mono",monospace;font-size:.9em;background:var(--paper2);border:1px solid var(--line);border-radius:6px;padding:1px 6px;}
.article pre{background:var(--paper2);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto;margin:0 0 17px;}
.article pre code{border:none;background:none;padding:0;}
.article hr{border:none;border-top:1px solid var(--line);margin:30px 0;}
.article table{width:100%;border-collapse:collapse;margin:20px 0;font-size:15.5px;}
.article th,.article td{border:1px solid var(--line);padding:9px 12px;text-align:left;color:var(--inksoft);vertical-align:top;}
.article th{background:var(--paper2);color:var(--ink);font-weight:500;}
.article h2 a,.article h3 a{color:inherit;text-decoration:none;}
@media(max-width:560px){.article table{display:block;overflow-x:auto;font-size:14px;}}
.guia-meta{font-family:"DM Mono",monospace;font-size:12px;color:var(--muted);letter-spacing:.02em;margin:14px 0 0;display:flex;gap:14px;flex-wrap:wrap;}
.guia-tags{margin:20px 0 0;display:flex;flex-wrap:wrap;gap:8px;}
.guia-tags span{font-family:"DM Mono",monospace;font-size:10.5px;letter-spacing:.04em;color:var(--muted);border:1px solid var(--line);border-radius:99px;padding:4px 11px;}
.disc-box{border:1px solid var(--line);background:var(--paper2);border-radius:12px;padding:15px 18px;margin:30px 0 0;}
.disc-box p{font-family:"DM Mono",monospace;font-size:11.5px;color:var(--muted);line-height:1.65;margin:0;}
`;

function bar(site, label) {
  return `<header class="bar"><div class="bar-in">
  <a href="${site.baseUrl}/" class="wordmark">Mi Plan <span>FIRE</span><small>${esc(label)}</small></a>
  <a href="${site.appUrl}" class="app">Abrir la app →</a>
</div></header>`;
}

function footer(site) {
  return `<footer><div class="wrap">
  <p class="disc">${esc(site.disclaimer)}</p>
  <div class="fnav">
    <a href="${site.baseUrl}/">Calculadoras</a>
    <a href="${site.baseUrl}/guias/">Guías</a>
    <a href="${site.appUrl}">Abrir la app</a>
  </div>
</div></footer>`;
}

function faqHtml(faq) {
  if (!faq.length) return '';
  return `<section class="faq">
    <h2>Preguntas frecuentes</h2>
    ${faq.map(f => `<details class="q"><summary>${esc(f.q)}<span class="plus">+</span></summary><div class="qa">${f.aHtml}</div></details>`).join('\n    ')}
  </section>`;
}

function relatedHtml(guia, site, allCalcs, allGuias) {
  const calcs = (guia.relatedCalculators || [])
    .map(slug => allCalcs.find(c => c.slug === slug)).filter(Boolean);

  let guides = (guia.relatedGuides || [])
    .map(slug => allGuias.find(g => g.slug === slug)).filter(Boolean);
  if (!guides.length) {
    // por defecto: otras guías publicadas del mismo cluster
    guides = allGuias.filter(g => g.slug !== guia.slug && g.cluster === guia.cluster).slice(0, 2);
  }
  if (!calcs.length && !guides.length) return '';

  const calcCards = calcs.map(c => `<a class="relcard" href="${site.baseUrl}/${c.slug}/">
      <div class="rc-eye">Calculadora</div>
      <div class="rc-t">${esc(c.hero.eyebrow.replace('Calculadora · ', ''))}</div>
    </a>`).join('\n      ');
  const guideCards = guides.map(g => `<a class="relcard" href="${site.baseUrl}/guias/${g.slug}/">
      <div class="rc-eye">Guía · ${esc(g.cluster)}</div>
      <div class="rc-t">${esc(g.title)}</div>
    </a>`).join('\n      ');

  return `<section class="related">
    <h2>Sigue por aquí</h2>
    <div class="relgrid">
      ${calcCards}
      ${guideCards}
    </div>
  </section>`;
}

function ctaHtml(guia, site, allCalcs) {
  // Por defecto el CTA apunta a la app (idéntico a las calculadoras).
  // Si la guía define `cta: <slug-calculadora>`, el botón lleva a esa calculadora.
  const calc = guia.cta ? allCalcs.find(c => c.slug === guia.cta) : null;
  const href = calc ? `${site.baseUrl}/${calc.slug}/` : `${site.appUrl}/?utm_source=guia&utm_medium=funnel&guia=${encodeURIComponent(guia.slug)}`;
  const button = calc ? 'Abrir la calculadora' : esc(site.cta.button);
  return `<section class="cta">
    <div class="eyebrow">${esc(site.cta.eyebrow)}</div>
    <h2>${esc(site.cta.title)}</h2>
    <p>${esc(site.cta.body)}</p>
    <a class="btn" href="${href}">${button} →</a>
    <div class="note">Sin registro · tus datos no salen de tu dispositivo</div>
  </section>`;
}

function script(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj) + '</' + 'script>';
}

function jsonLd(guia, site, canonical) {
  const article = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: guia.title,
    description: guia.description,
    inLanguage: 'es-ES',
    url: canonical,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: site.brand, url: site.baseUrl },
    publisher: { '@type': 'Organization', name: site.brand, url: site.baseUrl }
  };
  if (guia.pubISO) article.datePublished = guia.pubISO;
  if (guia.updISO) article.dateModified = guia.updISO;
  // Fuentes oficiales citadas → señal E-E-A-T para contenido YMYL, respetando la marca anónima.
  if (guia.sources && guia.sources.length) {
    article.citation = guia.sources.map(s => ({ '@type': 'CreativeWork', name: s.title || s.url, url: s.url }));
  }

  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Guías', item: site.baseUrl + '/guias/' },
      { '@type': 'ListItem', position: 2, name: guia.title, item: canonical }
    ]
  };

  let out = script(article) + script(crumbs);
  if (guia.faq.length) {
    out += script({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: guia.faq.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }
  return out;
}

function renderGuiaPage(guia, site, allCalcs, allGuias) {
  const canonical = `${site.baseUrl}/guias/${guia.slug}/`;
  const metaBits = [];
  if (guia.updLabel) metaBits.push(`<span>Revisado: ${esc(guia.updLabel)}</span>`);
  if (guia.tags && guia.tags.length) metaBits.push(`<span>${esc(guia.tags.slice(0, 4).join(' · '))}</span>`);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(guia.title)}</title>
<meta name="description" content="${esc(guia.description)}">
${guia.tags && guia.tags.length ? `<meta name="keywords" content="${esc(guia.tags.join(', '))}">` : ''}
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(guia.title)}">
<meta property="og:description" content="${esc(guia.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="${esc(site.brand)}">
${guia.updISO ? `<meta property="article:modified_time" content="${guia.updISO}">` : ''}
${guia.pubISO ? `<meta property="article:published_time" content="${guia.pubISO}">` : ''}
<meta name="twitter:card" content="summary_large_image">
${fonts()}
<style>${CSS}${GUIA_CSS}</style>
${jsonLd(guia, site, canonical)}
</head>
<body>
${bar(site, 'Guías')}

<main class="wrap guia-wrap">
  <div class="crumb"><a href="${site.baseUrl}/">Inicio</a> · <a href="${site.baseUrl}/guias/">Guías</a> · <b>${esc(guia.cluster)}</b></div>

  <section class="hero">
    <div class="eyebrow">Guía · ${esc(guia.cluster)}</div>
    <h1>${esc(guia.title)}</h1>
    <p class="intro">${esc(guia.description)}</p>
    ${metaBits.length ? `<div class="guia-meta">${metaBits.join('')}</div>` : ''}
  </section>

  <article class="article">
${guia.articleHtml}
  </article>

  ${faqHtml(guia.faq)}

  ${ctaHtml(guia, site, allCalcs)}

  ${relatedHtml(guia, site, allCalcs, allGuias)}

  <div class="disc-box"><p>${esc(site.disclaimer)}</p></div>
</main>

${footer(site)}
</body>
</html>`;
}

function renderGuiasIndexPage(guias, site) {
  const canonical = site.baseUrl + '/guias/';
  const hub = {
    title: 'Guías FIRE — fiscalidad, brókers e inversión en España | Mi Plan FIRE',
    description: 'Guías prácticas y verificadas sobre independencia financiera en España: fiscalidad de tus inversiones, seguridad de los brókers, errores comunes y cómo construir tu plan FIRE.',
    h1: 'Guías para tu independencia financiera',
    intro: 'Explicaciones claras y con fuentes oficiales sobre lo que de verdad mueve tu plan: impuestos, brókers, productos y estrategia. Cuando quieras pasar a los números, te esperan las calculadoras y la app.'
  };

  const cats = {};
  guias.forEach(g => { (cats[g.cluster] = cats[g.cluster] || []).push(g); });

  const itemList = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: guias.map((g, i) => ({
      '@type': 'ListItem', position: i + 1, name: g.title, url: `${site.baseUrl}/guias/${g.slug}/`
    }))
  };

  const cards = Object.keys(cats).map(cat => `
    <div class="cat">
      <h2 class="cat-h">${esc(cat)}</h2>
      <div class="relgrid">
        ${cats[cat].map(g => `<a class="relcard" href="${site.baseUrl}/guias/${g.slug}/">
          <div class="rc-eye">Guía${g.updLabel ? ' · ' + esc(g.updLabel) : ''}</div>
          <div class="rc-t">${esc(g.title)}</div>
          <p class="help" style="margin-top:8px;">${esc((g.description || '').slice(0, 110))}${(g.description || '').length > 110 ? '…' : ''}</p>
        </a>`).join('\n        ')}
      </div>
    </div>`).join('');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(hub.title)}</title>
<meta name="description" content="${esc(hub.description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(hub.title)}">
<meta property="og:description" content="${esc(hub.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="es_ES">
${fonts()}
<style>${CSS}
.cat{margin:34px 0;}.cat-h{font-size:clamp(20px,3vw,26px);margin-bottom:14px;letter-spacing:-.01em;}
.hubhero{padding:30px 0 6px;}.hubhero h1{font-size:clamp(32px,6vw,54px);letter-spacing:-.015em;margin:10px 0 14px;}
.hubhero h1 em{font-style:normal;color:var(--terra);}
.hubhero .intro{font-size:clamp(16px,2.4vw,21px);color:var(--inksoft);max-width:680px;line-height:1.45;}
.relcard .help{color:var(--muted);font-size:13px;}</style>
${script(itemList)}
</head>
<body>
${bar(site, 'Guías')}
<main class="wrap">
  <div class="crumb"><a href="${site.baseUrl}/">Inicio</a> · <b>Guías</b></div>
  <section class="hubhero">
    <div class="eyebrow">${esc(site.brand)} · Guías</div>
    <h1>Guías para tu <em>independencia financiera</em></h1>
    <p class="intro">${esc(hub.intro)}</p>
  </section>
  ${cards}
  <section class="cta">
    <div class="eyebrow">${esc(site.cta.eyebrow)}</div>
    <h2>${esc(site.cta.title)}</h2>
    <p>${esc(site.cta.body)}</p>
    <a class="btn" href="${site.appUrl}/?utm_source=guias&utm_medium=hub">${esc(site.cta.button)} →</a>
    <div class="note">Sin registro · tus datos no salen de tu dispositivo</div>
  </section>
</main>
${footer(site)}
</body>
</html>`;
}

module.exports = { renderGuiaPage, renderGuiasIndexPage };
