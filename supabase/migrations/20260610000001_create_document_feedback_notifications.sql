-- Epic 9: Lightweight document feedback and resolution notifications.
create table if not exists public.document_feedback (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  library_item_id uuid references public.teaching_material_library_items(id) on delete set null,
  type text not null check (type in ('request_material', 'wrong_material', 'missing_material', 'broken_file', 'other')),
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'done', 'rejected')),
  admin_note text,
  reject_reason text,
  handled_by_profile_id uuid references public.profiles(id) on delete set null,
  handled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_feedback_reject_reason_check check (status <> 'rejected' or nullif(btrim(coalesce(reject_reason, '')), '') is not null)
);

create index if not exists document_feedback_tutor_id_idx on public.document_feedback (tutor_id);
create index if not exists document_feedback_status_idx on public.document_feedback (status);
create index if not exists document_feedback_class_id_idx on public.document_feedback (class_id);
create index if not exists document_feedback_library_item_id_idx on public.document_feedback (library_item_id);

create or replace trigger document_feedback_set_updated_at
  before update on public.document_feedback
  for each row execute function public.set_updated_at();

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  feedback_id uuid references public.document_feedback(id) on delete cascade,
  type text not null check (type in ('document_feedback_done', 'document_feedback_rejected')),
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_tutor_id_created_at_idx on public.notifications (tutor_id, created_at desc);
create index if not exists notifications_feedback_id_idx on public.notifications (feedback_id);
create index if not exists notifications_unread_idx on public.notifications (tutor_id) where read_at is null;

alter table public.document_feedback enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "document_feedback_admin_all" on public.document_feedback;
create policy "document_feedback_admin_all"
  on public.document_feedback
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists "document_feedback_tutor_read_own" on public.document_feedback;
create policy "document_feedback_tutor_read_own"
  on public.document_feedback
  for select
  to authenticated
  using (
    exists (
      select 1 from public.tutors
      where tutors.profile_id = auth.uid()
        and tutors.active = true
        and tutors.id = document_feedback.tutor_id
    )
  );

drop policy if exists "document_feedback_tutor_insert_own" on public.document_feedback;
create policy "document_feedback_tutor_insert_own"
  on public.document_feedback
  for insert
  to authenticated
  with check (
    status = 'pending'
    and handled_by_profile_id is null
    and handled_at is null
    and exists (
      select 1 from public.tutors
      where tutors.profile_id = auth.uid()
        and tutors.active = true
        and tutors.id = document_feedback.tutor_id
    )
  );

drop policy if exists "notifications_admin_all" on public.notifications;
create policy "notifications_admin_all"
  on public.notifications
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists "notifications_tutor_read_own" on public.notifications;
create policy "notifications_tutor_read_own"
  on public.notifications
  for select
  to authenticated
  using (
    exists (
      select 1 from public.tutors
      where tutors.profile_id = auth.uid()
        and tutors.active = true
        and tutors.id = notifications.tutor_id
    )
  );

