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
    title: '1 Dia — PANEL',
    panels: 1,
    price: 100,       // COP
  },
  'pack-325': {
    title: '7 Dias — PANEL',
    panels: 2,
    price: 30500,      // COP
  },
  'pack-660': {
    title: '30 Dias — PANEL',
    panels: 3,
    price: 60800,      // COP
  },
};

module.exports = { PACKAGES };
