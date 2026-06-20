/* ============================================================
   Mi Plan FIRE · Motor de cálculo compartido
   ------------------------------------------------------------
   UMD: funciona como require() en Node (build) y como window.FireEngine
   en el navegador (se inyecta en cada página generada).

   Cada función recibe un objeto `v` con los valores de los inputs
   (indexados por el `id` del input en el config) y devuelve un objeto
   con los resultados (indexados por el `id` del output).

   Para añadir una calculadora nueva: añade aquí su función de cálculo
   y un objeto en src/calculators.config.js. Nada más.
   ============================================================ */
;(function (root, factory) {
  var E = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = E;
  if (root) root.FireEngine = E;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function () {

  // ---- helpers ----------------------------------------------------------
  // Valor futuro con aportación mensual e interés compuesto mensual.
  function fv(inicial, aporteMensual, anios, rentAnualPct) {
    var r = (rentAnualPct / 100) / 12;
    var n = Math.round(anios * 12);
    if (r === 0) return inicial + aporteMensual * n;
    var g = Math.pow(1 + r, n);
    return inicial * g + aporteMensual * ((g - 1) / r);
  }

  // Resuelve cuántos años hasta alcanzar `objetivo`. null si > maxYears.
  function solveYears(inicial, aporteMensual, objetivo, rentAnualPct, maxYears) {
    maxYears = maxYears || 60;
    if (inicial >= objetivo) return 0;
    var r = (rentAnualPct / 100) / 12;
    var bal = inicial;
    var meses = maxYears * 12;
    for (var m = 1; m <= meses; m++) {
      bal = bal * (1 + r) + aporteMensual;
      if (bal >= objetivo) return m / 12;
    }
    return null;
  }

  function numeroFire(gastoMensual, swrPct) {
    return (gastoMensual * 12) / (swrPct / 100);
  }

  // ---- calculadoras -----------------------------------------------------
  return {
    // 1 · Regla del 4 %
    regla4: function (v) {
      var nf = numeroFire(v.gastoMensual, v.swr);
      return {
        numeroFire: nf,
        gastoAnual: v.gastoMensual * 12,
        multiplo: 100 / v.swr
      };
    },

    // 2 · ¿Cuánto necesito para ser libre?
    cuantoNecesito: function (v) {
      var nf = numeroFire(v.gastoMensual, v.swr);
      var anios = solveYears(v.patrimonio, v.aporteMensual, nf, v.rent);
      var aportado = anios == null ? null : v.patrimonio + v.aporteMensual * 12 * anios;
      return { numeroFire: nf, anios: anios, aportado: aportado };
    },

    // 3 · Interés compuesto
    interesCompuesto: function (v) {
      var total = fv(v.inicial, v.aporteMensual, v.anios, v.rent);
      var aportado = v.inicial + v.aporteMensual * 12 * v.anios;
      return { total: total, aportado: aportado, intereses: total - aportado };
    },

    // 4 · Coast FIRE
    coastFire: function (v) {
      var nf = numeroFire(v.gastoMensual, v.swr); // en € de hoy (rent es real)
      var anios = Math.max(0, v.edadJubilacion - v.edadActual);
      var r = v.rentReal / 100;
      var coast = nf / Math.pow(1 + r, anios);
      var ya = v.patrimonio >= coast;
      var faltan = Math.max(0, coast - v.patrimonio);
      return {
        coast: coast,
        estado: ya
          ? 'Sí — ya puedes dejar de aportar y aun así llegar'
          : 'Aún no — sigue aportando un poco más',
        faltan: ya ? 0 : faltan
      };
    },

    // 5 · ¿Cuándo puedo jubilarme?
    cuandoJubilarme: function (v) {
      var nf = numeroFire(v.gastoMensual, v.swr);
      var anios = solveYears(v.patrimonio, v.aporteMensual, nf, v.rent);
      var edad = anios == null ? null : v.edadActual + anios;
      return { edadLibre: edad, anios: anios, numeroFire: nf };
    },

    // 6 · Tasa de ahorro → fecha de libertad
    tasaAhorro: function (v) {
      var gastoMensual = v.ingresoMensual * (1 - v.tasaAhorro / 100);
      var aporteMensual = v.ingresoMensual * (v.tasaAhorro / 100);
      var nf = numeroFire(gastoMensual, v.swr);
      var anios = solveYears(v.patrimonio, aporteMensual, nf, v.rent);
      return { anios: anios, numeroFire: nf, aporteMensual: aporteMensual };
    },

    // 7 · Lean / Pleno / Fat FIRE
    leanFatFire: function (v) {
      var base = numeroFire(v.gastoMensual, v.swr);
      return { lean: base * 0.7, pleno: base, fat: base * 1.5 };
    },

    // 8 · Pensión pública estimada (España) — orientativo
    pensionPublica: function (v) {
      var pct;
      if (v.anosCotizados < 15) pct = 0;                       // sin derecho a contributiva
      else pct = Math.min(1, 0.5 + (v.anosCotizados - 15) * (0.5 / 21.5)); // 15→50%, ~36,5→100%
      return {
        pensionMensual: v.baseReguladoraMensual * pct,
        porcentaje: pct * 100,
        nota: v.anosCotizados < 15
          ? 'Con menos de 15 años cotizados no hay pensión contributiva.'
          : ''
      };
    },

    // 9 · Inflación / poder adquisitivo
    inflacion: function (v) {
      var valorHoy = v.importe / Math.pow(1 + v.inflacion / 100, v.anios);
      var perdida = v.importe - valorHoy;
      return {
        valorHoy: valorHoy,
        perdida: perdida,
        perdidaPct: (perdida / v.importe) * 100
      };
    },

    // 10 · ¿De golpe o poco a poco? (lump sum vs DCA)
    lumpVsDca: function (v) {
      var r = (v.rentAnual / 100) / 12;
      var n = Math.round(v.meses);
      // De golpe: todo invertido hoy, crece n meses
      var lump = v.importe * Math.pow(1 + r, n);
      // Poco a poco: importe/n cada mes; cada tramo crece los meses que le quedan
      var cuota = v.importe / n;
      var dca = 0;
      for (var m = 0; m < n; m++) dca += cuota * Math.pow(1 + r, n - m);
      return { lump: lump, dca: dca, diferencia: lump - dca };
    }
  };
});
