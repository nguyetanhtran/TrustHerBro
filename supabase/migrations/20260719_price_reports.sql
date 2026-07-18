-- Run in Supabase SQL editor for price-report persistence + catalog overrides.
create table if not exists public.price_reports (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  item text not null,
  amount_vnd integer not null check (amount_vnd > 0),
  note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'merged')),
  created_at timestamptz not null default now()
);

create table if not exists public.regional_price_overrides (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  item text not null,
  category text not null default 'goods',
  min_vnd integer not null,
  max_vnd integer not null,
  source text not null default 'traveler-reports',
  updated_at timestamptz not null default now(),
  unique (city, item)
);

create index if not exists price_reports_city_item_idx on public.price_reports (city, item, status);

alter table public.price_reports enable row level security;
alter table public.regional_price_overrides enable row level security;

drop policy if exists "price_reports_insert" on public.price_reports;
create policy "price_reports_insert" on public.price_reports for insert with check (true);

drop policy if exists "price_reports_select" on public.price_reports;
create policy "price_reports_select" on public.price_reports for select using (true);

drop policy if exists "price_reports_update" on public.price_reports;
create policy "price_reports_update" on public.price_reports for update using (true);

drop policy if exists "overrides_select" on public.regional_price_overrides;
create policy "overrides_select" on public.regional_price_overrides for select using (true);

drop policy if exists "overrides_upsert" on public.regional_price_overrides;
create policy "overrides_upsert" on public.regional_price_overrides for all using (true) with check (true);
