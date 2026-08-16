# Riorise Store — Checkout real con Mercado Pago

## Qué hay en esta carpeta

- `index.html` — la tienda (catálogo de Paneles + botones de compra).
- `gracias.html`, `pago-pendiente.html`, `pago-fallido.html` — páginas a las
  que Mercado Pago devuelve al comprador según el resultado del pago.
- `api/create-preference.js` — función que crea el pago en Mercado Pago
  (corre en el servidor, no en el navegador).
- `api/webhook.js` — recibe el aviso automático de Mercado Pago cuando un
  pago se aprueba, para que puedas confirmar la entrega de Paneles.
- `lib/packages.js` — la lista real de paquetes y precios (COP). **Esta es
  la única fuente de verdad para los precios** — edítala aquí primero.

## 1. Edita tus paquetes y precios reales

Abre `lib/packages.js` y cambia las cantidades de Paneles y los precios en
COP. Luego actualiza los mismos datos en `index.html` (busca
`data-package-id`) para que lo que se ve coincida con lo que se cobra.

## 2. Sube el proyecto a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com) (puede ser privado).
2. Sube esta carpeta completa a ese repositorio (por la web de GitHub con
   "Upload files", o con git si lo conoces).

## 3. Despliega en Vercel

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta gratis (puedes
   entrar directo con tu cuenta de GitHub).
2. Click en **"Add New" → "Project"** y elige el repositorio que acabas de
   subir.
3. Antes de darle a "Deploy", abre **"Environment Variables"** y agrega:
   - Nombre: `MP_ACCESS_TOKEN`
   - Valor: el **Access Token de producción** que te dio Mercado Pago
     (el privado, el que no se comparte por chat).
4. Dale a **Deploy**. En un minuto te da una URL real, algo como
   `https://riorise-store.vercel.app`.

## 4. Actualiza la URL en Mercado Pago

Vuelve al panel de Mercado Pago (Tus integraciones → tu app → datos básicos)
y reemplaza la URL temporal de Netlify por tu nueva URL de Vercel.

## 5. Configura el webhook en Mercado Pago

En el panel de tu aplicación de Mercado Pago, busca la sección
**"Webhooks" / "Notificaciones"** y agrega esta URL:

```
https://TU-DOMINIO.vercel.app/api/webhook
```

Así Mercado Pago te avisa automáticamente cada vez que se aprueba un pago.

## 6. Haz una prueba real con un monto pequeño

Antes de anunciar la tienda, compra tú mismo un paquete barato con una
tarjeta real (o pídele a alguien de confianza) para confirmar que:

- el botón te lleva a Mercado Pago,
- el pago se aprueba,
- te redirige a `gracias.html`,
- y el pago aparece en tu cuenta de Mercado Pago.

## Nota de seguridad

- El **Access Token** y cualquier otra clave privada solo van en
  "Environment Variables" de Vercel — nunca en el código ni en el chat.
- El **Public Key** (`APP_USR-...`) no se usa en este checkout porque
  Checkout Pro redirige al comprador a la página segura de Mercado Pago;
  no hace falta manejar datos de tarjeta en tu propio sitio.
- La entrega de Paneles después de un pago aprobado (`api/webhook.js`)
  está marcada con un `TODO` — ahí es donde conectarían el siguiente paso
  (por ejemplo, guardar el pedido o avisarse a sí mismos para entregarlo).
