-- ===========================================================================
-- Mokbulpur Probasi — Database Schema
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Paste -> Run
-- Idempotent: safe to run multiple times.
-- ===========================================================================

-- ---------- 1. SETTINGS (single-row config) ----------
create table if not exists public.settings (
  id smallint primary key default 1 check (id = 1),
  org_name text not null default 'Mokbulpur Probasi',
  joining_amount integer not null default 5000,
  monthly_amount integer not null default 2000,
  collection_day_start smallint not null default 1,
  collection_day_end smallint not null default 10,
  fine_per_month integer not null default 0,
  founded_year integer not null default extract(year from now())::int,
  updated_at timestamptz not null default now()
);

-- ---------- 2. COLLECTORS (named people, not system users) ----------
create table if not exists public.collectors (
  id uuid primary key default gen_random_uuid(),
  name_bn text not null,
  name_en text not null,
  phone text,
  display_order smallint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- 3. MEMBERS ----------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name_bn text not null,
  name_en text not null,
  phone text,
  country text,
  country_flag text,
  photo_url text,
  joined_year integer not null,
  joined_month smallint not null check (joined_month between 1 and 12),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- For existing installs created before photo_url was added:
alter table public.members add column if not exists photo_url text;

create index if not exists members_active_idx on public.members(active);
create index if not exists members_joined_idx on public.members(joined_year, joined_month);

-- ---------- 4. PAYMENTS ----------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete restrict,
  collector_id uuid not null references public.collectors(id) on delete restrict,
  amount integer not null check (amount >= 0),
  fine_amount integer not null default 0 check (fine_amount >= 0),
  method text not null check (method in ('bkash','nagad','cash')),
  transaction_id text,
  payment_date date not null,
  for_year integer not null,
  for_month smallint not null check (for_month between 1 and 12),
  is_joining_payment boolean not null default false,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- For existing installs created before transaction_id was added:
alter table public.payments add column if not exists transaction_id text;

create unique index if not exists payments_member_period_unique
  on public.payments(member_id, for_year, for_month);
create index if not exists payments_for_period_idx on public.payments(for_year, for_month);
create index if not exists payments_payment_date_idx on public.payments(payment_date);

-- ---------- 5. EXPENSES ----------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  title_bn text not null,
  title_en text not null,
  description_bn text,
  description_en text,
  category text not null check (category in ('mosque','graveyard','needy','road','event','other')),
  amount integer not null check (amount >= 0),
  expense_date date not null,
  paid_from_collector_id uuid references public.collectors(id),
  receipt_url text,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expenses_expense_date_idx on public.expenses(expense_date);
create index if not exists expenses_category_idx on public.expenses(category);

-- ---------- 6. ADMINS (maps auth.users to admin role) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------- 7. HELPER: is current user an admin? ----------
create or replace function public.is_admin() returns boolean
language sql security definer stable
set search_path = public, auth
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- 8. ROW LEVEL SECURITY ----------
alter table public.settings enable row level security;
alter table public.collectors enable row level security;
alter table public.members enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.admins enable row level security;

-- Public READ on everything except admins
drop policy if exists "public_read_settings"   on public.settings;
drop policy if exists "public_read_collectors" on public.collectors;
drop policy if exists "public_read_members"    on public.members;
drop policy if exists "public_read_payments"   on public.payments;
drop policy if exists "public_read_expenses"   on public.expenses;

create policy "public_read_settings"   on public.settings   for select using (true);
create policy "public_read_collectors" on public.collectors for select using (true);
create policy "public_read_members"    on public.members    for select using (true);
create policy "public_read_payments"   on public.payments   for select using (true);
create policy "public_read_expenses"   on public.expenses   for select using (true);

-- Admin WRITE on everything
drop policy if exists "admin_write_settings"   on public.settings;
drop policy if exists "admin_write_collectors" on public.collectors;
drop policy if exists "admin_write_members"    on public.members;
drop policy if exists "admin_write_payments"   on public.payments;
drop policy if exists "admin_write_expenses"   on public.expenses;
drop policy if exists "admin_rw_admins"        on public.admins;

create policy "admin_write_settings"   on public.settings   for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_write_collectors" on public.collectors for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_write_members"    on public.members    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_write_payments"   on public.payments   for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_write_expenses"   on public.expenses   for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin_rw_admins"        on public.admins     for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- 9. updated_at TRIGGERS ----------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

drop trigger if exists members_touch on public.members;
create trigger members_touch before update on public.members
  for each row execute function public.touch_updated_at();

drop trigger if exists payments_touch on public.payments;
create trigger payments_touch before update on public.payments
  for each row execute function public.touch_updated_at();

drop trigger if exists expenses_touch on public.expenses;
create trigger expenses_touch before update on public.expenses
  for each row execute function public.touch_updated_at();

-- ---------- 10. SEED DATA ----------
insert into public.settings (id) values (1) on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from public.collectors) then
    insert into public.collectors (name_bn, name_en, phone, display_order) values
      ('রাহাত',     'Rahat',   null,            1),
      ('জুবায়ের', 'Jubayer', '01732134482', 2);
  end if;
end $$;
