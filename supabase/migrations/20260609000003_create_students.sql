create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  grade_level text,
  school text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_full_name_idx on public.students (full_name);
create index if not exists students_active_idx on public.students (active);

create or replace trigger students_set_updated_at
  before update on public.students
  for each row
  execute function public.set_updated_at();

alter table public.students enable row level security;

drop policy if exists "students_admin_all" on public.students;
create policy "students_admin_all"
  on public.students
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
