---
baseline_commit: 56dba50f3c1839ac41ac955b7fb325b3667cbe5d
---

# Story 2.2: Admin Creates Tutor Account with Generated Password

Status: review

## Story

As an Admin,
I want to create a Tutor account with a generated initial password,
so that I can onboard Tutors without exposing account creation to the public.

## Acceptance Criteria

1. **Given** Admin is authenticated, **when** Admin submits valid Tutor account details, **then** a Supabase Auth user is created server-side.
2. **Given** Admin submits valid Tutor account details, **when** account provisioning succeeds, **then** a `profiles` row with role `tutor` is created.
3. **Given** Admin submits valid Tutor account details, **when** account provisioning succeeds, **then** a `tutors` row is created.
4. **Given** the Tutor account is created successfully, **when** the action completes, **then** the generated password is shown once for Admin to copy.
5. **Given** a Tutor email already exists, **when** Admin attempts to create the account, **then** the app rejects the duplicate with a user-facing error.

## Tasks / Subtasks

- [x] Add Admin-only Tutor account provisioning server action (AC: 1, 2, 3, 5)
  - [x] Use current authenticated session to verify the caller is an active Admin.
  - [x] Use Supabase service-role admin API server-side to create the Auth user.
  - [x] Insert the matching `profiles` row with role `tutor`.
  - [x] Insert the matching `tutors` row with operational fields from the form.
  - [x] Roll back the Auth user if downstream profile/tutor inserts fail.
  - [x] Return a duplicate-email user-facing error when Supabase rejects an existing email.
- [x] Add Admin Tutor-creation UI in dashboard (AC: 1, 4, 5)
  - [x] Replace the Admin placeholder page with a Tutor account creation form.
  - [x] Collect at least full name and email, plus Tutor operational profile fields aligned with Story 2.1.
  - [x] Show submission errors inline for Admin.
  - [x] Show the generated password in a one-time success state for Admin to copy.
- [x] Keep implementation aligned with existing auth and project patterns (AC: 1-5)
  - [x] Keep service-role usage in server-only code.
  - [x] Reuse existing role model and dashboard route conventions.
  - [x] Avoid exposing account creation to public routes or client-side privileged APIs.
- [x] Validate build impact and note blockers (AC: all)
  - [x] Run `pnpm run build` after implementation.
  - [x] Document any unrelated repo-wide issues that affect standalone type-check confidence.

## Dev Notes

### Story Scope

This story covers Admin-driven Tutor account creation only. It does **not** include Tutor list/table browsing, editing existing Tutor profiles, activation toggles, or password reset UX. Those belong to Story 2.3 or later stories.

### Epic Context

Epic 2 enables Admin to create and manage Tutor accounts and profiles.
- Story 2.1 established `public.tutors` and supporting RLS/types.
- Story 2.2 now provisions the actual Auth user + `profiles` + `tutors` records.
- Story 2.3 will add Admin read/update management for existing Tutors.

### Previous Story Intelligence

From completed stories:
- Story 1.3 established SSR login/session handling with Supabase.
- Story 1.4 established Admin/Tutor dashboard route protection.
- Story 2.1 added `public.tutors`, RLS, and `lib/db/types.ts` mapping.
- `lib/supabase/admin.ts` already exists as the service-role client location.

### Implementation Guidance

- Account creation must be server-side only.
- Verify the acting user is an active Admin before provisioning a Tutor.
- Use `createAdminClient().auth.admin.createUser(...)` for Auth user creation.
- On success, insert:
  - `public.profiles`: `id`, `role = 'tutor'`, `full_name`, `active = true`
  - `public.tutors`: `profile_id`, optional operational profile fields, `active = true`
- If profile or tutor insert fails after Auth creation, delete the newly created Auth user to avoid orphaned identities.
- The generated password should be returned only in the immediate success state; do not persist or re-query it later.

### UI Guidance

- Implement the form on the existing Admin dashboard route: `app/dashboard/admin/page.tsx`.
- Keep the UX simple and internal-facing.
- Required fields: full name, email.
- Optional aligned fields from Tutor schema: phone, subjects, specialties, notes.
- Display duplicate email and provisioning failures as clear inline error states.
- Display the generated password once in a highly visible copyable success panel.

### Files Likely Involved

```txt
app/dashboard/admin/page.tsx                 UPDATE
app/dashboard/admin/actions.ts               NEW
app/dashboard/admin/create-tutor-form.tsx    NEW
lib/supabase/admin.ts                        REUSE
_bmad-output/implementation-artifacts/2-2-admin-creates-tutor-account-with-generated-password.md NEW
_bmad-output/implementation-artifacts/sprint-status.yaml UPDATE
```

### Testing Requirements

- Run `pnpm run build` to validate Next.js compile impact.
- Note any unrelated repository-wide TypeScript issues if they appear during deeper type checks.
- Manual verification path after deployment/local run:
  1. Sign in as Admin.
  2. Submit Tutor details with a fresh email.
  3. Confirm password appears once.
  4. Confirm duplicate email shows a friendly error.

### Risks / Guardrails

- Do not expose service-role operations to client code.
- Do not allow non-Admin users to create Tutor accounts.
- Do not leave orphaned Auth users if profile/tutor creation fails.
- Do not treat the one-time generated password as recoverable after the success response.

### References

- `_bmad-output/planning-artifacts/epics.md#story-22-admin-creates-tutor-account-with-generated-password`
- `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md`
- `app/(auth)/login/actions.ts`
- `app/dashboard/admin/page.tsx`
- `lib/supabase/admin.ts`
- `supabase/migrations/20260609000001_create_tutors.sql`
- `supabase/migrations/20260609000002_add_tutor_subjects.sql`

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- Read sprint status and selected Story 2.2 as the next backlog item in Epic 2.
- Reused existing SSR auth/session patterns from `app/(auth)/login/actions.ts` and service-role location in `lib/supabase/admin.ts`.
- Added Admin-only Tutor provisioning action with Auth user creation, `profiles` insert, `tutors` insert, duplicate-email handling, and rollback via `deleteUser` on downstream failure.
- Replaced Admin placeholder dashboard with a Tutor creation form and one-time generated-password success state.
- `pnpm run build` succeeded once when network access was available for Google Fonts; sandbox-only builds can fail on remote font fetch.
- `pnpm exec tsc --noEmit` reports pre-existing unrelated repo TypeScript errors in shared UI components (`components/learning-path-section.tsx`, `components/ui/badge-animation.tsx`, `components/ui/text-reveal.tsx`).

### Completion Notes List

- Implemented server-side Tutor account creation for active Admin users only.
- Added random generated initial password flow and returned it only in immediate success state.
- Added rollback to prevent orphaned Auth users if profile/tutor persistence fails.
- Added user-facing duplicate-email and generic provisioning error states.
- Replaced the Admin dashboard placeholder with an internal Tutor creation form using existing UI primitives.

### File List

- `app/dashboard/admin/actions.ts`
- `app/dashboard/admin/create-tutor-form.tsx`
- `app/dashboard/admin/page.tsx`
- `_bmad-output/implementation-artifacts/2-2-admin-creates-tutor-account-with-generated-password.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-08: Implemented Admin Tutor account creation flow with one-time generated password display.
