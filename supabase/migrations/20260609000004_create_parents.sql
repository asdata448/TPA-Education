create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists parents_full_name_idx on public.parents (full_name);
create index if not exists parents_phone_idx on public.parents (phone);
create index if not exists parents_active_idx on public.parents (active);

create or replace trigger parents_set_updated_at
  before update on public.parents
  for each row
  execute function public.set_updated_at();

alter table public.parents enable row level security;

drop policy if exists "parents_admin_all" on public.parents;
create policy "parents_admin_all"
  on public.parents
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
