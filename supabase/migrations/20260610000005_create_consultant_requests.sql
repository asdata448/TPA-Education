-- Migration: Create consultant_requests table for landing page form submissions
create table if not exists public.consultant_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  grade text not null,
  subjects text[] not null default '{}',
  goals text[] default '{}',
  format text,
  message text,
  status text not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.consultant_requests enable row level security;

-- Policies:
-- 1. Anyone (anonymous public) can insert requests
create policy "Anyone can insert consultant requests"
  on public.consultant_requests
  for insert
  with check (true);

-- 2. Only active admin can read, update, or delete requests
create policy "Only admin can view consultant requests"
  on public.consultant_requests
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
        and profiles.active = true
    )
  );

create policy "Only admin can update consultant requests"
  on public.consultant_requests
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
        and profiles.active = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
        and profiles.active = true
    )
  );

create policy "Only admin can delete consultant requests"
  on public.consultant_requests
  for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
        and profiles.active = true
    )
  );

-- Indexes for performance
create index if not exists consultant_requests_status_idx on public.consultant_requests (status);
create index if not exists consultant_requests_created_at_idx on public.consultant_requests (created_at desc);
