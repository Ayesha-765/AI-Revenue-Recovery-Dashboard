-- Add payment_status and customer_id to orders table
-- This migration alters the existing orders table to add missing columns

alter table public.orders add column if not exists payment_status text not null default 'pending';
alter table public.orders add column if not exists customer_id uuid references public.customers(id) on delete set null;

-- Create index for customer_id if it doesn't exist
create index if not exists idx_orders_customer_id on public.orders(customer_id);
