# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Compradores (principal):** personas que navegan el catálogo desde el celular para
ver productos y armar un pedido. Situación típica: entra desde un link de WhatsApp
o Instagram, explora, elige y quiere resolver la compra sin fricción. Muchos usan
gama baja y conexión móvil irregular.

**Dueña del negocio (administradora):** carga y edita productos, precios, fotos y
stock desde el celular; usa el panel administrativo y la mejora de fotos con IA.
Es también quien recibe y coordina los pedidos por WhatsApp.

## Product Purpose

Catálogo de productos en línea para una tienda que vende indumentaria, bazar,
regalos, algunos productos de tecnología y otros rubros misceláneos (no vende
alimentos ni bebidas). El sitio permite al comprador explorar el catálogo, armar
un carrito y enviar el pedido por WhatsApp, donde se coordinan pago y entrega. La
dueña carga el catálogo de forma autónoma y puede mejorar las fotos de producto
con IA.

El éxito es que un cliente pueda ver un producto real, enviarlo como pedido y que
la operación se cierre por WhatsApp sin necesidad de checkout con pago online.

## Positioning

Catálogo + pedido por WhatsApp sin checkout online, pensado mobile-first para una
tienda chica. A diferencia de un e-commerce con carrito de pago, la transacción se
coordina por WhatsApp: menos fricción para la dueña y para el cliente, sin
pasarela de pago ni manejo de cobros en el sitio.

## Operating Context

- Mobile-first: la mayoría de las visitas y de la carga de productos ocurren desde
  el celular, incluyendo equipos de gama baja y conexiones lentas.
- Los productos se comparten por WhatsApp e Instagram (links a productos y al
  catálogo).
- La dueña opera el panel desde el celular; la mejora de fotos es una acción
  manual y opcional con aprobación de resultado.
- Idioma: español rioplatense (Argentina), trato informal ("vos").

## Capabilities and Constraints

- Catálogo de productos con categorías, búsqueda, grilla y ficha de producto.
- Carrito de cliente y botón "Pedir por WhatsApp" que arma el pedido en `wa.me`.
- Modelo de stock **mixto**: algunos productos manejan stock por variante
  (talles, colores, presentaciones) con deshabilitado de lo agotado; otros solo
  manejan "disponible / agotado". Un producto agotado u `off` se muestra como tal.
- Panel administrativo protegido (`/admin`) para crear/editar/eliminar productos,
  cambiar disponibilidad y editar stock, con subida de fotos a Supabase Storage
  (compresión en cliente, máx. ~1600px, varias fotos por producto con principal).
- Mejora de fotos con IA en servidor (fase posterior): valida login, guarda
  siempre la original, mejora opcional, vista antes/después, cuota y rate limit.
- Sin checkout ni pago online en el alcance actual; el cobro se coordina por
  WhatsApp.
- Restricciones técnicas: Next.js (App Router, TypeScript, Tailwind, shadcn/ui),
  Supabase (Postgres, Storage, Auth), deploy en Vercel. Toda tabla en Supabase
  lleva RLS activo (lectura pública de catálogo, escritura solo de la dueña). Las
  claves de API (IA) viven solo en el servidor; nunca en el cliente ni en el repo.
- Pendientes explícitos (decisiones abiertas, no inventar):
  - Datos reales del negocio: nombre, logo, colores, número de WhatsApp.
  - 10-15 productos reales con fotos, precios y variantes.
  - Modelo de IA para mejora de fotos (a definir entre Gemini/OpenAI).
  - Si en el futuro se suma cobro online (fuera del MVP actual).

## Brand Commitments

No hay identidad de marca confirmada todavía (nombre, logo, paleta y tono aún sin
definir por la dueña). No inventar nombre, claims ni activos de marca; se
registrarán cuando la usuaria los provea.

## Evidence on Hand

- No hay productos, fotos, precios, testimonios ni datos reales cargados aún.
  Todo dato de ejemplo es provisorio y debe reemplazarse por información real; no
  fabricar prueba social, reseñas, premios ni cifras.

## Product Principles

1. **Mobile-first real:** diseñar primero para celular y gama baja; el escritorio
   es secundario.
2. **La transacción vive en WhatsApp:** el sitio informa y arma el pedido; el
   cierre y el pago se coordinan por WhatsApp, sin fricción de checkout.
3. **Stock honesto:** mostrar siempre disponibilidad real (por variante cuando
   aplique) y nunca ofrecer lo agotado.
4. **La dueña manda:** todo lo que publica la tienda lo controla y aprueba la
   dueña, incluida la mejora de fotos con IA (la original nunca se pierde).
5. **Datos reales, no inventados:** catálogo, precios y prueba social provienen de
   información real provista por el negocio.

## Accessibility & Inclusion

Requisito de accesibilidad básica para el lanzamiento: contraste adecuado, foco
visible, textos `alt`, y funcionamiento en equipos de gama baja y conexiones
lentas. No se estableció un estándar formal (WCAG) más allá de lo básico.