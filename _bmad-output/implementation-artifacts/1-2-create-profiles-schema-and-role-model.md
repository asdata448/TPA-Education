---
baseline_commit: 424c4fbf5735dd8c3fbf2ef3bab25e96e593e238
---

# Story 1.2: Create Profiles Schema and Role Model

Status: done

## Story

As an Admin/Tutor system,
I want a profile and role data model,
so that the app can distinguish Admin and Tutor permissions.

## Acceptance Criteria

1. **Given** Supabase migrations are used, **when** the profiles migration is applied, **then** `profiles` table exists with auth user id, role, full name, active status, and timestamps.
2. **Given** roles are stored in `profiles`, **when** records are inserted or updated, **then** role values are constrained to `admin` or `tutor`.
3. **Given** profile data is protected, **when** the migration is applied, **then** RLS is enabled on `profiles`.
4. **Given** users read profile data, **when** Admin/Tutor profile reads occur, **then** they follow documented authorization rules.
5. **Given** future auth stories depend on role lookup, **when** server code needs a user's role, **then** a reusable helper exists or the schema supports that lookup cleanly.

## Tasks / Subtasks

- [x] Create Supabase migration folder and profiles migration (AC: 1, 2, 3)
  - [x] Add `supabase/config.toml` if missing.
  - [x] Add a timestamped SQL migration under `supabase/migrations/`.
  - [x] Create `profiles` table with `id uuid primary key references auth.users(id) on delete cascade`.
  - [x] Add role constraint for `admin` and `tutor`.
  - [x] Add `full_name`, `active`, `created_at`, and `updated_at` fields.
- [x] Add RLS policies for profiles (AC: 3, 4)
  - [x] Enable RLS on `profiles`.
  - [x] Allow authenticated users to read their own profile.
  - [x] Allow Admin users to read all profiles.
  - [x] Avoid broad unauthenticated profile reads.
- [x] Add role/profile helper placeholders for future auth stories (AC: 5)
  - [x] Add `lib/auth/role.ts` or equivalent helper module if not present.
  - [x] Include `UserRole` type and role constants.
  - [x] Keep helpers server-safe and compatible with future Supabase server client.
- [x] Document bootstrap Admin expectation (AC: 2, 4)
  - [x] Add comments in migration or docs explaining `BOOTSTRAP_ADMIN_EMAIL` will be used by later story.
  - [x] Do not implement bootstrap script in this story.
- [x] Validate SQL and build impact (AC: all)
  - [x] Run a local syntax sanity check where possible.
  - [x] Run `pnpm run build` or `npm run build`.

## Dev Notes

### Story Scope

This story creates the base role/profile data model only. Do not build login UI, middleware, dashboard pages, Tutor model, or Admin bootstrap automation here.

### Previous Story Intelligence

Story 1.1 created:
- `lib/env.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `.env.example`

Reuse these helpers. Do not duplicate Supabase clients. Keep `lib/supabase/admin.ts` server-only.

### Architecture Compliance

Follow `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md`:

- DB names use `snake_case`.
- SQL migrations live in `supabase/migrations/`.
- RLS policies are versioned with schema migrations.
- Role model: `profiles.role = 'admin' | 'tutor'`.
- Admin can access all MVP data; Tutor access is limited.
- Do not model 5% monthly fee tracking.
- Do not implement chatbot/AI assistant.

### Suggested Schema

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'tutor')),
  full_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
```

Policy guidance:
- Authenticated users may select their own profile: `auth.uid() = id`.
- Admin read-all policy may use an `exists` check against `profiles` where `id = auth.uid()` and `role = 'admin'` and `active = true`.
- Be careful with recursive RLS checks; if policy recursion becomes an issue, use a `security definer` helper function in SQL.

### Required / Expected Paths

```txt
supabase/config.toml                    NEW if missing
supabase/migrations/*_create_profiles.sql NEW
lib/auth/role.ts                         NEW
_bmad-output/implementation-artifacts/1-2-create-profiles-schema-and-role-model.md UPDATE
_bmad-output/implementation-artifacts/sprint-status.yaml UPDATE
```

### Testing Requirements

- At minimum, run production build to ensure TypeScript imports compile.
- If Supabase CLI is available, validate migration syntax with local Supabase tooling.
- If Supabase CLI is not available, document blocker in Dev Agent Record.

### References

- Epics: `_bmad-output/planning-artifacts/epics.md#story-12-create-profiles-schema-and-role-model`
- Architecture: `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md#data-architecture`
- Architecture RLS rules: `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md#authentication--security`
- Supabase RLS docs: https://supabase.com/docs/guides/database/postgres/row-level-security

## Dev Agent Record

### Agent Model Used

Codex GPT-5

### Debug Log References

- `git rev-parse HEAD` captured baseline commit `424c4fbf5735dd8c3fbf2ef3bab25e96e593e238`.
- Created Supabase config and profiles migration.
- Created `lib/auth/role.ts` role helpers.
- Ran `pnpm run build` with approved elevated network access for next/font.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added `profiles` schema with `admin`/`tutor` role constraint and active/timestamps fields.
- Enabled RLS with own-profile and Admin read-all policies.
- Added `public.is_active_admin()` security definer helper to avoid recursive RLS policy checks.
- Added shared TypeScript role helpers for future auth stories.
- Documented bootstrap Admin expectation in migration comments; no bootstrap logic implemented.

### File List

- `supabase/config.toml`
- `supabase/migrations/20260608000001_create_profiles.sql`
- `lib/auth/role.ts`
- `_bmad-output/implementation-artifacts/1-2-create-profiles-schema-and-role-model.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-06-08: Implemented profiles schema, RLS policies, and role helper for Story 1.2.


