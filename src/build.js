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
const { renderGuiaPage, renderGuiasIndexPage } = require('./guia-template.js');
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

// sitemap.xml (todo indexable, al contrario que la app)
// Las guías con draft:true NO entran aquí (solo pubGuias).
const today = new Date().toISOString().slice(0, 10);
const entries = [{ loc: site.baseUrl + '/', lastmod: today, priority: '1.0' }]
  .concat(calculators.map(c => ({ loc: `${site.baseUrl}/${c.slug}/`, lastmod: today, priority: '0.8' })));
if (pubGuias.length) {
  entries.push({ loc: `${site.baseUrl}/guias/`, lastmod: today, priority: '0.7' });
  pubGuias.forEach(g => entries.push({ loc: `${site.baseUrl}/guias/${g.slug}/`, lastmod: g.updISO || today, priority: '0.7' }));
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>monthly</changefreq><priority>${e.priority}</priority></url>`).join('\n')}
</urlset>`;
write(path.join(DIST, 'sitemap.xml'), sitemap);

// robots.txt — ESTAS sí se indexan
write(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);

const draftCount = allGuias.length - pubGuias.length;
console.log(`✓ Build OK · ${calculators.length} calculadoras + hub · ${pubGuias.length} guía(s)${draftCount ? ` (${draftCount} en borrador, excluida(s))` : ''}`);
console.log(`  dist/index.html (hub)`);
calculators.forEach(c => console.log(`  dist/${c.slug}/index.html`));
if (pubGuias.length) {
  console.log(`  dist/guias/index.html (índice de guías)`);
  pubGuias.forEach(g => console.log(`  dist/guias/${g.slug}/index.html`));
}
console.log(`  dist/sitemap.xml · dist/robots.txt`);
