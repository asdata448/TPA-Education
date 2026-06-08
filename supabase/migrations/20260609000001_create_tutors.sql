create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  phone text,
  specialties text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tutors_profile_id_idx on public.tutors (profile_id);
create index if not exists tutors_active_idx on public.tutors (active);

create or replace trigger tutors_set_updated_at
  before update on public.tutors
  for each row
  execute function public.set_updated_at();

alter table public.tutors enable row level security;

drop policy if exists "tutors_admin_all" on public.tutors;
create policy "tutors_admin_all"
  on public.tutors
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists "tutors_select_own" on public.tutors;
create policy "tutors_select_own"
  on public.tutors
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.id = tutors.profile_id
    )
  );