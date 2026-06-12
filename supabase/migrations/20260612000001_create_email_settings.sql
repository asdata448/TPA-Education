create table if not exists public.email_settings (
  id boolean primary key default true,
  admin_notification_emails text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_settings_singleton check (id = true)
);

insert into public.email_settings (id, admin_notification_emails)
values (true, array['tameanhanh@gmail.com', 'phuchcm2006@gmail.com'])
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists email_settings_set_updated_at on public.email_settings;
create trigger email_settings_set_updated_at
before update on public.email_settings
for each row execute function public.set_updated_at();

alter table public.email_settings enable row level security;

drop policy if exists "email_settings_admin_select" on public.email_settings;
create policy "email_settings_admin_select"
on public.email_settings
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
    and profiles.active = true
  )
);

drop policy if exists "email_settings_admin_update" on public.email_settings;
create policy "email_settings_admin_update"
on public.email_settings
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
