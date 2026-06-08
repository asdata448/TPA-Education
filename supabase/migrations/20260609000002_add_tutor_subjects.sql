alter table public.tutors
  add column if not exists subjects text;

comment on column public.tutors.subjects is 'MVP free-text subject summary for Admin Tutor management. Structured subjects table can replace this later.';