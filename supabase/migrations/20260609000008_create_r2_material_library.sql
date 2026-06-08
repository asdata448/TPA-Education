-- Epic 8.1: Cloudflare R2 material library foundation.
create table if not exists public.teaching_material_library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject_id uuid references public.subjects(id) on delete set null,
  subject_name text,
  grade_level text,
  description text,
  active boolean not null default true,
  created_by_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teaching_material_library_items_active_idx
  on public.teaching_material_library_items (active);
create index if not exists teaching_material_library_items_subject_id_idx
  on public.teaching_material_library_items (subject_id);

create or replace trigger teaching_material_library_items_set_updated_at
  before update on public.teaching_material_library_items
  for each row execute function public.set_updated_at();

create table if not exists public.teaching_material_library_files (
  id uuid primary key default gen_random_uuid(),
  library_item_id uuid not null references public.teaching_material_library_items(id) on delete cascade,
  r2_key text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  version integer not null default 1,
  uploaded_by_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists teaching_material_library_files_item_id_idx
  on public.teaching_material_library_files (library_item_id);

alter table public.teaching_material_library_items enable row level security;
alter table public.teaching_material_library_files enable row level security;

drop policy if exists "teaching_material_library_items_admin_all" on public.teaching_material_library_items;
create policy "teaching_material_library_items_admin_all"
  on public.teaching_material_library_items
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists "teaching_material_library_items_tutor_active_read" on public.teaching_material_library_items;
create policy "teaching_material_library_items_tutor_active_read"
  on public.teaching_material_library_items
  for select
  to authenticated
  using (
    active = true
    and exists (
      select 1 from public.tutors
      where tutors.profile_id = auth.uid()
        and tutors.active = true
    )
  );

drop policy if exists "teaching_material_library_files_admin_all" on public.teaching_material_library_files;
create policy "teaching_material_library_files_admin_all"
  on public.teaching_material_library_files
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists "teaching_material_library_files_tutor_active_read" on public.teaching_material_library_files;
create policy "teaching_material_library_files_tutor_active_read"
  on public.teaching_material_library_files
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.teaching_material_library_items item
      where item.id = teaching_material_library_files.library_item_id
        and item.active = true
    )
    and exists (
      select 1 from public.tutors
      where tutors.profile_id = auth.uid()
        and tutors.active = true
    )
  );
