# CLAUDE.md — Plan de Desarrollo: Catálogo con IA

## Contexto del Proyecto

Tienda en línea para la tía: catálogo de productos con pedidos por WhatsApp
y fotos mejoradas con IA. Referencia completa: `plan-catalogo.html`.

**Stack:** Next.js (App Router, TypeScript, Tailwind, shadcn/ui) · Supabase · Vercel

---

## Reglas de Trabajo

### Mi rol (asistente)
- Ejecuto **una tarea a la vez**, esperando confirmación antes de pasar a la siguiente.
- Al terminar una tarea: verifico (lint, tsc, prueba manual si aplica), hago commit y aviso.
- Si una tarea requiere decisión tuya (precio, texto, diseño), pregunto antes de ejecutar.
- Nunca salto tareas. Si hay bloqueo, lo informo y espero instrucción.
- La documentación (README, guías) la genero yo solo si me lo pedís explícitamente.

### Tu rol (product owner)
- Aprobás cada tarea antes de que avance a la siguiente.
- Proveés datos reales: productos, fotos, precios, número de WhatsApp, nombre del negocio.
- Validás resultados visuales cuando lo pida.
- Decidís cambios de alcance o prioridades.

### Comandos de verificación
```bash
npm run dev        # levantar servidor
npm run lint       # verificar lint
npx tsc --noEmit   # verificar tipos
```

### Convenciones
- Commits en inglés, formato: `feat:`, `fix:`, `chore:`, `docs:`
- Nunca keys ni secrets en el cliente ni en el repo.
- Toda tabla en Supabase lleva RLS activo.
- Un commit por tarea completada.

---

## Fases y Tareas

> **Regla:** una tarea a la vez. No avanzo sin tu OK.

### Fase 0 — Preparación (antes de empezar)

| # | Tarea | Estado |
|---|-------|--------|
| 0.1 | Conectar remote de GitHub al repo local | ⬜ |
| 0.2 | Crear proyecto en Supabase y obtener credenciales | ⬜ |
| 0.3 | Configurar `.env.local` con URL y key de Supabase | ⬜ |

### Fase 1 — Semana 1: Base y catálogo real
**Meta:** catálogo publicado en internet, leyendo productos de la base de datos.

| # | Tarea | Estado |
|---|-------|--------|
| 1.1 | Escribir `SPEC.md` (alcance por fase) y `CLAUDE.md` inicial | ⬜ |
| 1.2 | Crear tablas en Supabase: `categories`, `products`, `variants`, `product_images` | ⬜ |
| 1.3 | Configurar RLS: lectura pública de productos/variantes, escritura solo dueña | ⬜ |
| 1.4 | Script seed con datos de ejemplo (10-15 productos) | ⬜ |
| 1.5 | Conectar cliente Supabase a Next.js (server components) | ⬜ |
| 1.6 | Layout general: tipografías, colores, header del MVP | ⬜ |
| 1.7 | Grilla de productos en home leyendo de Supabase | ⬜ |
| 1.8 | Chips de categoría y buscador | ⬜ |
| 1.9 | Tira "Recién llegado" con productos nuevos | ⬜ |
| 1.10 | Selector de talle con stock por variante (sin stock → deshabilitado) | ⬜ |
| 1.11 | Estado "Agotado" cuando no hay stock o está `off` | ⬜ |
| 1.12 | Carrito con estado cliente (context o zustand) | ⬜ |
| 1.13 | Botón "Pedir por WhatsApp" que abre `wa.me` con pedido armado | ⬜ |
| 1.14 | Deploy en Vercel con variables de entorno | ⬜ |
| 1.15 | Probar en 2 celulares (uno de gama baja) y corregir | ⬜ |

### Fase 2 — Semana 2: Panel de carga
**Meta:** la tía carga y edita productos sola desde el celular.

