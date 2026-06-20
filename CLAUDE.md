# CLAUDE.md — Fábrica de calculadoras FIRE

> Contexto para Claude Code. Léelo entero antes de tocar nada.

## Qué es esto y por qué existe

La app **Mi Plan FIRE** (`app.miplanfire.com`) es excelente pero invisible: va `noindex`, es una SPA y no tiene captación. Esta fábrica resuelve eso. Genera un **hub de calculadoras estáticas, indexables y rápidas** que atacan las queries de alta intención que hoy ganan las calculadoras de la competencia ("calculadora regla del 4%", "cuánto necesito para jubilarme", "interés compuesto"…), y **embudan cada visita hacia la app**.

```
Calculadora-anzuelo (SEO)  →  la app (el destino)  →  email/newsletter (retención + €)
        [ESTE REPO]                                          [siguiente fase]
```

Regla de oro: **todas las calculadoras salen de un solo archivo de config.** Añadir una nueva es editar datos, no escribir una página.

## Estructura

```
src/
  calculators.config.js   ← LA FUENTE DE VERDAD. Aquí vives el 95 % del tiempo.
  engine.js               ← Motor de cálculo (UMD). Una función por tipo de cálculo.
  template.js             ← Renderizado (diseño + SEO + runtime). Tócalo solo si cambia el diseño.
  build.js                ← Orquestador. Lee lo anterior y escribe /dist.
dist/                     ← SALIDA generada (no se edita a mano). Esto es lo que se despliega.
package.json
```

## Comandos

```bash
npm run build      # genera /dist (10 calculadoras + hub + sitemap + robots)
npm run preview    # sirve /dist en http://localhost:4321 para verlo
```

El build **valida** que cada `compute` del config exista en el engine y que no haya slugs duplicados. Si algo falla, aborta con el error concreto.

---

## ➕ Añadir una calculadora (el único flujo que importa)

**Paso 1 — Añade un objeto a `src/calculators.config.js`** (array `calculators`). Copia uno existente y cambia los campos. Esquema:

```js
{
  slug: 'mi-nueva-calculadora',          // URL: /mi-nueva-calculadora/  · sin acentos, kebab-case
  category: 'Tu número',                 // agrupa en el hub: 'Tu número' | 'Fundamentos' | 'Estrategias' | 'España'
  seo: {
    title: '… | …',                      // < 60 car. ideal. Lo que sale en Google.
    description: '…',                     // < 155 car.
    keywords: ['…','…']                   // queries objetivo
  },
  hero: {
    eyebrow: 'Calculadora · Nombre corto',
    h1: 'Pregunta o promesa potente',
    intro: '1-2 frases que enganchan.'
  },
  inputs: [                              // los datos que mete el usuario
    { id:'gastoMensual', label:'Lo que gastas al mes', unit:'€/mes',
      type:'number', default:1500, min:0, max:10000, step:50, help:'opcional' }
    // si pones min Y max → aparece slider sincronizado con el número
  ],
  compute: 'miFuncion',                  // nombre de la función en engine.js
  outputs: [                            // los ids deben coincidir con lo que devuelve la función
    { id:'resultado', label:'Tu resultado', format:'compactEur', emphasis:true, sub:'aclaración' }
  ],
  explainer: [ { h:'Subtítulo', p:'Párrafo educativo (suma SEO y confianza).' } ],
  faq: [ { q:'¿Pregunta?', a:'Respuesta.' } ],   // genera schema FAQPage automáticamente
  related: ['otro-slug','otro-slug-2']   // enlaces internos (topic cluster)
}
```

**Formatos de output disponibles** (campo `format`):
`compactEur` (1,18 M€) · `eur0` (1.500 €) · `pct` (50 %) · `years` (32,2 años / "Más de 60 años") · `age` ("A los 56 años") · `multiplo` (×25) · `text` (string tal cual, p. ej. un veredicto).

**Paso 2 — Si el cálculo es nuevo, añade su función a `src/engine.js`.** Patrón obligatorio: recibe `v` (valores por id de input) y devuelve un objeto (por id de output).

```js
miFuncion: function (v) {
  return { resultado: v.gastoMensual * 12 / (v.swr/100) };
}
```

Hay helpers reutilizables en el engine: `fv()` (valor futuro con aportación) y `solveYears()` (años hasta un objetivo; devuelve `null` si > 60). Reúsalos.

**Paso 3 —** `npm run build`. Ya está. Aparece la página, el enlace en el hub, el sitemap y los enlaces internos.

---

## Despliegue

`/dist` es estático puro. Cero backend.

1. **Subdominio recomendado:** `calculadoras.miplanfire.com` (deja la app en `app.` con su `noindex`; el hub SÍ se indexa). Cámbialo en `site.baseUrl` dentro del config si usas otro.
2. **Vercel/Netlify:** apunta el output a `dist`. En Vercel, build command `npm run build`, output dir `dist`. Netlify Drop: arrastra `dist`.
3. **Post-deploy obligatorio:** dar de alta el dominio en Google Search Console y enviar `sitemap.xml`.

## Contrato de deep-link con la app (función de crecimiento)

El CTA de cada calculadora ya construye un enlace con los valores del usuario:

```
https://app.miplanfire.com/?utm_source=calculadora&utm_medium=funnel&calc=<slug>&gastoMensual=1500&swr=4&...
```

**Tarea pendiente en el lado de la app** (no en este repo): que la app lea esos query params y **pre-rellene** el perfil del usuario. Así la transición calculadora → app es mágica: el usuario "no empieza de cero". Es el detalle que dispara la conversión del embudo.

## Si algún día quieres más que estático (opcional)

El valor está en `config + engine + template`, que son **portables**. Si necesitas ISR, edge o analítica server-side, migra a **Next.js**: `generateStaticParams` desde el config, y `build.js` se sustituye por un route handler. No reescribas el engine ni el config.

## Roadmap de expansión (más config = más tráfico)

Siguientes calculadoras de alto valor para añadir (solo config + engine si toca):
`calculadora-25x`, `regla-del-3-por-ciento`, `barista-fire`, `cuanto-ahorrar-al-mes`,
`hipoteca-vs-invertir`, `fondo-de-emergencia`, `interes-compuesto-diario`,
`rentabilidad-real-vs-nominal`, `cuanto-acumulare-en-x-anios`, `regla-72`.

Localización futura (mismo motor, otro `preset` de fiscalidad/pensión): México, Colombia, Argentina. La pensión y la fiscalidad son lo único país-dependiente.

## Lo que NO debe hacer este repo

- No recoge datos personales (coherente con la bandera de privacidad de la app).
- No da consejo financiero: cada página lleva su disclaimer (en `site.disclaimer`).
- La calculadora de pensión es **orientativa y muy simplificada**; mantén el disclaimer visible.
