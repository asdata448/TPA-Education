-- Epic 9 simplification: feedback history is the outcome surface; no separate notifications table.
alter table public.document_feedback
  add column if not exists kind text;

update public.document_feedback
set kind = case
  when library_item_id is not null then 'material_report'
  else 'material_request'
end
where kind is null;

alter table public.document_feedback
  alter column kind set not null;

alter table public.document_feedback
  drop constraint if exists document_feedback_kind_check;
alter table public.document_feedback
  add constraint document_feedback_kind_check check (kind in ('material_request', 'material_report'));

alter table public.document_feedback
  drop column if exists type;

alter table public.document_feedback
  drop column if exists class_id;

drop table if exists public.notifications;
