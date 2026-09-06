-- Create insights table
create table if not exists public.insights (
  id uuid not null primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  problem_id uuid,
  title text not null,
  summary text not null,
  analysis text not null,
  impact text not null,
  recommendation text not null,
  priority text not null default 'medium',
  confidence numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_insights_store_id on public.insights(store_id);
create index if not exists idx_insights_problem_id on public.insights(problem_id);

-- Enable Row Level Security
alter table public.insights enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Store owners can view their store insights" on public.insights;
drop policy if exists "Store owners can insert insights to their store" on public.insights;
drop policy if exists "Store owners can update their store insights" on public.insights;
drop policy if exists "Store owners can delete their store insights" on public.insights;

-- INSIGHTS RLS
create policy "Store owners can view their store insights"
  on public.insights for select
  using (
    exists (
      select 1 from public.stores
      where stores.id = insights.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can insert insights to their store"
  on public.insights for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = insights.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can update their store insights"
  on public.insights for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = insights.store_id
        and stores.owner_id = auth.uid()
    )
  );

create policy "Store owners can delete their store insights"
  on public.insights for delete
  using (
    exists (
      select 1 from public.stores
      where stores.id = insights.store_id
        and stores.owner_id = auth.uid()
    )
  );
