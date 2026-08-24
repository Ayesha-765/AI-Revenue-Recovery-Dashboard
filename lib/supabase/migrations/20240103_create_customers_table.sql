-- Create customers table
create table if not exists public.customers (
  id uuid not null primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  address text,
  total_orders integer not null default 0,
  total_spent numeric not null default 0,
  first_order_at timestamp with time zone,
  last_order_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint customers_store_email_unique unique (store_id, email)
);

-- Add customer_id to orders table
alter table public.orders add column if not exists customer_id uuid references public.customers(id) on delete set null;

-- Indexes for performance
create index if not exists idx_customers_store_id on public.customers(store_id);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_orders_customer_id on public.orders(customer_id);

-- Enable Row Level Security on customers table
alter table public.customers enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Store owners can view their store customers" on public.customers;
drop policy if exists "Store owners can insert customers to their store" on public.customers;
drop policy if exists "Store owners can update their store customers" on public.customers;
drop policy if exists "Store owners can delete their store customers" on public.customers;

-- CUSTOMERS RLS
create policy "Store owners can view their store customers"
  on public.customers for select
  using (
    exists (
      select 1 from public.stores
      where stores.id = customers.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can insert customers to their store"
  on public.customers for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = customers.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can update their store customers"
  on public.customers for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = customers.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can delete their store customers"
  on public.customers for delete
  using (
    exists (
      select 1 from public.stores
      where stores.id = customers.store_id
        and stores.owner_id = auth.uid()
    )
  );
