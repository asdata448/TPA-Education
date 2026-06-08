---
baseline_commit: 56dba50f3c1839ac41ac955b7fb325b3667cbe5d
---

# Story 2.3: Admin Views and Edits Tutor Profiles

Status: review

## Story

As an Admin,
I want to view and edit Tutor profiles,
so that Tutor information stays current.

## Acceptance Criteria

1. **Given** at least one Tutor exists, **when** Admin opens the Tutor list, **then** Tutors are listed with key profile fields and active status.
2. **Given** at least one Tutor exists, **when** Admin selects a Tutor, **then** Admin can open a Tutor detail page.
3. **Given** Admin is on a Tutor detail page, **when** Admin updates editable Tutor profile fields, **then** the changes are persisted.
4. **Given** a Tutor is made inactive, **when** they attempt to log in or access the Tutor dashboard, **then** access is blocked.

## Tasks / Subtasks

- [x] Create Admin Tutor list UI (AC: 1, 2)
  - [x] Load Tutor rows with key joined profile fields.
  - [x] Show active status in the Admin dashboard.
  - [x] Add navigation from list to Tutor detail page.
- [x] Create Admin Tutor detail edit flow (AC: 2, 3)
  - [x] Add server-loaded Tutor detail page.
  - [x] Add editable form for profile and Tutor operational fields.
  - [x] Persist profile and Tutor updates through server action.
- [x] Enforce inactive Tutor access lock (AC: 4)
  - [x] Sync Tutor active changes into `profiles.active`.
  - [x] Ensure login/dashboard checks respect inactive profile state.
- [x] Validate build impact and update sprint artifacts (AC: all)
  - [x] Run validation commands available in sandbox.
  - [x] Update sprint status after implementation is complete.

## Dev Notes

- Story 2.1 created `public.tutors`.
- Story 2.2 added Tutor provisioning.
- Story 2.3 extends the Admin dashboard into a management workspace.
- Keep privileged data reads/writes in server-only code.
- Treat `profiles.active` as the access-control source of truth for login/dashboard blocking.
- Keep `tutors.active` synchronized with `profiles.active` to avoid split-brain status.

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Continuing sprint after Story 2.2 moved to review.
- Story 2.3 selected as next backlog item.
- Added server-only Admin data loader for Tutor list/detail reads.
- Addressed review findings: removed inner join dependency, surfaced DB/Auth API errors, paginated Auth user loading, and kept Admin access recoverable while blocking inactive Tutors.
- Extended Admin dashboard with Tutor table and detail navigation.
- Added Tutor detail editor with profile + Tutor field persistence.
- Updated `proxy.ts` to reject inactive profiles at dashboard middleware layer.
- `pnpm exec tsc --noEmit` still fails on pre-existing unrelated repo issues in `components/learning-path-section.tsx`, `components/ui/badge-animation.tsx`, and `components/ui/text-reveal.tsx`.
- `pnpm run build` in sandbox still fails on blocked Google Fonts fetch from `app/layout.tsx`.

### Completion Notes List

- Added Admin Tutor list showing name, email, active state, subjects, and phone.
- Added Admin Tutor detail page for editing full name, operational fields, notes, and active status.
- Synced Tutor activation edits into both `profiles.active` and `tutors.active`.
- Middleware now blocks inactive users from `/dashboard/*`, satisfying Tutor dashboard lock when deactivated.

### File List

- `app/dashboard/admin/actions.ts`
- `app/dashboard/admin/data.ts`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/admin/tutors/[tutorId]/page.tsx`
- `app/dashboard/admin/tutors/[tutorId]/edit-tutor-form.tsx`
- `proxy.ts`
- `_bmad-output/implementation-artifacts/2-3-admin-views-and-edits-tutor-profiles.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-08: Implemented Admin Tutor listing, detail editing, and inactive-access enforcement.

