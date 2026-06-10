-- Migration: Create class_sessions table for tracking single sessions, attendance, and rescheduling
create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'attended', 'absent', 'cancelled')),
  tutor_comments text,
  attendance_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_sessions_time_check check (end_time > start_time)
);

-- Enable RLS
alter table public.class_sessions enable row level security;

-- Policies:
-- 1. Active Admin has full access
create policy "Admin has full access on class_sessions"
  on public.class_sessions
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

-- 2. Active Tutor can read sessions assigned to them
create policy "Tutors can view their assigned class_sessions"
  on public.class_sessions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.tutors t
      join public.classes c on c.tutor_id = t.id
      where t.profile_id = auth.uid()
        and t.active
        and c.id = class_sessions.class_id
    )
  );

-- 3. Active Tutor can update status, comments, times for rescheduling of their own sessions
create policy "Tutors can update their own class_sessions"
  on public.class_sessions
  for update
  to authenticated
  using (
    exists (
      select 1 from public.tutors t
      join public.classes c on c.tutor_id = t.id
      where t.profile_id = auth.uid()
        and t.active
        and c.id = class_sessions.class_id
    )
  )
  with check (
    exists (
      select 1 from public.tutors t
      join public.classes c on c.tutor_id = t.id
      where t.profile_id = auth.uid()
        and t.active
        and c.id = class_sessions.class_id
    )
  );

-- Indexes for performance
create index if not exists class_sessions_class_id_idx on public.class_sessions (class_id);
create index if not exists class_sessions_date_idx on public.class_sessions (session_date);
create index if not exists class_sessions_status_idx on public.class_sessions (status);

-- Trigger to automatically update updated_at timestamp
create or replace trigger class_sessions_set_updated_at
  before update on public.class_sessions
  for each row execute function public.set_updated_at();
