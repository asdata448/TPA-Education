-- Story 1.2: Base profile and role model for Supabase Auth users.
-- The first Admin will be bootstrapped in a later story using BOOTSTRAP_ADMIN_EMAIL.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'tutor')),
  full_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Security definer avoids recursive RLS when checking whether current user is an active Admin.
create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and active = true
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all"
  on public.profiles
  for select
  to authenticated
  using (public.is_active_admin());

-- Inserts/updates are intentionally not broadly available through RLS in MVP.
-- Admin user/profile creation uses server-only service-role operations in later stories.
