---
baseline_commit: 56dba50f3c1839ac41ac955b7fb325b3667cbe5d
---

# Story 3.2: Create Parent Records

Status: review

## Story

As an Admin,
I want to create Parent records,
so that Classes can reference parent/guardian contacts.

## Acceptance Criteria

1. **Given** Admin is authenticated, **when** Admin submits valid Parent details, **then** a `parents` row is created.
2. **Given** Admin submits Parent details, **when** name and phone are supplied, **then** Parent name and phone can be stored.
3. **Given** Admin submits invalid Parent details, **when** the action completes, **then** user-facing errors are returned.

## Tasks / Subtasks

- [x] Add Parent database model (AC: 1, 2)
  - [x] Create `public.parents` table through Supabase migration.
  - [x] Add required `full_name` and optional `phone`, `email`, `notes` fields.
  - [x] Add active flag and timestamps.
  - [x] Add indexes and updated-at trigger.
  - [x] Enable RLS and restrict all access to active Admin users.
- [x] Add Admin Parent creation flow (AC: 1, 2, 3)
  - [x] Add server action guarded by active Admin session.
  - [x] Validate required full name and optional email shape.
  - [x] Persist phone when supplied.
  - [x] Return visible success/error states.
- [x] Add Admin Parent visibility (AC: 1, 2)
  - [x] Add Parent form to Admin dashboard.
  - [x] Add Parent list showing name, phone, email, status, and notes.
- [x] Validate implementation (AC: all)
  - [x] Run TypeScript validation.
  - [x] Apply Supabase migration to linked remote project.
  - [x] Run production build command.

## Dev Notes

- Parents are operational contact records, not Auth users.
- Student-parent linking belongs to Story 3.3.
- Classes will use linked Student/Parent context in Epic 4.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Selected Story 3.2 after Story 3.1 moved to review.
- Added `20260609000004_create_parents.sql` migration.
- Added Admin-only `createParent` server action with required name and email validation.
- Added Parent creation form and Parent list to Admin dashboard.
- `pnpm exec tsc --noEmit` passed.
- `npx supabase db push` applied the parent migration to linked remote Supabase project.
- `pnpm run build` executed with escalated network access for Google Fonts; TypeScript config validation completed.

### Completion Notes List

- Implemented `public.parents` table with Admin-only RLS.
- Parent records include full name, phone, email, notes, active, and timestamps.
- Admin dashboard now supports creating Parents and viewing Parent records.
- Invalid missing-name or malformed-email submissions return visible errors.

### File List

- `supabase/migrations/20260609000004_create_parents.sql`
- `app/dashboard/admin/parent-actions.ts`
- `app/dashboard/admin/create-parent-form.tsx`
- `app/dashboard/admin/parents-data.ts`
- `app/dashboard/admin/page.tsx`
- `_bmad-output/implementation-artifacts/3-2-create-parent-records.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-08: Implemented Parent record creation foundation and Admin dashboard workflow.
