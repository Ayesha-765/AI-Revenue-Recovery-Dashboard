-- Add RLS policy so store owners can update their store orders (e.g. change fulfillment status)
drop policy if exists "Store owners can update their store orders" on public.orders;

create policy "Store owners can update their store orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
        and stores.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
        and stores.owner_id = auth.uid()
    )
  );
