// ============================================================
// POST /api/create-preference
// ------------------------------------------------------------
// Recibe { packageId } desde el frontend, busca el precio REAL
// en lib/packages.js (nunca confía en un precio enviado por el
// navegador) y crea una preferencia de pago en Mercado Pago.
// Devuelve la URL (init_point) a la que hay que redirigir al
// comprador para que pague.
//
// Necesita la variable de entorno MP_ACCESS_TOKEN configurada
// en el panel de Vercel (Settings → Environment Variables).
// NUNCA pongas el Access Token directamente en este archivo.
// ============================================================

const { PACKAGES } = require('../lib/packages');

module.exports = async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('Falta configurar MP_ACCESS_TOKEN en las variables de entorno');
    return res.status(500).json({ error: 'Configuración incompleta del servidor' });
  }

  const { packageId } = req.body || {};
  const selected = PACKAGES[packageId];

  if (!selected) {
    return res.status(400).json({ error: 'Paquete no válido' });
  }

  // Origen real del sitio (para armar las URLs de retorno)
  const origin =
    req.headers.origin ||
    `https://${req.headers.host}`;

  const preferenceBody = {
    items: [
      {
        id: packageId,
        title: selected.title,
        quantity: 1,
        currency_id: 'COP',
        unit_price: selected.price,
      },
    ],
    back_urls: {
      success: `${origin}/gracias.html`,
      pending: `${origin}/pago-pendiente.html`,
      failure: `${origin}/pago-fallido.html`,
    },
    auto_return: 'approved',
    external_reference: `${packageId}-${Date.now()}`,
    notification_url: `${origin}/api/webhook`,
    statement_descriptor: 'RIORISE STORE',
  };

  try {
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceBody),
    });

    const data = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Error de Mercado Pago:', data);
      return res.status(502).json({ error: 'No se pudo crear la preferencia de pago' });
    }

    // init_point = link de producción, sandbox_init_point = link de pruebas
    return res.status(200).json({
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (err) {
    console.error('Error creando preferencia:', err);
    return res.status(500).json({ error: 'Error interno al crear el pago' });
  }
};
