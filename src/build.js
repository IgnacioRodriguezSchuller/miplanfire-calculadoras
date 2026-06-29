/* ============================================================
   Mi Plan FIRE · Build de la fábrica
   ------------------------------------------------------------
   node src/build.js  →  genera /dist con todas las páginas.
   Lee: src/calculators.config.js (la fuente de verdad)
        src/engine.js (motor, se inyecta en cada página)
        src/template.js (renderizado)
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const { site, calculators } = require('./calculators.config.js');
const { renderCalculatorPage, renderHubPage } = require('./template.js');
const { loadGuias } = require('./guias.js');
const { renderGuiaPage, renderGuiasIndexPage, renderInfoPage } = require('./guia-template.js');
const engineSource = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

// clean dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// validate: every compute fn must exist in the engine
const FireEngine = require('./engine.js');
let errors = 0;
calculators.forEach(c => {
  if (typeof FireEngine[c.compute] !== 'function') {
    console.error(`✗ ${c.slug}: compute "${c.compute}" no existe en engine.js`);
    errors++;
  }
});
const slugs = calculators.map(c => c.slug);
slugs.forEach((s, i) => { if (slugs.indexOf(s) !== i) { console.error(`✗ slug duplicado: ${s}`); errors++; } });
// --- guías: cargar y validar (draft excluido del sitio público) -------
const allGuias = loadGuias();
const pubGuias = allGuias.filter(g => !g.draft);
const gslugs = allGuias.map(g => g.slug);
gslugs.forEach((s, i) => { if (gslugs.indexOf(s) !== i) { console.error(`✗ slug de guía duplicado: ${s}`); errors++; } });

if (errors) { console.error(`\n${errors} error(es). Build abortado.`); process.exit(1); }

// hub
write(path.join(DIST, 'index.html'), renderHubPage(calculators, site));

// each calculator → /<slug>/index.html
calculators.forEach(c => {
  const html = renderCalculatorPage(c, site, engineSource, calculators);
  write(path.join(DIST, c.slug, 'index.html'), html);
});

// guías publicadas → /guias/<slug>/index.html  +  índice /guias/
pubGuias.forEach(g => {
  write(path.join(DIST, 'guias', g.slug, 'index.html'), renderGuiaPage(g, site, calculators, pubGuias));
});
if (pubGuias.length) {
  write(path.join(DIST, 'guias', 'index.html'), renderGuiasIndexPage(pubGuias, site));
}

// páginas informativas (metodología, privacidad) → /<slug>/index.html
const infoPages = [
  {
    slug: 'metodologia',
    title: 'Metodología y quién hay detrás | Mi Plan FIRE',
    description: 'Quién está detrás de Mi Plan FIRE y cómo escribimos y verificamos las guías contra fuentes oficiales. Contenido educativo, no asesoramiento financiero.',
    h1: 'Quién hay detrás de Mi Plan FIRE',
    bodyHtml: `<p><strong>Mi Plan FIRE</strong> es un proyecto personal de <strong>Nacho Rodríguez</strong>. Nació de una idea simple: que cualquiera en España pueda entender y planificar su independencia financiera con herramientas claras y un lenguaje sin jerga.</p>
<h2>Cómo escribimos las guías</h2>
<p>Cada guía se redacta y se verifica contra <strong>fuentes oficiales</strong> (BOE, CNMV, FOGAIN, Banco de España, Seguridad Social). Citamos las fuentes al final de cada artículo y mostramos la <strong>fecha de revisión</strong>. Cuando algo es una estimación o puede cambiar, lo decimos con claridad.</p>
<h2>Esto no es asesoramiento financiero</h2>
<p>El contenido es educativo y no conoce tu situación personal. Nada de lo que leas aquí es una recomendación de inversión: contrasta siempre con fuentes oficiales antes de decidir.</p>
<h2>Contacto</h2>
<p>¿Una errata, una duda o una sugerencia? Escríbenos a <a href="mailto:miplanfire@gmail.com">miplanfire@gmail.com</a>.</p>`
  },
  {
    slug: 'privacidad',
    title: 'Privacidad y transparencia | Mi Plan FIRE',
    description: 'Cómo tratamos tus datos en Mi Plan FIRE: calculadoras que no envían nada, analítica sin cookies ni rastreo, y solo tu email si te suscribes. Transparencia total.',
    h1: 'Privacidad y transparencia',
    bodyHtml: `<p>Una web que habla de tu dinero debería ser la primera en respetar tus datos. En cristiano, esto es lo que hacemos:</p>
<ul>
<li><strong>Las calculadoras no envían nada.</strong> Los cálculos ocurren en tu navegador; lo que escribes (gastos, patrimonio…) no sale de tu dispositivo ni llega a nosotros.</li>
<li><strong>Medimos visitas, no personas.</strong> Usamos analítica <strong>sin cookies y anónima</strong>: contamos páginas vistas, de dónde llegas y el tipo de dispositivo, pero no te identificamos ni te seguimos por la web. Por eso no verás un aviso de cookies. Nuestro proveedor de alojamiento procesa datos técnicos como la dirección IP de forma transitoria para servir la web, como cualquier servidor; nosotros no los usamos ni los guardamos.</li>
<li><strong>Lo único personal que podríamos guardar de ti es tu email</strong>, y solo si te suscribes voluntariamente para recibir nuevas guías. Lo usamos solo para eso y puedes darte de baja en un clic cuando quieras.</li>
<li><strong>¿Dudas o quieres borrar tu email?</strong> Escríbenos a <a href="mailto:miplanfire@gmail.com">miplanfire@gmail.com</a>.</li>
</ul>`
  }
];
infoPages.forEach(p => write(path.join(DIST, p.slug, 'index.html'), renderInfoPage(p, site)));

// sitemap.xml (todo indexable, al contrario que la app)
// Las guías con draft:true NO entran aquí (solo pubGuias).
const today = new Date().toISOString().slice(0, 10);
const entries = [{ loc: site.baseUrl + '/', lastmod: today, priority: '1.0' }]
  .concat(calculators.map(c => ({ loc: `${site.baseUrl}/${c.slug}/`, lastmod: today, priority: '0.8' })));
if (pubGuias.length) {
  entries.push({ loc: `${site.baseUrl}/guias/`, lastmod: today, priority: '0.7' });
  pubGuias.forEach(g => entries.push({ loc: `${site.baseUrl}/guias/${g.slug}/`, lastmod: g.updISO || today, priority: '0.7' }));
}
infoPages.forEach(p => entries.push({ loc: `${site.baseUrl}/${p.slug}/`, lastmod: today, priority: '0.5' }));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>monthly</changefreq><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>`;
write(path.join(DIST, 'sitemap.xml'), sitemap);

// robots.txt — ESTAS sí se indexan
write(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);

const draftCount = allGuias.length - pubGuias.length;
console.log(`✓ Build OK · ${calculators.length} calculadoras + hub · ${pubGuias.length} guía(s)${draftCount ? ` (${draftCount} en borrador, excluida(s))` : ''} · ${infoPages.length} páginas`);
console.log(`  dist/index.html (hub)`);
calculators.forEach(c => console.log(`  dist/${c.slug}/index.html`));
if (pubGuias.length) {
  console.log(`  dist/guias/index.html (índice de guías)`);
  pubGuias.forEach(g => console.log(`  dist/guias/${g.slug}/index.html`));
}
console.log(`  dist/sitemap.xml · dist/robots.txt`);
