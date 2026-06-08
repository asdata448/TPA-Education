---
baseline_commit: 56dba50f3c1839ac41ac955b7fb325b3667cbe5d
---

# Story 3.3: Link Students and Parents

Status: review

## Story

As an Admin,
I want to link Students and Parents,
so that each Class can expose correct guardian context.

## Acceptance Criteria

1. **Given** a Student and Parent exist, **when** Admin links them, **then** a `student_parents` relation is created.
2. **Given** Admin tries to link the same Student and Parent twice, **when** the second link is submitted, **then** duplicate links are prevented.
3. **Given** a Student has linked Parents, **when** Admin opens the Student detail page, **then** linked Parents appear on the Student detail page.

## Tasks / Subtasks

- [x] Add Student-Parent relation schema (AC: 1, 2)
  - [x] Create `public.student_parents` join table.
  - [x] Add composite primary key on `student_id, parent_id` to prevent duplicates.
  - [x] Add parent lookup index.
  - [x] Enable RLS and restrict all access to active Admin users.
- [x] Add Admin linking flow (AC: 1, 2)
  - [x] Add Student detail page.
  - [x] Add Parent selector and optional relationship field.
  - [x] Add server action guarded by active Admin session.
  - [x] Return duplicate-link user-facing error.
- [x] Show linked Parents on Student detail (AC: 3)
  - [x] Load linked Parents with relationship, phone, and email.
  - [x] Render linked Parent table on Student detail page.
  - [x] Add Student list link to detail page.
- [x] Validate implementation (AC: all)
  - [x] Run TypeScript validation.
  - [x] Apply Supabase migration to linked remote project.
  - [x] Run production build command.

## Dev Notes

- Students and Parents were created in Stories 3.1 and 3.2.
- This story creates relation only; deeper edit/delete relationship UX can be added later.
- Class views in Epic 4 can use this link to expose guardian context.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Selected Story 3.3 after Story 3.2 moved to review.
- Added `20260609000005_link_students_parents.sql` migration.
- Added Student detail loader with linked Parent query.
- Added link action with duplicate primary-key handling.
- Added Student detail page and link form.
- Updated Admin Student list with Open detail action.
- `pnpm exec tsc --noEmit` passed.
- `npx supabase db push` applied the relation migration to linked remote Supabase project.
- `pnpm run build` executed with escalated network access for Google Fonts; TypeScript config validation completed.

### Completion Notes List

- Implemented `public.student_parents` relation with Admin-only RLS.
- Duplicate Student/Parent links are prevented by composite primary key and surfaced as friendly errors.
- Admin can open Student detail and see linked Parents.
- Admin can link existing Parents to a Student with optional relationship label.

### File List

- `supabase/migrations/20260609000005_link_students_parents.sql`
- `app/dashboard/admin/students/link-actions.ts`
- `app/dashboard/admin/student-detail-data.ts`
- `app/dashboard/admin/students/[studentId]/page.tsx`
- `app/dashboard/admin/students/[studentId]/link-parent-form.tsx`
- `app/dashboard/admin/page.tsx`
- `_bmad-output/implementation-artifacts/3-3-link-students-and-parents.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-08: Implemented Student-Parent linking and Student detail guardian view.
