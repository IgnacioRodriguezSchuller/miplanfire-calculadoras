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
if (errors) { console.error(`\n${errors} error(es). Build abortado.`); process.exit(1); }

// hub
write(path.join(DIST, 'index.html'), renderHubPage(calculators, site));

// each calculator → /<slug>/index.html
calculators.forEach(c => {
  const html = renderCalculatorPage(c, site, engineSource, calculators);
  write(path.join(DIST, c.slug, 'index.html'), html);
});

// sitemap.xml (todo indexable, al contrario que la app)
const today = new Date().toISOString().slice(0, 10);
const urls = [site.baseUrl + '/'].concat(calculators.map(c => `${site.baseUrl}/${c.slug}/`));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === site.baseUrl + '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>`;
write(path.join(DIST, 'sitemap.xml'), sitemap);

// robots.txt — ESTAS sí se indexan
write(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);

console.log(`✓ Build OK · ${calculators.length} calculadoras + hub`);
console.log(`  dist/index.html (hub)`);
calculators.forEach(c => console.log(`  dist/${c.slug}/index.html`));
console.log(`  dist/sitemap.xml · dist/robots.txt`);
