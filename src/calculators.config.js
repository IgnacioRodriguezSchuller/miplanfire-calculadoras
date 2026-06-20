/* ============================================================
   Mi Plan FIRE · Config de la fábrica de calculadoras
   ------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE TOCAS PARA AÑADIR/EDITAR CALCULADORAS.
   Para una nueva: copia un objeto, cambia slug/seo/inputs/outputs y
   apunta `compute` a una función de src/engine.js (créala si es nueva).
   ============================================================ */

const site = {
  brand: 'Mi Plan FIRE',
  tagline: 'Calculadoras de independencia financiera',
  // Subdominio INDEXABLE para el hub de calculadoras (separado de la app, que va noindex).
  baseUrl: 'https://calculadoras.miplanfire.com',
  appUrl: 'https://app.miplanfire.com',
  hub: {
    title: 'Calculadoras FIRE — independencia financiera en España | Mi Plan FIRE',
    description: 'Calculadoras gratuitas para planificar tu independencia financiera y jubilación anticipada en España: número FIRE, regla del 4 %, interés compuesto, Coast FIRE y más.',
    h1: 'Calculadoras para tu libertad financiera',
    intro: 'Diez calculadoras, cada una resuelve una pregunta. Sin registro, sin rodeos. Cuando quieras el plan completo —Monte Carlo, tu pensión pública, seguimiento mes a mes— te espera la app.'
  },
  // CTA de embudo: aparece tras el resultado en TODAS las calculadoras.
  cta: {
    eyebrow: 'Esto es solo una foto fija',
    title: '¿Y si vieras la película entera?',
    body: 'Mi Plan FIRE coge estos números y los convierte en un plan vivo: 400 simulaciones Monte Carlo, tu pensión pública española, seguimiento mes a mes y comparativa en pareja. Gratis y sin cuenta — tus datos nunca salen de tu dispositivo.',
    button: 'Abrir Mi Plan FIRE'
  },
  disclaimer: 'Herramienta educativa. No constituye asesoramiento financiero, fiscal ni de inversión. Las proyecciones son estimaciones basadas en supuestos: el comportamiento real puede diferir. Rentabilidades pasadas no garantizan rentabilidades futuras.'
};

