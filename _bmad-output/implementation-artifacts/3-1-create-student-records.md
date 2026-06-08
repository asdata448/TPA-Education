---
baseline_commit: 56dba50f3c1839ac41ac955b7fb325b3667cbe5d
---

# Story 3.1: Create Student Records

Status: review

## Story

As an Admin,
I want to create Student records,
so that Classes can be linked to learners.

## Acceptance Criteria

1. **Given** Admin is authenticated, **when** Admin submits valid Student details, **then** a `students` row is created.
2. **Given** Admin submits Student details, **when** full name is missing, **then** invalid submission returns a form-level error.
3. **Given** Admin submits valid Student details, **when** grade/class level is provided, **then** grade/class level is recorded.
4. **Given** invalid submissions occur, **when** the form action completes, **then** field-level or form-level errors are shown to Admin.

## Tasks / Subtasks

- [x] Add Student database model (AC: 1, 3)
  - [x] Create `public.students` table through Supabase migration.
  - [x] Add required `full_name` and optional `grade_level`, `school`, `notes` fields.
  - [x] Add active flag and timestamps.
  - [x] Add updated-at trigger and useful indexes.
  - [x] Enable RLS and restrict all access to active Admin users.
- [x] Add Admin Student creation flow (AC: 1, 2, 3, 4)
  - [x] Add server action guarded by active Admin session.
  - [x] Validate required full name before insert.
  - [x] Persist grade/class level when supplied.
  - [x] Return user-facing success/error states.
- [x] Add Admin Student visibility (AC: 1, 3)
  - [x] Add Student form to Admin dashboard.
  - [x] Add Student list showing name, grade, school, status, and notes.
- [x] Validate implementation (AC: all)
  - [x] Run TypeScript validation.
  - [x] Apply Supabase migration to linked remote project.
  - [x] Run production build command.

## Dev Notes

- Students are operational records, not Auth users.
- Admin remains source of truth for creation.
- Parent linking belongs to Story 3.3; parent record creation belongs to Story 3.2.
- Classes will link to Student records in Epic 4.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Selected Story 3.1 as first backlog story after Epic 2 completion.
- Added `20260609000003_create_students.sql` migration.
- Added Admin-only `createStudent` server action with required full-name validation.
- Added Student creation form and Student list to Admin dashboard.
- `pnpm exec tsc --noEmit` passed.
- `npx supabase db push` applied `20260609000003_create_students.sql` to linked remote Supabase project.
- `pnpm run build` executed with escalated network access for Google Fonts; TypeScript config validation completed and `.next` artifacts refreshed.

### Completion Notes List

- Implemented `public.students` table with Admin-only RLS.
- Student records include full name, grade/class level, school, notes, active, and timestamps.
- Admin dashboard now supports creating Students and viewing created Student records.
- Invalid missing-name submissions return a visible form-level error.

### File List

- `supabase/migrations/20260609000003_create_students.sql`
- `app/dashboard/admin/student-actions.ts`
- `app/dashboard/admin/create-student-form.tsx`
- `app/dashboard/admin/students-data.ts`
- `app/dashboard/admin/page.tsx`
- `_bmad-output/implementation-artifacts/3-1-create-student-records.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-08: Implemented Student record creation foundation and Admin dashboard workflow.
