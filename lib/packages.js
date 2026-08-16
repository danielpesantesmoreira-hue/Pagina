// ============================================================
// PAQUETES DE PANELES — fuente única de verdad para el backend
// ============================================================
// EDITA AQUÍ los paquetes reales: cantidad de Paneles y precio en COP.
// El backend SIEMPRE usa estos precios (nunca confía en lo que mande
// el navegador), así nadie puede manipular el monto desde afuera.
//
// IMPORTANTE: si cambias algo aquí, actualiza también los mismos
// datos en index.html (sección "PANELES — PRECIOS") para que lo que
// se ve en pantalla coincida con lo que realmente se cobra.

const PACKAGES = {
  'pack-60': {
    title: '60 Paneles — Riorise',
    panels: 60,
    price: 6000,       // COP
  },
  'pack-325': {
    title: '325 Paneles — Riorise',
    panels: 325,
    price: 28000,      // COP
  },
  'pack-660': {
    title: '660 Paneles — Riorise',
    panels: 660,
    price: 54000,      // COP
  },
  'pack-1800': {
    title: '1800 Paneles — Riorise',
    panels: 1800,
    price: 128000,     // COP
  },
};

module.exports = { PACKAGES };
