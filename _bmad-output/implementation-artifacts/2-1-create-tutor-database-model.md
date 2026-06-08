---
baseline_commit: 56dba50f3c1839ac41ac955b7fb325b3667cbe5d
---

# Story 2.1: Create Tutor Database Model

Status: done

## Story

As an Admin,
I want Tutor profile data stored separately from auth identity,
so that Tutor operational details can be managed safely.

## Acceptance Criteria

1. **Given** the profile schema exists, **when** Tutor migrations are applied, **then** a `tutors` table exists and links to `profiles`.
2. **Given** Tutor records are stored, **when** the schema is reviewed, **then** Tutor rows include profile id, contact fields, specialties/notes, active status, and timestamps.
3. **Given** Tutor data is operationally sensitive, **when** RLS is enabled, **then** Tutors cannot edit their own system-managed profile fields unless explicitly allowed.
4. **Given** future Admin Tutor-management stories depend on this table, **when** server code or forms use Tutor data, **then** the schema supports clean joins from `profiles` and downstream CRUD.

## Tasks / Subtasks

- [x] Create Tutor migration file under `supabase/migrations/` (AC: 1, 2, 3)
  - [x] Add a timestamped SQL migration after `20260608000001_create_profiles.sql`.
  - [x] Create `public.tutors` with `id uuid primary key default gen_random_uuid()`.
  - [x] Add `profile_id uuid not null unique references public.profiles(id) on delete cascade`.
  - [x] Add contact/operations fields needed for MVP Tutor management.
  - [x] Add `active boolean not null default true` only if it is intentionally distinct from `profiles.active`; otherwise document why profile-level active is source of truth.
  - [x] Add `created_at` and `updated_at` timestamps.
- [x] Add integrity helpers and indexes (AC: 1, 2, 4)
  - [x] Add useful indexes such as `profile_id` and optional search/contact indexes if justified.
  - [x] Reuse `public.set_updated_at()` trigger helper from Story 1.2 if appropriate.
  - [x] Avoid duplicating role data that already lives in `profiles.role`.
- [x] Add RLS policies for Tutor data (AC: 3)
  - [x] Enable RLS on `public.tutors`.
  - [x] Allow Admin to read/write all tutor rows.
  - [x] Allow Tutor to read their own row if needed for later dashboard/profile features.
  - [x] Do not allow Tutor to update Admin-controlled system fields by default.
- [x] Add TypeScript-side Tutor model support (AC: 4)
  - [x] Add shared Tutor types in `lib/db/types.ts` or nearest existing typed location if needed.
  - [x] Keep naming aligned: `snake_case` in SQL, `camelCase` in TypeScript.
  - [x] Document the expected join path: `auth.users -> profiles -> tutors`.
- [x] Validate migration/build impact (AC: all)
  - [x] Run `pnpm run build` after schema-related code changes.
  - [x] If Supabase CLI is available, validate/apply migration against the linked project.
  - [x] Document any blockers or schema decisions in Dev Agent Record.

## Dev Notes

### Story Scope

This story is schema/foundation only. Do **not** build Tutor list UI, create-Tutor form UI, generated-password flow, or editable Tutor detail pages here. Those belong to Stories 2.2 and 2.3.

### Epic Context

Epic 2 enables Admin to create and manage Tutor accounts. Story 2.1 is the schema prerequisite for:
- Story 2.2: Admin creates Tutor account with generated password.
- Story 2.3: Admin views and edits Tutor profiles.

### Previous Story Intelligence

From Epic 1:
- Supabase SSR auth/session flow is already in place.
- `public.profiles` exists as the role anchor table.
- `profiles.role` is constrained to `admin | tutor`.
- `public.is_active_admin()` already exists and can be reused in RLS policies.
- Service-role operations are expected to stay in `lib/supabase/admin.ts`.

### Existing Schema Context

Current base table from Story 1.2:
- `public.profiles`
  - `id uuid primary key references auth.users(id)`
  - `role text check (role in ('admin', 'tutor'))`
  - `full_name text not null`
  - `active boolean not null default true`
  - timestamps

Important existing DB helpers:
- `public.set_updated_at()` trigger function
- `public.is_active_admin()` security definer helper

### Architecture Compliance

Follow `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md`:
- Use Supabase Postgres with SQL migrations in `supabase/migrations/`.
- Use `snake_case` DB naming.
- Keep Admin as operational source of truth.
- Use RLS for Admin/Tutor row-level access.
- Put shared app/domain typing under `lib/db/` or another existing domain-safe typed location.
- Do not invent a separate auth model; Tutor identity flows through `profiles`.

