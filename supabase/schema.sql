-- Supabase Database Schema for Tienda Catalogo

-- Enable UUID extension
create extension if not exists "uuid";

-- Categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  color text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Products table
-- type: 'ropa' u otros
-- nombre: nombre del producto
-- precio: precio del producto
-- qty: cantidad opcional (para productos que no tienen talles)
-- off: bandera para marcar producto como fuera de stock/oculto
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  price integer not null, -- almacenado en centavos
  type text not null default 'otros', -- 'ropa' u 'otros'
  off boolean default false,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Variants table (for products with sizes like ropa)
create table if not exists variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  talle text not null,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Product images table
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Image jobs table (for IA enhancement)
create table if not exists image_jobs (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  enhanced_url text,
  status text default 'pending', -- pending, processing, completed, failed
  cost integer default 0,
  error text,
  user_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

-- Policies for public reading
-- Products: lectura pública
alter table products enable row level security;
create policy "Products are publicly readable" on products
  for select using (true);

-- Categories: lectura pública
alter table categories enable row level security;
create policy "Categories are publicly readable" on categories
  for select using (true);

-- Variants: lectura pública
alter table variants enable row level security;
create policy "Variants are publicly readable" on variants
  for select using (true);

-- Product images: lectura pública
alter table product_images enable row level security;
create policy "Product images are publicly readable" on product_images
  for select using (true);

-- Image jobs: solo el usuario dueño puede gestionar
alter table image_jobs enable row level security;
create policy "Image jobs are owner-only" on image_jobs
  using (auth.uid() = user_id);

-- RLS for admin operations (will be configured with auth)