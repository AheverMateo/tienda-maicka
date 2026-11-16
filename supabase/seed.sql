-- Seed de datos de ejemplo — Catálogo con IA
-- ATENCIÓN: este script VACÍA las tablas de catálogo y las vuelve a cargar.
-- Pensado para correr en el SQL Editor de Supabase (una vez, en desarrollo).

begin;

delete from public.products;
delete from public.categories;

-- ============================================================
-- Categorías
-- ============================================================
insert into public.categories (name, slug, icon, order_index) values
  ('Indumentaria', 'indumentaria', 'shirt',      1),
  ('Calzado',      'calzado',      'footprints', 2),
  ('Pelotas',      'pelotas',      'circle',     3),
  ('Linternas',    'linternas',    'flashlight', 4),
  ('Otros',        'otros',        'package',    5);

-- ============================================================
-- Productos (precio en centavos)
-- ============================================================
insert into public.products (name, slug, description, price, type, category_id, featured) values
  ('Remera algodón blanca',  'remera-algodon-blanca',  'Remera de algodón peinado, corte clásico.',        1200000, 'ropa',  (select id from public.categories where slug = 'indumentaria'), true),
  ('Buzo canguro negro',     'buzo-canguro-negro',     'Buzo con capucha y bolsillo canguro, frisa.',      2800000, 'ropa',  (select id from public.categories where slug = 'indumentaria'), false),
  ('Jean mom fit',           'jean-mom-fit',           'Jean mom fit tiro alto, denim elastizado.',        3500000, 'ropa',  (select id from public.categories where slug = 'indumentaria'), false),
  ('Campera rompeviento',    'campera-rompeviento',    'Campera liviana rompeviento, con cierre.',         4500000, 'ropa',  (select id from public.categories where slug = 'indumentaria'), false),
  ('Short deportivo',        'short-deportivo',        'Short de entrenamiento con cintura elástica.',     1500000, 'ropa',  (select id from public.categories where slug = 'indumentaria'), false),
  ('Zapatillas urbanas',     'zapatillas-urbanas',     'Zapatillas urbanas de lona, suela de goma.',       5500000, 'ropa',  (select id from public.categories where slug = 'calzado'),      true),
  ('Gorra',                  'gorra',                  'Gorra con visera curva y cierre regulable.',         900000, 'otros', (select id from public.categories where slug = 'indumentaria'), false),
  ('Medias pack x3',         'medias-pack-x3',         'Pack de 3 pares de medias de algodón.',              500000, 'otros', (select id from public.categories where slug = 'indumentaria'), false),
  ('Pelota fútbol N5',       'pelota-futbol-n5',       'Pelota de fútbol número 5, cosida a máquina.',     2200000, 'otros', (select id from public.categories where slug = 'pelotas'),      true),
  ('Pelota vóley',           'pelota-voley',           'Pelota de vóley oficial, cuero sintético.',        2000000, 'otros', (select id from public.categories where slug = 'pelotas'),      false),
  ('Linterna LED recargable','linterna-led-recargable','Linterna LED recargable por USB, alta potencia.',  1800000, 'otros', (select id from public.categories where slug = 'linternas'),    true),
  ('Linterna frontal',       'linterna-frontal',       'Linterna frontal con banda ajustable, 3 modos.',   1500000, 'otros', (select id from public.categories where slug = 'linternas'),    false),
  ('Mochila urbana',         'mochila-urbana',         'Mochila urbana con compartimento para notebook.',  3000000, 'otros', (select id from public.categories where slug = 'otros'),        false),
  ('Billetera',              'billetera',              'Billetera de cuero sintético con varios porta-tarjetas.', 1200000, 'otros', (select id from public.categories where slug = 'otros'),    false),
  ('Bufanda tejida',         'bufanda-tejida',         'Bufanda tejida en lana, varios colores.',            800000, 'otros', (select id from public.categories where slug = 'indumentaria'), false);

-- ============================================================
-- Variantes (talles y stock)
--   ropa  -> múltiples talles
--   otros -> talle 'Único' con el stock disponible
-- ============================================================
insert into public.variants (product_id, talle, stock)
select p.id, v.talle, v.stock
from (values
  ('remera-algodon-blanca',  'S',   4),
  ('remera-algodon-blanca',  'M',   6),
  ('remera-algodon-blanca',  'L',   0),
  ('remera-algodon-blanca',  'XL',  3),
  ('buzo-canguro-negro',     'S',   2),
  ('buzo-canguro-negro',     'M',   5),
  ('buzo-canguro-negro',     'L',   3),
  ('jean-mom-fit',           '36',  1),
  ('jean-mom-fit',           '38',  3),
  ('jean-mom-fit',           '40',  2),
  ('jean-mom-fit',           '42',  0),
  ('campera-rompeviento',    'M',   2),
  ('campera-rompeviento',    'L',   2),
  ('campera-rompeviento',    'XL',  1),
  ('short-deportivo',        'S',   3),
  ('short-deportivo',        'M',   4),
  ('short-deportivo',        'L',   2),
  ('zapatillas-urbanas',     '38',  2),
  ('zapatillas-urbanas',     '39',  3),
  ('zapatillas-urbanas',     '40',  4),
  ('zapatillas-urbanas',     '41',  3),
  ('zapatillas-urbanas',     '42',  2),
  ('zapatillas-urbanas',     '43',  1),
  ('gorra',                  'Único', 12),
  ('medias-pack-x3',         'Único', 20),
  ('pelota-futbol-n5',       'Único', 8),
  ('pelota-voley',           'Único', 5),
  ('linterna-led-recargable','Único', 10),
  ('linterna-frontal',       'Único', 0),
  ('mochila-urbana',         'Único', 6),
  ('billetera',              'Único', 15),
  ('bufanda-tejida',         'Único', 7)
) as v(slug, talle, stock)
join public.products p on p.slug = v.slug;

commit;
