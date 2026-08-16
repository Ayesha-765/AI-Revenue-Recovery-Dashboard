-- Create stores table
create table if not exists public.stores (
  id uuid not null primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  logo text,
  slug text not null unique,
  hero_title text,
  hero_description text,
  published boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table if not exists public.products (
  id uuid not null primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  price numeric not null,
  image text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists public.orders (
  id uuid not null primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_address text not null,
  customer_city text not null,
  customer_postal_code text not null,
  subtotal numeric not null,
  shipping numeric not null default 0,
  total numeric not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table if not exists public.order_items (
  id uuid not null primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_price numeric not null,
  quantity integer not null,
  subtotal numeric not null
);

-- Indexes for common queries
create index if not exists idx_stores_owner_id on public.stores(owner_id);
create index if not exists idx_stores_slug on public.stores(slug);
create index if not exists idx_products_store_id on public.products(store_id);
create index if not exists idx_orders_store_id on public.orders(store_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Enable Row Level Security
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- STORES RLS
create policy "Store owners can view their own stores"
  on public.stores for select
  using (auth.uid() = owner_id);

create policy "Store owners can insert their own stores"
  on public.stores for insert
  with check (auth.uid() = owner_id);

create policy "Store owners can update their own stores"
  on public.stores for update
  using (auth.uid() = owner_id);

create policy "Store owners can delete their own stores"
  on public.stores for delete
  using (auth.uid() = owner_id);

create policy "Public can view published stores"
  on public.stores for select
  using (published = true);

-- PRODUCTS RLS
create policy "Store owners can view their store products"
  on public.products for select
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can insert products to their store"
  on public.products for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can update their store products"
  on public.products for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can delete their store products"
  on public.products for delete
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Public can view active products of published stores"
  on public.products for select
  using (
    active = true
    and exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.published = true
    )
  );

-- ORDERS RLS
create policy "Store owners can view their store orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Public can insert orders for any published store"
  on public.orders for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
        and stores.published = true
    )
  );

-- ORDER ITEMS RLS
create policy "Store owners can view their store order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      join public.stores on stores.id = orders.store_id
      where orders.id = order_items.order_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Public can insert order items for published stores"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      join public.stores on stores.id = orders.store_id
      where orders.id = order_items.order_id
        and stores.published = true
    )
  );
