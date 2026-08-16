// ============================================================
// POST /api/webhook
// ------------------------------------------------------------
// Mercado Pago llama a esta URL automáticamente cada vez que
// el estado de un pago cambia (aprobado, rechazado, pendiente).
//
// Regla de seguridad: NUNCA confiamos en los datos que vienen en
// el aviso. Solo usamos el ID que nos manda para volver a
// preguntarle a Mercado Pago directamente "¿cómo va este pago?".
// Así nadie puede falsificar un aviso de "pago aprobado".
//
// TODO para ustedes: aquí es donde deben conectar la entrega
// automática de Paneles (por ejemplo, guardar el pedido en una
// base de datos, o enviarse una notificación por correo/WhatsApp
// Business API para saber que hay que entregar el pedido). Por
// ahora, este código solo confirma el pago y lo deja en el log.
// ============================================================

const { PACKAGES } = require('../lib/packages');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  const paymentId =
    req.body?.data?.id ||
    req.query['data.id'] ||
    req.query.id;

  const topic = req.body?.type || req.query.type || req.query.topic;

  // Solo nos interesan los avisos de pagos
  if (topic !== 'payment' || !paymentId) {
    return res.status(200).send('ok'); // respondemos 200 igual para que MP no reintente
  }

  try {
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payment = await mpResponse.json();

    if (payment.status === 'approved') {
      const packageId = (payment.external_reference || '').split('-')[0] + '-' +
        (payment.external_reference || '').split('-')[1];
      const pkg = PACKAGES[packageId];

      console.log('✅ Pago aprobado:', {
        paymentId: payment.id,
        packageId,
        panels: pkg ? pkg.panels : 'desconocido',
        payerEmail: payment.payer?.email,
        amount: payment.transaction_amount,
      });

      // TODO: entregar los Paneles aquí (guardar en base de datos,
      // notificar por WhatsApp/correo, etc.)
    } else {
      console.log(`Pago ${payment.id} con estado: ${payment.status}`);
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.error('Error procesando webhook:', err);
    // Igual respondemos 200 para evitar reintentos infinitos de Mercado Pago
    return res.status(200).send('ok');
  }
};
