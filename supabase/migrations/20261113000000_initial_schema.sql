-- Catálogo con IA — Esquema inicial (Fase 1)
-- Tablas: categories, products, variants, product_images

create extension if not exists "pgcrypto";

-- Categorías
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  color text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Productos
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price integer not null check (price >= 0),
  type text not null default 'otros' check (type in ('ropa', 'otros')),
  off boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Variantes (talles y stock)
create table if not exists public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  talle text not null,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

create index if not exists variants_product_id_idx on public.variants(product_id);

-- Imágenes de producto
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  is_primary boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_categories on public.categories;
create trigger set_updated_at_categories
  before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_products on public.products;
create trigger set_updated_at_products
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- Lectura pública del catálogo, escritura bloqueada por ahora.
-- La escritura para el propietario se habilita en la Fase 2 (Auth).
-- ============================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.product_images enable row level security;

drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories"
  on public.categories for select
  using (true);

drop policy if exists "public_read_products" on public.products;
create policy "public_read_products"
  on public.products for select
  using (true);

drop policy if exists "public_read_variants" on public.variants;
create policy "public_read_variants"
  on public.variants for select
  using (true);

drop policy if exists "public_read_product_images" on public.product_images;
create policy "public_read_product_images"
  on public.product_images for select
  using (true);
