-- Epic 4/5/6 rush MVP: classes, schedules, open-class requests.
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.subjects (name)
values ('Math'), ('English'), ('Physics'), ('Chemistry'), ('Programming')
on conflict (name) do nothing;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  tutor_id uuid references public.tutors(id) on delete set null,
  student_name text not null,
  student_grade text,
  parent_name text,
  parent_phone text,
  parent_email text,
  mode text not null default 'online' check (mode in ('online', 'offline', 'hybrid')),
  location text,
  start_date date,
  tuition_fee numeric(12,2),
  tutor_pay numeric(12,2),
  schedule_notes text,
  requirements text,
  notes text,
  status text not null default 'open' check (status in ('open', 'assigned', 'paused', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_assigned_status_check check (
    (status = 'assigned' and tutor_id is not null) or status <> 'assigned'
  )
);

create index if not exists classes_tutor_id_idx on public.classes (tutor_id);
create index if not exists classes_status_idx on public.classes (status);
create index if not exists classes_subject_id_idx on public.classes (subject_id);

create or replace trigger classes_set_updated_at
  before update on public.classes
  for each row execute function public.set_updated_at();

create table if not exists public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint class_schedules_time_check check (end_time > start_time)
);

create index if not exists class_schedules_class_id_idx on public.class_schedules (class_id);

create table if not exists public.class_requests (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists class_requests_unique_active_idx
  on public.class_requests (class_id, tutor_id)
  where status = 'pending';
create index if not exists class_requests_class_id_idx on public.class_requests (class_id);
create index if not exists class_requests_tutor_id_idx on public.class_requests (tutor_id);

create or replace trigger class_requests_set_updated_at
  before update on public.class_requests
  for each row execute function public.set_updated_at();

alter table public.subjects enable row level security;
alter table public.classes enable row level security;
alter table public.class_schedules enable row level security;
alter table public.class_requests enable row level security;

drop policy if exists "subjects_authenticated_read" on public.subjects;
create policy "subjects_authenticated_read" on public.subjects for select to authenticated using (true);
drop policy if exists "subjects_admin_all" on public.subjects;
create policy "subjects_admin_all" on public.subjects for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());

drop policy if exists "classes_admin_all" on public.classes;
create policy "classes_admin_all" on public.classes for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
drop policy if exists "classes_tutor_read_assigned_or_open" on public.classes;
create policy "classes_tutor_read_assigned_or_open" on public.classes for select to authenticated using (
  exists (select 1 from public.tutors where tutors.profile_id = auth.uid() and tutors.active and (classes.tutor_id = tutors.id or classes.status = 'open'))
);

drop policy if exists "class_schedules_admin_all" on public.class_schedules;
create policy "class_schedules_admin_all" on public.class_schedules for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
drop policy if exists "class_schedules_tutor_read" on public.class_schedules;
create policy "class_schedules_tutor_read" on public.class_schedules for select to authenticated using (
  exists (
    select 1 from public.classes c join public.tutors t on t.profile_id = auth.uid()
    where c.id = class_schedules.class_id and t.active and (c.tutor_id = t.id or c.status = 'open')
  )
);

drop policy if exists "class_requests_admin_all" on public.class_requests;
create policy "class_requests_admin_all" on public.class_requests for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
drop policy if exists "class_requests_tutor_read_own" on public.class_requests;
create policy "class_requests_tutor_read_own" on public.class_requests for select to authenticated using (
  exists (select 1 from public.tutors where tutors.profile_id = auth.uid() and tutors.id = class_requests.tutor_id)
);
drop policy if exists "class_requests_tutor_insert_own" on public.class_requests;
create policy "class_requests_tutor_insert_own" on public.class_requests for insert to authenticated with check (
  status = 'pending' and exists (select 1 from public.tutors where tutors.profile_id = auth.uid() and tutors.active and tutors.id = class_requests.tutor_id)
);
