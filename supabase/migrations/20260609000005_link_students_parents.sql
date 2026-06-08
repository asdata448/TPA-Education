create table if not exists public.student_parents (
  student_id uuid not null references public.students(id) on delete cascade,
  parent_id uuid not null references public.parents(id) on delete cascade,
  relationship text,
  created_at timestamptz not null default now(),
  primary key (student_id, parent_id)
);

create index if not exists student_parents_parent_id_idx on public.student_parents (parent_id);

alter table public.student_parents enable row level security;

drop policy if exists "student_parents_admin_all" on public.student_parents;
create policy "student_parents_admin_all"
  on public.student_parents
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());
