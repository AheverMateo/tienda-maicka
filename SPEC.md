# SPEC.md — Especificación Técnica: Catálogo con IA

## 1. Alcance por fase

### Fase 1 — Catálogo público (MVP)
- Página home con grilla de productos desde Supabase
- Buscador y filtros por categoría
- Vista de producto con talles y stock
- Botón "Pedir por WhatsApp" con mensaje pre-armado
- Deploy en Vercel

**Fuera de alcance:** panel de administración, autenticación, mejora de fotos IA.

### Fase 2 — Panel de carga
- Login del propietario con Supabase Auth
- CRUD de productos (crear, editar, eliminar, archivar)
- Gestión de stock por variante
- Subida de fotos a Supabase Storage
- Compresión de imágenes en el cliente

**Fuera de alcance:** mejora de fotos con IA.

### Fase 3 — Mejora de fotos con IA
- Ruta `/api/enhance` con validación de auth
- Integración con modelo de imagen (Gemini u OpenAI)
- Plantillas de prompt por tipo de producto
- Vista antes/después para elegir imagen
- Cuota mensual y rate limiting

### Fase 4 — Diseño y lanzamiento
- Rediseño visual con fotos reales
- URLs propias por producto con Open Graph
- Dominio personalizado en Vercel
- Analytics simple
- Guía de uso para el propietario

---

## 2. Reglas de negocio

### Productos
- Un producto puede ser de tipo `ropa` (con talles) u `otros` (sin talles).
- `ropa` → requiere al menos una variante con talle y stock.
- `otros` → puede tener cantidad opcional o stock ilimitado.
- `off = true` → el producto no aparece en el catálogo y se muestra como "Agotado".
- `featured = true` → aparece en la tira "Recién llegado".

### Talles y stock
- Cada variante tiene un talle (S, M, L, XL, Único, etc.) y un stock numérico.
- Si `stock = 0` → el talle aparece deshabilitado en el selector.
- Si todas las variantes tienen `stock = 0` → el producto se muestra como "Agotado".

### Pedidos
- El pedido se arma como texto y se envía por `wa.me` al número del negocio.
- El mensaje incluye: nombre del producto, talle seleccionado y total.
- No hay checkout ni pago online (fase actual).

### Autenticación
- Solo un usuario: el propietario del negocio.
- Login con email y contraseña vía Supabase Auth.
- RLS: lectura pública de productos/categorías/variantes/imágenes; escritura solo para el usuario autenticado.

---

## 3. Estructura de datos (Supabase)

### Tabla: `categories`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| name | text | Nombre visible |
| slug | text | URL-friendly, único |
| icon | text | Nombre del icono (opcional) |
| color | text | Color hex (opcional) |
| order_index | int | Orden de aparición |

### Tabla: `products`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| name | text | Nombre del producto |
| slug | text | URL-friendly, único |
| description | text | Descripción (opcional) |
| price | int | Precio en centavos |
| type | text | `'ropa'` (usa talles) u `'otros'` |
| category_id | uuid | FK → categories (nullable) |
| off | bool | true = oculto/agotado |
| featured | bool | true = aparece en "Recién llegado" |

### Tabla: `variants`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| talle | text | S, M, L, XL, Único... |
| stock | int | Cantidad disponible |

### Tabla: `product_images`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK → products |
| url | text | URL pública en Storage |
| is_primary | bool | true = foto principal |
| order_index | int | Orden en galería |

### Tabla: `image_jobs` (Fase 3)
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid | PK |
| image_url | text | URL de la imagen original |
| enhanced_url | text | URL de la imagen mejorada |
| status | text | `pending`, `processing`, `completed`, `failed` |
| cost | int | Costo en centavos de la llamada |
| user_id | uuid | FK → auth.users |
| error | text | Mensaje de error si falla |

---

## 4. Convenciones

- **Precios:** siempre en centavos (ej. $1.500 = 150000).
- **Slugs:** kebab-case, únicos (ej. `remera-algodon-blanco`).
- **Nombres de archivos:** kebab-case (ej. `product-card.tsx`).
- **Nombres de componentes:** PascalCase (ej. `ProductCard`).
- **Rutas API:** `/api/enhance`, `/api/products`, etc.
- **Commits:** `feat:`, `fix:`, `chore:`, `docs:` + descripción breve en inglés.
- **Secrets:** solo en variables de servidor, nunca con prefijo `NEXT_PUBLIC_`.

---

## 5. Criterios de aceptación por fase

### Fase 1
- [ ] Home muestra productos reales desde Supabase
- [ ] Buscador filtra por nombre
- [ ] Chips de categoría filtran productos
- [ ] Producto con talles muestra selector con stock
- [ ] Producto sin stock muestra "Agotado"
- [ ] Botón WhatsApp abre `wa.me` con mensaje correcto
- [ ] Deploy en Vercel accesible desde celular

### Fase 2
- [ ] Login funciona con email/password
- [ ] `/admin` redirige a login si no está autenticado
- [ ] Crear/editar/eliminar producto funciona desde `/admin`
- [ ] Subir foto desde celular funciona
- [ ] Foto se comprime antes de subir
- [ ] Cambios se reflejan en el catálogo público

### Fase 3
- [ ] Botón "Mejorar con IA" visible en cada foto del panel
- [ ] Vista antes/después permite elegir imagen
- [ ] Imagen original nunca se sobrescribe
- [ ] Cuota mensual se respeta
- [ ] Rate limiting funciona

### Fase 4
- [ ] Diseño pulido con fotos reales
- [ ] URL por producto con Open Graph
- [ ] Dominio personalizado funcionando
- [ ] Analytics registra visitas y clics en WhatsApp
- [ ] Guía de uso entregada al propietario