| # | Tarea | Estado |
|---|-------|--------|
| 2.1 | Activar Supabase Auth (email/password), crear usuario de la tía | ⬜ |
| 2.2 | Ruta `/admin` protegida con middleware | ⬜ |
| 2.3 | RLS: escritura solo para el usuario dueño | ⬜ |
| 2.4 | Listado en el panel: productos con estado y stock | ⬜ |
| 2.5 | Botón "Marcar agotado / disponible" | ⬜ |
| 2.6 | Editar stock por talle con botones + y − | ⬜ |
| 2.7 | Formulario crear/editar producto (react-hook-form + zod) | ⬜ |
| 2.8 | Eliminar/archivar producto con confirmación | ⬜ |
| 2.9 | Subida de fotos a Supabase Storage (galería o cámara) | ⬜ |
| 2.10 | Compresión en cliente antes de subir (máx. ~1600px) | ⬜ |
| 2.11 | Varias fotos por producto, con foto principal | ⬜ |
| 2.12 | Políticas de Storage: lectura pública, escritura solo dueña | ⬜ |
| 2.13 | Prueba: la tía carga 5 productos reales sola | ⬜ |
| 2.14 | Corregir problemas de la prueba | ⬜ |
| 2.15 | Cargar 20-30 productos reales | ⬜ |

### Fase 3 — Semana 3: Mejora de fotos con IA
**Meta:** botón "Mejorar con IA" con antes y después, aprobado por la dueña.

| # | Tarea | Estado |
|---|-------|--------|
| 3.1 | Probar 8-10 fotos reales en Gemini y OpenAI, elegir modelo | ⬜ |
| 3.2 | Escribir plantillas de prompt por tipo (ropa, calzado, otros) | ⬜ |
| 3.3 | Guardar plantillas en la base para ajustarlas sin redeploy | ⬜ |
| 3.4 | Ruta `/api/enhance`: valida login, descarga original, llama modelo | ⬜ |
| 3.5 | Tabla `image_jobs` (estado, costo, error), API key solo en servidor | ⬜ |
| 3.6 | Botón "Mejorar con IA" en cada foto con indicador de carga | ⬜ |
| 3.7 | Vista antes y después para elegir cuál publicar | ⬜ |
| 3.8 | Guardar siempre la original; mejorar es opcional | ⬜ |
| 3.9 | Cuota mensual de mejoras y rate limiting | ⬜ |
| 3.10 | Validación de tipo y tamaño de archivo | ⬜ |
| 3.11 | Probar con 10 productos reales, ajustar prompts que fallen | ⬜ |
| 3.12 | Validación final con la tía (aprobar 8 de 10) | ⬜ |

### Fase 4 — Semana 4: Diseño y lanzamiento
**Meta:** sitio pulido, con dominio, listo para compartir.
*Si el tiempo aprieta, esta fase es la más prescindible.*

| # | Tarea | Estado |
|---|-------|--------|
| 4.1 | Lista priorizada de 5 mejoras de diseño con fotos reales | ⬜ |
| 4.2 | Aplicar rediseño, una mejora por commit | ⬜ |
| 4.3 | URL propia por producto para compartir en WhatsApp | ⬜ |
| 4.4 | Open Graph (foto, título, precio) para links lindos | ⬜ |
| 4.5 | Favicon, título y descripción del sitio | ⬜ |
| 4.6 | Comprar y conectar dominio en Vercel | ⬜ |
| 4.7 | Analytics simple (Vercel Analytics o Plausible) | ⬜ |
| 4.8 | Evento en cada clic de "Pedir por WhatsApp" | ⬜ |
| 4.9 | Probar en gama baja y conexión lenta | ⬜ |
| 4.10 | Revisar accesibilidad básica (contraste, foco, alt) | ⬜ |
| 4.11 | Revisar permisos RLS una última vez | ⬜ |
| 4.12 | Link en WhatsApp Business e Instagram | ⬜ |
| 4.13 | Enseñarle a la tía: cargar producto + mejorar foto (15 min) | ⬜ |
| 4.14 | Dejar guía de una página con capturas | ⬜ |

---

## Pendientes del usuario (vos)

- [ ] Datos de la tía: nombre del negocio, logo, colores, número WhatsApp
- [ ] 10-15 productos con fotos, precio y talles
- [ ] Confirmar si cobra online o solo por WhatsApp
- [ ] Responder si controla stock en pelotas, linternas y demás
- [ ] URL y key del proyecto Supabase (cuando lo cree)
- [ ] Remote URL del repo en GitHub

---

## Notas

- Si un día se complica, no arrastrar: pasar lo que falte al día siguiente.
- La Fase 4 es la más prescindible si falta tiempo.
- Página de referencia del plan original: `plan-catalogo.html`
