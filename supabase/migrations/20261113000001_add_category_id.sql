-- Migración 002: vincular productos con categorías
-- Agrega category_id a products (nullable: un producto puede no tener categoría)

alter table public.products
  add column if not exists category_id uuid
  references public.categories(id) on delete set null;

create index if not exists products_category_id_idx
  on public.products(category_id);