### Suggested Tutor Fields

Minimum recommended fields for MVP Tutor operations:

```sql
create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  phone text,
  subjects text,
  specialties text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Implementation note:
- `subjects` / `specialties` may be `text`, `text[]`, or another simple MVP-safe representation. Prefer the simplest shape that does not fight future Stories 2.2/2.3.
- If `tutors.active` duplicates `profiles.active`, either remove it or clearly document why both are needed. Avoid confusing split-source account state.

### RLS Guidance

Expected baseline:
- Admin can select/insert/update/delete all tutor rows.
- Tutor may read only their own tutor row if later Tutor dashboard/profile views need it.
- Tutor should not directly mutate Admin-managed tutor/account fields by default.

Suggested pattern:
- Reuse `public.is_active_admin()` for Admin access.
- Own-row Tutor read can join through `profiles.id = auth.uid()` via `tutors.profile_id`.

### Files Likely Involved

```txt
supabase/migrations/<timestamp>_create_tutors.sql   NEW
lib/db/types.ts                                     NEW or UPDATE
_bmad-output/implementation-artifacts/2-1-create-tutor-database-model.md NEW
_bmad-output/implementation-artifacts/sprint-status.yaml UPDATE
```

### Testing Requirements

- Validate migration SQL shape and constraints.
- Prefer `npx supabase db push` or equivalent if CLI/link is ready.
- Run `pnpm run build` to ensure any TypeScript additions do not break app build.

### Risks / Guardrails

- Do not duplicate role semantics already owned by `profiles.role`.
- Do not let Tutor-written fields accidentally bypass Admin governance.
- Do not expose service-role logic to client code.
- Keep schema flexible enough for Story 2.2 account creation and Story 2.3 edit/list views.

### References

- `_bmad-output/planning-artifacts/epics.md#story-21-create-tutor-database-model`
- `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md`
- `supabase/migrations/20260608000001_create_profiles.sql`
- `lib/auth/role.ts`
- `lib/supabase/admin.ts`

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- `git rev-parse HEAD` captured baseline commit `56dba50f3c1839ac41ac955b7fb325b3667cbe5d`.
- Created `public.tutors` migration with profile foreign key, contact/operation fields, active flag, timestamps, indexes, updated-at trigger, and RLS policies.
- Added follow-up migration for `subjects` after base migration had already been applied remotely.
- `npx supabase db push` applied both Tutor migrations to linked Supabase project `zxvddwycpfudbauaxqit`.
- `pnpm run build` passed.
- Tutor schema/RLS verification passed with service-role insert, authenticated own-row read, and blocked Tutor update verification.
- `npm run lint` completed with 0 errors and 28 pre-existing warnings.

### Completion Notes List

- Implemented Tutor schema foundation for Epic 2.
- Added `public.tutors` table linked one-to-one to `public.profiles` through `profile_id`.
- Added Tutor fields: `phone`, `subjects`, `specialties`, `notes`, `active`, `created_at`, `updated_at`.
- Added `tutors_set_updated_at` trigger using existing `public.set_updated_at()` helper.
- Enabled RLS and added Admin all-access plus Tutor own-row read policy.
- Tutor self-update remains intentionally blocked; Admin remains source of truth.
- Added TypeScript Tutor row/insert/update/join types and SQL-to-TS mapper in `lib/db/types.ts`.

### File List

- `supabase/migrations/20260609000001_create_tutors.sql`
- `supabase/migrations/20260609000002_add_tutor_subjects.sql`
- `lib/db/types.ts`
- `_bmad-output/implementation-artifacts/2-1-create-tutor-database-model.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-09: Implemented Tutor database model, RLS policies, TypeScript types, and Supabase migration validation.
## Senior Developer Review (AI)

### Review Outcome

Approve - no blocking findings.

### Review Notes

- `public.tutors` correctly links to `public.profiles` through a unique `profile_id` foreign key.
- Tutor contact/operations fields are present: `phone`, `subjects`, `specialties`, `notes`, `active`, timestamps.
- RLS is enabled with Admin all-access and Tutor own-row read only.
- Tutor self-update remains blocked, matching Admin-as-source-of-truth guardrail.
- `lib/db/types.ts` maps SQL `snake_case` to TypeScript `camelCase`.
- Remote Supabase migration applied and schema/RLS smoke test passed.

### Residual Risks

- No automated persistent test file was added; validation used one-off smoke test against Supabase.
- `tutors.active` duplicates `profiles.active`; current decision is acceptable for operational Tutor profile status, but Story 2.3 should keep login/account active state aligned.