const calculators = [
  /* ---------------------------------------------------------- 1 */
  {
    slug: 'regla-del-4-por-ciento',
    category: 'Tu número',
    seo: {
      title: 'Calculadora de la Regla del 4 % | Tu número FIRE en euros',
      description: 'Calcula tu número de independencia financiera con la regla del 4 %. Descubre cuánto patrimonio necesitas para vivir de tus inversiones, en euros.',
      keywords: ['regla del 4 por ciento', 'calculadora regla del 4%', 'número FIRE', 'independencia financiera', 'tasa de retiro seguro']
    },
    hero: {
      eyebrow: 'Calculadora · Regla del 4 %',
      h1: '¿Cuánto necesitas para no volver a trabajar por dinero?',
      intro: 'La regla del 4 % dice que puedes retirar cada año el 4 % de tu cartera sin agotarla. Dale la vuelta y obtienes tu número: el patrimonio que te hace libre.'
    },
    inputs: [
      { id: 'gastoMensual', label: 'Lo que gastas al mes', unit: '€/mes', type: 'number', default: 1500, min: 0, max: 10000, step: 50, help: 'Tu gasto medio mensual hoy. Es la pieza que más mueve tu número.' },
      { id: 'swr', label: 'Tasa de retiro segura', unit: '%', type: 'number', default: 4, min: 2.5, max: 6, step: 0.1, help: '4 % es el estándar (Trinity). Para retiros muy largos, muchos usan 3–3,5 %.' }
    ],
    compute: 'regla4',
    outputs: [
      { id: 'numeroFire', label: 'Tu número FIRE', format: 'compactEur', emphasis: true, sub: 'el patrimonio que necesitas invertido' },
      { id: 'gastoAnual', label: 'Gasto anual', format: 'eur0' },
      { id: 'multiplo', label: 'Veces tu gasto anual', format: 'multiplo' }
    ],
    explainer: [
      { h: '¿De dónde sale la regla del 4 %?', p: 'Del estudio Trinity (1998), que analizó carteras de acciones y bonos sobre datos históricos de EE. UU. Concluyó que retirar el 4 % el primer año y ajustarlo por inflación después aguantaba 30 años con muy alta probabilidad. De ahí el atajo: tu número = gasto anual × 25.' },
      { h: 'El matiz que casi nadie cuenta', p: 'El 4 % se calibró para 30 años. Si te retiras a los 45, tu horizonte puede ser de 45–50 años, y entonces conviene ser más prudente: 3 % a 3,5 %. No es una ley física, es un punto de partida. Por eso aquí puedes moverlo.' }
    ],
    faq: [
      { q: '¿Por qué multiplicar por 25?', a: 'Porque 100 ÷ 4 = 25. Si retiras el 4 % anual, necesitas 25 veces tu gasto anual. Con un 3,5 % serían ~28,5 veces; con un 3 %, ~33 veces.' },
      { q: '¿Funciona la regla del 4 % en España?', a: 'El concepto sí, pero los números de referencia cambian: muchos usan tasas de retiro algo más bajas (3–3,5 %) por horizontes largos, y conviene contar con la pensión pública como colchón posterior.' },
      { q: '¿Cuento mi vivienda en el número?', a: 'No, salvo que pienses venderla. El número FIRE se refiere al patrimonio invertido del que retiras; tu casa no genera la renta del 4 %.' }
    ],
    related: ['cuanto-necesito-para-ser-libre', 'lean-fat-fire', 'cuando-puedo-jubilarme']
  },

  /* ---------------------------------------------------------- 2 */
  {
    slug: 'cuanto-necesito-para-ser-libre',
    category: 'Tu número',
    seo: {
      title: 'Cuánto necesito para ser libre financieramente | Calculadora',
      description: 'Calcula cuánto dinero necesitas para la independencia financiera y en cuántos años lo alcanzas según tu ahorro mensual y rentabilidad.',
      keywords: ['cuánto necesito para ser libre', 'cuánto dinero para jubilarme', 'independencia financiera', 'años hasta FIRE']
    },
    hero: {
      eyebrow: 'Calculadora · Tu meta y tu plazo',
      h1: 'Cuánto necesitas, y en cuánto tiempo llegas',
      intro: 'No solo la cifra: también la fecha. Combina tu número FIRE con tu ritmo de ahorro para ver cuántos años te separan de la libertad.'
    },
    inputs: [
      { id: 'gastoMensual', label: 'Lo que gastas al mes', unit: '€/mes', type: 'number', default: 1500, min: 0, max: 10000, step: 50, help: 'Tu gasto medio mensual.' },
      { id: 'patrimonio', label: 'Lo que ya tienes invertido', unit: '€', type: 'number', default: 20000, min: 0, max: 2000000, step: 1000, help: 'Tu cartera actual (fondos, ETFs, planes).' },
      { id: 'aporteMensual', label: 'Lo que inviertes cada mes', unit: '€/mes', type: 'number', default: 500, min: 0, max: 10000, step: 50, help: 'Tu aportación mensual. La variable que más controlas.' },
      { id: 'rent', label: 'Rentabilidad real anual', unit: '%', type: 'number', default: 5, min: 0, max: 12, step: 0.5, help: 'Real = ya descontada la inflación. ~5 % es una media razonable a largo plazo.' },
      { id: 'swr', label: 'Tasa de retiro segura', unit: '%', type: 'number', default: 4, min: 2.5, max: 6, step: 0.1, help: 'Cuánto retirarás cada año de tu cartera.' }
    ],
    compute: 'cuantoNecesito',
    outputs: [
      { id: 'numeroFire', label: 'Tu número FIRE', format: 'compactEur', emphasis: true, sub: 'en € de hoy (rentabilidad real)' },
      { id: 'anios', label: 'Tiempo hasta llegar', format: 'years' },
      { id: 'aportado', label: 'Habrás aportado de tu bolsillo', format: 'eur0' }
    ],
    explainer: [
      { h: 'Por qué usamos rentabilidad real', p: 'Si trabajas en euros de hoy, no quieres que la inflación distorsione la cifra. Usando rentabilidad real (la de mercado menos la inflación) tu número se expresa en poder adquisitivo actual: más fácil de entender y de creer.' },
      { h: 'El tiempo trabaja más que tu sueldo', p: 'Verás que subir un poco la aportación adelanta años, pero que el efecto se acelera cuanto antes empiezas. Los primeros euros invertidos son los que más tiempo pasan componiendo, y por eso los más valiosos.' }
    ],
    faq: [
      { q: '¿Y si no puedo aportar tanto?', a: 'Baja la aportación y mira el plazo. Casi siempre la palanca más potente no es ganar más, sino subir la tasa de ahorro: reducir gasto baja tu número y sube tu aporte a la vez.' },
      { q: '¿La rentabilidad del 5 % es realista?', a: 'Es una media histórica razonable para una cartera indexada global, ya descontada la inflación. Hay años mucho mejores y mucho peores; el largo plazo suaviza el camino, no lo elimina.' },
      { q: '¿Incluye la pensión pública?', a: 'No, esta calculadora no. La pensión llega a partir de la edad legal y alarga la vida de tu dinero; eso se modela en la app completa.' }
    ],
    related: ['cuando-puedo-jubilarme', 'tasa-de-ahorro', 'regla-del-4-por-ciento']
  },

  /* ---------------------------------------------------------- 3 */
  {
    slug: 'interes-compuesto',
    category: 'Fundamentos',
    seo: {
      title: 'Calculadora de Interés Compuesto | Cuánto crece tu dinero',
      description: 'Calcula el interés compuesto de tus inversiones: capital inicial, aportación mensual, años y rentabilidad. Mira cuánto pones tú y cuánto pone el interés.',
      keywords: ['calculadora interés compuesto', 'interés compuesto', 'inversión a largo plazo', 'aportación mensual']
    },
    hero: {
      eyebrow: 'Calculadora · Interés compuesto',
      h1: 'El motor que convierte el ahorro en patrimonio',
      intro: 'Aporta poco pero pronto. El interés compuesto hace que tu dinero genere dinero, y que ese dinero genere más. Pon tus cifras y mira la bola de nieve.'
    },
    inputs: [
      { id: 'inicial', label: 'Capital inicial', unit: '€', type: 'number', default: 10000, min: 0, max: 2000000, step: 1000, help: 'Lo que inviertes hoy de partida.' },
      { id: 'aporteMensual', label: 'Aportación mensual', unit: '€/mes', type: 'number', default: 300, min: 0, max: 10000, step: 50, help: 'Lo que añades cada mes.' },
      { id: 'anios', label: 'Durante cuántos años', unit: 'años', type: 'number', default: 25, min: 1, max: 60, step: 1, help: 'Tu horizonte de inversión.' },
      { id: 'rent', label: 'Rentabilidad anual', unit: '%', type: 'number', default: 7, min: 0, max: 15, step: 0.5, help: '~7 % es la media histórica nominal de una cartera indexada global.' }
    ],
    compute: 'interesCompuesto',
    outputs: [
      { id: 'total', label: 'Tendrás', format: 'compactEur', emphasis: true, sub: 'valor final de tu cartera' },
      { id: 'aportado', label: 'Habrás puesto tú', format: 'eur0' },
      { id: 'intereses', label: 'Lo pone el interés compuesto', format: 'eur0' }
    ],
    explainer: [
      { h: 'La octava maravilla', p: 'El interés compuesto significa ganar rentabilidad sobre tu rentabilidad. Al principio apenas se nota; con los años la curva se dispara. En horizontes largos, la mayor parte de tu cartera no la habrás puesto tú: la habrá puesto el tiempo.' },
      { h: 'El enemigo silencioso: las comisiones', p: 'El interés compuesto también funciona en tu contra con las comisiones. Una diferencia del 1 % anual parece nada, pero a 30 años puede comerse una fracción enorme de tu patrimonio. Por eso los fondos indexados de bajo coste son la base de la inversión pasiva.' }
    ],
    faq: [
      { q: '¿Nominal o real?', a: 'Esta calculadora usa rentabilidad nominal (sin descontar inflación). Para ver el resultado en poder adquisitivo de hoy, usa la calculadora de inflación con el valor final.' },
      { q: '¿Importa el día del mes en que aporto?', a: 'A largo plazo, prácticamente nada. Lo que importa es la constancia: aportar siempre, pase lo que pase en el mercado.' },
      { q: '¿Y si dejo de aportar a mitad?', a: 'El capital ya invertido sigue componiendo, pero pierdes el empuje de las nuevas aportaciones. Mira el efecto bajando los años o el aporte.' }
    ],
    related: ['cuanto-necesito-para-ser-libre', 'inflacion-poder-adquisitivo', 'coast-fire']
  },

  /* ---------------------------------------------------------- 4 */
  {
    slug: 'coast-fire',
    category: 'Estrategias',
    seo: {
      title: 'Calculadora Coast FIRE | ¿Puedes dejar de aportar ya?',
      description: 'Calcula tu número Coast FIRE: cuánto necesitas invertido hoy para que, sin aportar más, tu cartera crezca sola hasta tu jubilación.',
      keywords: ['coast fire', 'calculadora coast fire', 'barista fire', 'independencia financiera parcial']
    },
    hero: {
      eyebrow: 'Calculadora · Coast FIRE',
      h1: 'El punto en que el tiempo hace el resto',
      intro: 'Coast FIRE es el momento mágico: tienes tanto invertido que, aunque no aportes ni un euro más, tu cartera crecerá sola hasta tu número de jubilación. Ya no corres; planeas.'
    },
    inputs: [
      { id: 'edadActual', label: 'Tu edad', unit: 'años', type: 'number', default: 30, min: 18, max: 65, step: 1 },
      { id: 'edadJubilacion', label: 'Edad a la que querrías la renta', unit: 'años', type: 'number', default: 65, min: 40, max: 75, step: 1 },
      { id: 'gastoMensual', label: 'Gasto mensual (en € de hoy)', unit: '€/mes', type: 'number', default: 1500, min: 0, max: 10000, step: 50 },
      { id: 'rentReal', label: 'Rentabilidad real anual', unit: '%', type: 'number', default: 5, min: 0, max: 12, step: 0.5, help: 'Descontada la inflación.' },
      { id: 'patrimonio', label: 'Lo que ya tienes invertido', unit: '€', type: 'number', default: 20000, min: 0, max: 2000000, step: 1000 },
      { id: 'swr', label: 'Tasa de retiro segura', unit: '%', type: 'number', default: 4, min: 2.5, max: 6, step: 0.1 }
    ],
    compute: 'coastFire',
    outputs: [
      { id: 'coast', label: 'Tu número Coast FIRE', format: 'compactEur', emphasis: true, sub: 'lo que necesitas invertido HOY' },
      { id: 'estado', label: '¿Ya estás?', format: 'text' },
      { id: 'faltan', label: 'Te falta', format: 'eur0' }
    ],
    explainer: [
      { h: 'Por qué Coast FIRE cambia la psicología', p: 'Llegar a Coast FIRE no te jubila, pero te libera de la presión: a partir de ahí podrías cubrir solo tus gastos del día a día y dejar que la cartera trabaje. Es la base del "Barista FIRE", trabajar a media máquina sabiendo que el futuro ya está encarrilado.' },
      { h: 'Cuanto más joven, más barato', p: 'El número Coast FIRE depende muchísimo de los años que le queden a tu dinero para crecer. A los 25 necesitas mucho menos invertido que a los 45 para el mismo objetivo: cada año de ventaja vale oro por el interés compuesto.' }
    ],
    faq: [
      { q: '¿En qué se diferencia del número FIRE normal?', a: 'El número FIRE es lo que necesitas para vivir de rentas ya. El Coast FIRE es lo que necesitas HOY para llegar a ese número sin aportar más, solo dejando crecer.' },
      { q: '¿Tengo que dejar de trabajar al llegar?', a: 'No. Coast FIRE solo significa que puedes dejar de aportar. Mucha gente sigue trabajando y aportando igual: simplemente lo hace con la tranquilidad de tener red.' },
      { q: '¿Y si el mercado cae justo entonces?', a: 'El plan asume una rentabilidad media; en la práctica habrá baches. La app completa simula miles de caminos para ver cuántos aguantan, no solo el escenario medio.' }
    ],
    related: ['cuando-puedo-jubilarme', 'interes-compuesto', 'tasa-de-ahorro']
  },

  /* ---------------------------------------------------------- 5 */
  {
    slug: 'cuando-puedo-jubilarme',
    category: 'Tu número',
    seo: {
      title: 'Calculadora ¿Cuándo puedo jubilarme? | A qué edad serás libre',
      description: 'Calcula a qué edad alcanzarás la independencia financiera según tu patrimonio, tu aportación mensual y la rentabilidad esperada.',
      keywords: ['cuándo puedo jubilarme', 'a qué edad me puedo jubilar', 'jubilación anticipada calculadora', 'edad independencia financiera']
    },
    hero: {
      eyebrow: 'Calculadora · Tu fecha de libertad',
      h1: '¿A qué edad dejas de depender de un sueldo?',
      intro: 'Pon dónde estás y cuánto inviertes, y verás el año en que las rentas de tu cartera cubren tu gasto. La fecha que de verdad importa.'
    },
    inputs: [
      { id: 'edadActual', label: 'Tu edad', unit: 'años', type: 'number', default: 30, min: 18, max: 70, step: 1 },
      { id: 'patrimonio', label: 'Lo que ya tienes invertido', unit: '€', type: 'number', default: 20000, min: 0, max: 2000000, step: 1000 },
      { id: 'aporteMensual', label: 'Lo que inviertes cada mes', unit: '€/mes', type: 'number', default: 500, min: 0, max: 10000, step: 50 },
      { id: 'gastoMensual', label: 'Lo que gastas al mes', unit: '€/mes', type: 'number', default: 1500, min: 0, max: 10000, step: 50 },
      { id: 'rent', label: 'Rentabilidad real anual', unit: '%', type: 'number', default: 5, min: 0, max: 12, step: 0.5, help: 'Descontada la inflación.' },
      { id: 'swr', label: 'Tasa de retiro segura', unit: '%', type: 'number', default: 4, min: 2.5, max: 6, step: 0.1 }
    ],
    compute: 'cuandoJubilarme',
    outputs: [
      { id: 'edadLibre', label: 'Serás libre', format: 'age', emphasis: true, sub: 'cuando tu cartera cubre tu gasto' },
      { id: 'anios', label: 'Tiempo que falta', format: 'years' },
      { id: 'numeroFire', label: 'Tu número FIRE', format: 'compactEur' }
    ],
    explainer: [
      { h: 'La edad es una consecuencia, no una meta', p: 'No eliges una edad y trabajas hacia ella: la edad sale de tres palancas —cuánto gastas, cuánto aportas y cuánto rinde—. Toca cualquiera y verás moverse el año. La más poderosa suele ser el gasto, porque baja tu meta y sube tu aporte a la vez.' },
      { h: 'Antes de la edad legal, ojo al puente', p: 'Si te haces libre antes de la edad de jubilación oficial, tienes que cubrir la sanidad y los años hasta que entre la pensión pública. La app modela ese "puente" y cómo la pensión alarga la vida de tu dinero después.' }
    ],
    faq: [
      { q: '¿Por qué me sale "más de 60 años"?', a: 'Significa que, con esas cifras, el plan no alcanza el número en un horizonte razonable. Sube la aportación o baja el gasto y mira cómo aparece una fecha.' },
      { q: '¿Cuenta la inflación?', a: 'Sí, indirectamente: usamos rentabilidad real, así que la cifra y la fecha están en términos de poder adquisitivo de hoy.' },
      { q: '¿Es lo mismo que "cuánto necesito"?', a: 'Comparten motor, pero esta lo enfoca en tu edad y fecha; la otra, en la cifra y el plazo. Usa la que encaje con cómo piensas tu objetivo.' }
    ],
    related: ['cuanto-necesito-para-ser-libre', 'tasa-de-ahorro', 'coast-fire']
  },

  /* ---------------------------------------------------------- 6 */
  {
    slug: 'tasa-de-ahorro',
    category: 'Estrategias',
    seo: {
      title: 'Calculadora de Tasa de Ahorro | Cuánto adelanta tu libertad',
      description: 'Descubre cómo tu tasa de ahorro decide tu fecha de libertad financiera. No es cuánto ganas: es qué porcentaje guardas.',
      keywords: ['tasa de ahorro', 'porcentaje de ahorro FIRE', 'cuánto ahorrar para jubilarse', 'savings rate']
    },
    hero: {
      eyebrow: 'Calculadora · Tasa de ahorro',
      h1: 'La palanca que casi nadie usa bien',
      intro: 'No es cuánto ganas. Es qué porcentaje guardas. Sube tu tasa de ahorro y mira cómo se desploman los años que te faltan: es el dato que más adelanta tu fecha.'
    },
    inputs: [
      { id: 'ingresoMensual', label: 'Tu ingreso neto mensual', unit: '€/mes', type: 'number', default: 2000, min: 0, max: 20000, step: 100, help: 'Lo que te entra en cuenta.' },
      { id: 'tasaAhorro', label: 'Qué porcentaje ahorras', unit: '%', type: 'number', default: 20, min: 0, max: 80, step: 1, help: 'El % de tu ingreso que inviertes. La comunidad FIRE suele moverse entre 40 % y 70 %.' },
      { id: 'patrimonio', label: 'Lo que ya tienes invertido', unit: '€', type: 'number', default: 20000, min: 0, max: 2000000, step: 1000 },
      { id: 'rent', label: 'Rentabilidad real anual', unit: '%', type: 'number', default: 5, min: 0, max: 12, step: 0.5, help: 'Descontada la inflación.' },
      { id: 'swr', label: 'Tasa de retiro segura', unit: '%', type: 'number', default: 4, min: 2.5, max: 6, step: 0.1 }
    ],
    compute: 'tasaAhorro',
    outputs: [
      { id: 'anios', label: 'Años hasta la libertad', format: 'years', emphasis: true, sub: 'desde hoy' },
      { id: 'numeroFire', label: 'Tu número FIRE', format: 'compactEur' },
      { id: 'aporteMensual', label: 'Inviertes cada mes', format: 'eur0' }
    ],
    explainer: [
      { h: 'El truco está en que la tasa de ahorro golpea por los dos lados', p: 'Subir tu tasa de ahorro hace dos cosas a la vez: aumenta lo que inviertes y reduce lo que gastas, así que baja tu número FIRE. Por eso un salto del 20 % al 40 % no recorta tu plazo a la mitad: lo recorta mucho más.' },
      { h: 'Las matemáticas, sin trampa', p: 'Con una tasa de ahorro del 10 % puedes tardar más de 40 años; con un 50 %, en torno a 15–17; con un 70 %, menos de 10. El número de partida y la rentabilidad afinan el resultado, pero el orden de magnitud lo manda la tasa de ahorro.' }
    ],
    faq: [
      { q: '¿Cómo calculo mi tasa de ahorro real?', a: 'Lo que inviertes dividido entre lo que ingresas, en neto. Si ingresas 2.000 € y guardas 600 €, tu tasa es 30 %.' },
      { q: '¿No es imposible ahorrar el 50 %?', a: 'Es exigente, no imposible. Quienes lo logran suelen combinar gasto controlado con ingresos crecientes. No hace falta llegar al 50 %; cada punto que subas adelanta tu fecha.' },
      { q: '¿Y los ingresos irregulares?', a: 'Usa tu media anual. Si tienes meses muy buenos, lo importante es que el extra vaya a inversión y no a inflar el gasto fijo.' }
    ],
    related: ['cuando-puedo-jubilarme', 'cuanto-necesito-para-ser-libre', 'interes-compuesto']
  },

  /* ---------------------------------------------------------- 7 */
  {
    slug: 'lean-fat-fire',
    category: 'Tu número',
    seo: {
      title: 'Calculadora Lean FIRE vs Fat FIRE | Tres niveles de libertad',
      description: 'Calcula tus números Lean FIRE, FIRE pleno y Fat FIRE según tu gasto. Tres estilos de independencia financiera: ajustado, normal y holgado.',
      keywords: ['lean fire', 'fat fire', 'lean fire vs fat fire', 'tipos de FIRE', 'número FIRE']
    },
    hero: {
      eyebrow: 'Calculadora · Lean / Pleno / Fat',
      h1: 'No hay una libertad. Hay tres tallas.',
      intro: 'Lean (ajustado), Pleno (tu vida actual) y Fat (con holgura). Mismo concepto, distinto nivel de gasto. Mira las tres cifras y elige hacia cuál apuntas.'
    },
    inputs: [
      { id: 'gastoMensual', label: 'Tu gasto mensual de referencia', unit: '€/mes', type: 'number', default: 1500, min: 0, max: 10000, step: 50, help: 'Tu gasto actual. Lean = ×0,7 · Pleno = ×1 · Fat = ×1,5.' },
      { id: 'swr', label: 'Tasa de retiro segura', unit: '%', type: 'number', default: 4, min: 2.5, max: 6, step: 0.1 }
    ],
    compute: 'leanFatFire',
    outputs: [
      { id: 'lean', label: 'Lean FIRE', format: 'compactEur', sub: 'vida ajustada y frugal' },
      { id: 'pleno', label: 'FIRE pleno', format: 'compactEur', emphasis: true, sub: 'tu nivel de vida actual' },
      { id: 'fat', label: 'Fat FIRE', format: 'compactEur', sub: 'vida holgada, sin recortes' }
    ],
    explainer: [
      { h: '¿Qué talla te pega?', p: 'Lean FIRE encaja con quien valora el tiempo por encima del consumo y vive con poco. Fat FIRE, con quien quiere libertad sin renunciar a viajes, caprichos o imprevistos grandes. La mayoría apunta al medio: mantener su vida actual sin trabajar por obligación.' },
      { h: 'El salto de Lean a Fat es brutal', p: 'Como el número es proporcional al gasto, pasar de Lean a Fat más que duplica la cifra que necesitas. Por eso definir bien tu gasto objetivo —ni inflado ni irrealmente bajo— es la decisión más importante de todo el plan.' }
    ],
    faq: [
      { q: '¿De dónde salen los multiplicadores 0,7 y 1,5?', a: 'Son una convención orientativa: Lean asume vivir con ~30 % menos, Fat con ~50 % más. Ajusta tu gasto base y verás cómo se mueven las tres cifras.' },
      { q: '¿Puedo empezar Lean y subir luego?', a: 'Sí, es muy común. Alcanzas Lean FIRE antes, ganas opciones, y sigues acumulando hacia Pleno o Fat con mucha menos presión.' },
      { q: '¿Cuál recomienda la regla del 4 %?', a: 'La regla solo da el multiplicador; el nivel lo eliges tú con tu gasto. Para horizontes largos, sé algo más prudente con la tasa de retiro en cualquiera de los tres.' }
    ],
    related: ['regla-del-4-por-ciento', 'cuanto-necesito-para-ser-libre', 'coast-fire']
  },

  /* ---------------------------------------------------------- 8 */
  {
    slug: 'pension-publica-estimada',
    category: 'España',
    seo: {
      title: 'Calculadora de Pensión Pública estimada (España) | Orientativa',
      description: 'Estima de forma orientativa tu pensión pública de jubilación en España según tu base de cotización y tus años cotizados.',
      keywords: ['calcular pensión jubilación', 'pensión pública España', 'cuánto cobraré de pensión', 'años cotizados pensión']
    },
    hero: {
      eyebrow: 'Calculadora · Pensión pública (España)',
      h1: '¿Cuánta pensión pública te quedaría?',
      intro: 'Una estimación orientativa de tu pensión de jubilación, para que cuente en tu plan. No sustituye al cálculo oficial de la Seguridad Social, pero te da el orden de magnitud.'
    },
    inputs: [
      { id: 'baseReguladoraMensual', label: 'Tu base de cotización media estimada', unit: '€/mes', type: 'number', default: 1800, min: 0, max: 5000, step: 50, help: 'Aproximadamente, el salario por el que cotizas. La pensión se calcula sobre la media de tus últimos años.' },
      { id: 'anosCotizados', label: 'Años cotizados al jubilarte', unit: 'años', type: 'number', default: 35, min: 0, max: 45, step: 1, help: 'Con menos de 15 no hay pensión contributiva; el 100 % se alcanza hacia los 36–37 años.' }
    ],
    compute: 'pensionPublica',
    outputs: [
      { id: 'pensionMensual', label: 'Pensión estimada', format: 'eur0', emphasis: true, sub: '≈ al mes (14 pagas) — orientativo' },
      { id: 'porcentaje', label: 'Porcentaje de tu base', format: 'pct' }
    ],
    explainer: [
      { h: 'Cómo funciona, en grande', p: 'La pensión contributiva sale de dos cosas: tu base reguladora (la media de tus bases de cotización de los últimos años) y un porcentaje que sube con los años cotizados. Hace falta un mínimo de 15 años para tener derecho; el 100 % se alcanza con unos 36–37 años cotizados.' },
      { h: 'Por qué esto es solo orientativo', p: 'El cálculo oficial es más fino: promedia un número largo de años de bases (actualizadas), aplica topes mínimos y máximos, complementos y reglas que cambian con cada reforma. Toma esta cifra como una brújula, no como un GPS, y confírmala con tu vida laboral y un simulador oficial.' }
    ],
    faq: [
      { q: '¿Por qué importa la pensión si quiero FIRE?', a: 'Porque no la pierdes por jubilarte antes de lo legal: entra a partir de la edad oficial y alarga la vida de tu cartera. Ignorarla hace que sobreestimes lo que necesitas.' },
      { q: '¿Cuál es la edad de jubilación en España?', a: 'Se sitúa en torno a los 65–67 años según los años cotizados, y va cambiando con la normativa. La pensión de esta calculadora se cobra a partir de esa edad.' },
      { q: '¿Esto cuenta como asesoramiento?', a: 'No. Es una estimación educativa muy simplificada. Para tu cifra real, usa los simuladores de la Seguridad Social y revisa tu informe de vida laboral.' }
    ],
    related: ['cuando-puedo-jubilarme', 'cuanto-necesito-para-ser-libre', 'inflacion-poder-adquisitivo']
  },

  /* ---------------------------------------------------------- 9 */
  {
    slug: 'inflacion-poder-adquisitivo',
    category: 'Fundamentos',
    seo: {
      title: 'Calculadora de Inflación | Cuánto valdrá tu dinero en el futuro',
      description: 'Calcula el poder adquisitivo futuro de tu dinero. Descubre cuánto valdrán en euros de hoy una cantidad dentro de X años con la inflación.',
      keywords: ['calculadora inflación', 'poder adquisitivo', 'valor del dinero en el tiempo', 'cuánto valdrá mi dinero']
    },
    hero: {
      eyebrow: 'Calculadora · Inflación',
      h1: 'El ladrón silencioso de tu dinero',
      intro: 'Mil euros hoy no serán mil euros mañana. La inflación erosiona tu poder adquisitivo año tras año. Mira cuánto valdrá de verdad una cantidad futura, en euros de hoy.'
    },
    inputs: [
      { id: 'importe', label: 'Una cantidad futura', unit: '€', type: 'number', default: 100000, min: 0, max: 5000000, step: 1000, help: 'El dinero que tendrás (en euros nominales) dentro de unos años.' },
      { id: 'anios', label: 'Dentro de cuántos años', unit: 'años', type: 'number', default: 20, min: 1, max: 60, step: 1 },
      { id: 'inflacion', label: 'Inflación media anual', unit: '%', type: 'number', default: 2.5, min: 0, max: 10, step: 0.1, help: 'El objetivo del BCE ronda el 2 %. La media histórica suele ser algo mayor.' }
    ],
    compute: 'inflacion',
    outputs: [
      { id: 'valorHoy', label: 'Valdrá, en € de hoy', format: 'compactEur', emphasis: true, sub: 'poder adquisitivo real' },
      { id: 'perdida', label: 'Poder adquisitivo perdido', format: 'eur0' },
      { id: 'perdidaPct', label: 'Es decir, pierdes', format: 'pct' }
    ],
    explainer: [
      { h: 'Por qué el dinero parado pierde', p: 'Si tu dinero no crece al menos al ritmo de la inflación, cada año compra menos. Tener mucho efectivo "a salvo" en el banco es, en realidad, perder poder adquisitivo de forma garantizada. Invertir no es un capricho: es defenderte de la inflación.' },
      { h: 'Esta es la razón de usar rentabilidad real', p: 'Cuando planificas FIRE en euros de hoy, conviene razonar con rentabilidad real (mercado menos inflación). Así tus cifras ya están "limpias" de inflación y representan poder adquisitivo, no números que parecen enormes pero valen menos.' }
    ],
    faq: [
      { q: '¿Qué inflación pongo?', a: 'Para el largo plazo, entre 2 % y 3 % es una hipótesis razonable en la eurozona. Puedes probar escenarios más altos para ver el riesgo.' },
      { q: '¿La inversión me protege de la inflación?', a: 'Históricamente, una cartera diversificada de renta variable ha batido a la inflación a largo plazo. No cada año, pero sí en horizontes largos.' },
      { q: '¿Puedo ver el efecto sobre mi número FIRE?', a: 'Sí: calcula tu cartera futura con interés compuesto y mete ese valor aquí para verlo en euros de hoy.' }
    ],
    related: ['interes-compuesto', 'cuanto-necesito-para-ser-libre', 'regla-del-4-por-ciento']
  },

  /* ---------------------------------------------------------- 10 */
  {
    slug: 'de-golpe-o-poco-a-poco',
    category: 'Estrategias',
    seo: {
      title: '¿Invertir de golpe o poco a poco? | Calculadora Lump Sum vs DCA',
      description: 'Te cae una cantidad de una vez: ¿la inviertes toda hoy o la repartes en el tiempo? Compara de golpe (lump sum) frente a poco a poco (DCA).',
      keywords: ['invertir de golpe o poco a poco', 'lump sum vs dca', 'dollar cost averaging', 'invertir herencia bonus']
    },
    hero: {
      eyebrow: 'Calculadora · De golpe vs poco a poco',
      h1: 'Te cae una cantidad. ¿Toda hoy o repartida?',
      intro: 'Una herencia, un bonus, unos ahorros parados. Invertirlo todo de golpe suele rendir más de media; repartirlo te protege de entrar justo en un mal día. Mira la diferencia.'
    },
    inputs: [
      { id: 'importe', label: 'Cantidad a invertir', unit: '€', type: 'number', default: 12000, min: 0, max: 2000000, step: 500 },
      { id: 'meses', label: 'Repartido en', unit: 'meses', type: 'number', default: 12, min: 1, max: 36, step: 1, help: 'Cuántos meses tardarías en invertirlo todo si vas poco a poco.' },
      { id: 'rentAnual', label: 'Rentabilidad anual esperada', unit: '%', type: 'number', default: 8, min: 0, max: 15, step: 0.5 }
    ],
    compute: 'lumpVsDca',
    outputs: [
      { id: 'lump', label: 'De golpe terminaría en', format: 'compactEur', emphasis: true },
      { id: 'dca', label: 'Poco a poco terminaría en', format: 'compactEur' },
      { id: 'diferencia', label: 'Diferencia a favor de "de golpe"', format: 'eur0' }
    ],
    explainer: [
      { h: 'Por qué de golpe gana de media', p: 'Si el mercado sube más años de los que baja —y a largo plazo lo hace—, invertir de golpe pone tu dinero a trabajar antes y más tiempo. Por eso, en promedio histórico, suele acabar por encima de repartirlo.' },
      { h: 'Por qué a veces conviene repartir igual', p: 'La media no es tu caso concreto. Si justo entras y el mercado cae un 20 %, de golpe lo sufre todo de una vez; repartido, la mayor parte aún no está expuesta. Repartir cambia algo de rentabilidad esperada por no apostarlo todo a un único día de entrada. No hay respuesta única: depende de cuánto te quite el sueño una mala racha al principio.' }
    ],
    faq: [
      { q: '¿Qué dice la evidencia?', a: 'Estudios sobre datos históricos (p. ej. de Vanguard) muestran que invertir de golpe supera a repartir en torno a dos tercios de las veces. Pero el tercio restante puede doler mucho si coincide con tu entrada.' },
      { q: '¿Y si tengo miedo a equivocarme de momento?', a: 'Repartir en pocos meses es un buen punto medio psicológico: reduce el arrepentimiento sin renunciar a casi nada de rentabilidad esperada. Lo importante es no quedarte parado sin invertir.' },
      { q: '¿Esto aplica a mi aportación mensual normal?', a: 'No: tu aportación periódica ya es, por definición, "poco a poco". Esta decisión es solo para cantidades grandes que te llegan de una vez.' }
    ],
    related: ['interes-compuesto', 'inflacion-poder-adquisitivo', 'cuanto-necesito-para-ser-libre']
  }
];

module.exports = { site, calculators };
