# Story 1.1: Configure Supabase Clients and Environment

Status: done

## Story

As a developer,
I want Supabase environment variables and client helpers configured,
so that future auth and data stories can use one consistent integration pattern.

## Acceptance Criteria

1. **Given** the existing Next.js app, **when** Supabase setup is added, **then** `lib/supabase/client.ts`, `lib/supabase/server.ts`, and `lib/supabase/admin.ts` exist.
2. **Given** the Supabase admin client exists, **when** code is reviewed, **then** `lib/supabase/admin.ts` is server-only and must never be imported by Client Components.
3. **Given** environment variables are required, **when** a developer opens `.env.example`, **then** all required Supabase/Admin bootstrap variables are documented.
4. **Given** required env vars are missing, **when** server or client Supabase helpers initialize, **then** they fail with clear developer-facing errors.
5. **Given** the existing app uses App Router, **when** client/server helpers are implemented, **then** they follow the documented `@supabase/ssr` browser/server split.

## Tasks / Subtasks

- [x] Add Supabase dependencies to `package.json` (AC: 1, 5)
  - [x] Add `@supabase/supabase-js`.
  - [x] Add `@supabase/ssr`.
  - [x] Keep existing Next.js/React/Tailwind/shadcn setup intact.
- [x] Create environment validation helpers (AC: 3, 4)
  - [x] Add `lib/env.ts` or equivalent small helper for required env access.
  - [x] Validate `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for browser/server public clients.
  - [x] Validate `SUPABASE_SERVICE_ROLE_KEY` only in server-only code paths.
  - [x] Validate `BOOTSTRAP_ADMIN_EMAIL` for later Admin bootstrap stories.
- [x] Create Supabase browser client (AC: 1, 5)
  - [x] Add `lib/supabase/client.ts`.
  - [x] Use `createBrowserClient` from `@supabase/ssr`.
  - [x] Use only `NEXT_PUBLIC_` variables in this file.
- [x] Create Supabase server client (AC: 1, 5)
  - [x] Add `lib/supabase/server.ts`.
  - [x] Use `createServerClient` from `@supabase/ssr`.
  - [x] Wire cookies using the current Next.js App Router cookies API.
- [x] Create Supabase admin client (AC: 1, 2, 4)
  - [x] Add `lib/supabase/admin.ts`.
  - [x] Mark with `import 'server-only'`.
  - [x] Use service-role key only here or in server-only modules.
  - [x] Ensure no `NEXT_PUBLIC_` service-role exposure.
- [x] Document environment variables (AC: 3)
  - [x] Create/update `.env.example` without real secrets.
  - [x] Include descriptions for public anon key vs server-only service role key.
- [x] Validate build/type safety (AC: all)
  - [x] Run `npm run build` or `pnpm run build` after dependencies are installed.
  - [x] Fix import/type errors without changing unrelated app behavior.

## Dev Notes

### Story Scope

This story is infrastructure only. Do not build login UI, middleware, database schema, RLS policies, Tutor/Admin dashboards, or CRUD flows here. Those belong to later stories.

### Current Repo State

- Existing app is a Next.js App Router project with `app/layout.tsx`, `app/page.tsx`, `components/`, `components/ui/`, `lib/`, and Tailwind/shadcn patterns.
- `package.json` currently does **not** list Supabase packages.
- Existing scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- `next.config.mjs` currently has `typescript.ignoreBuildErrors: true`; do not change it in this story unless explicitly required by build breakage.
- `.env` and `.env.local` contain real local secrets. Do not copy values into docs or committed files.

### Architecture Compliance

Follow architecture decisions from `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md`:

- Extend the existing Next.js app; do not create a new app.
- Use Supabase Auth with `@supabase/ssr`.
- Use Supabase clients in these exact locations:
  - `lib/supabase/client.ts` ? browser client only.
  - `lib/supabase/server.ts` ? SSR server client.
  - `lib/supabase/admin.ts` ? service-role server-only client.
- Keep service-role usage server-only.
- Use `camelCase` TypeScript names.
- Future Server Actions will use `ActionResult<T>`, but no actions are required in this story.

### Required Environment Variables

Document these in `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BOOTSTRAP_ADMIN_EMAIL=
```

Rules:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` may be used by browser code.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to the browser.
- `BOOTSTRAP_ADMIN_EMAIL` is for later Admin bootstrap stories; no bootstrap logic in this story.

### Suggested File Contents / Patterns

`lib/env.ts` should centralize clear missing-env errors. Keep it small and dependency-free unless using an existing validation dependency already in the app (`zod` is installed).

`lib/supabase/client.ts` should be safe for Client Components:

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    requiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )
}
```

`lib/supabase/admin.ts` must start with:

```ts
import 'server-only'
```

### Latest Technical Context

- Supabase docs for Next.js show `createBrowserClient` from `@supabase/ssr` for browser clients and server-side SSR helpers for server clients. Source: https://supabase.com/nextjs and https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&package-manager=npm&queryGroups=framework&queryGroups=package-manager
- Supabase Auth Helpers are replaced by the newer SSR package; Supabase migration docs say `@supabase/ssr` exports `createBrowserClient` and `createServerClient`. Source: https://supabase.com/docs/guides/auth/auth-helpers
- Supabase JS v2 install guidance uses `@supabase/supabase-js`. Source: https://supabase.com/docs/reference/javascript/installing
- Next.js env docs state non-`NEXT_PUBLIC_` env vars are server-only, while `NEXT_PUBLIC_` vars are bundled for browser use. Source: https://nextjs.org/docs/pages/guides/environment-variables

### Security Guardrails

- Never import `lib/supabase/admin.ts` into files with `'use client'`.
- Never read `SUPABASE_SERVICE_ROLE_KEY` in `client.ts` or any Client Component.
- Never commit real `.env` or `.env.local` values.
- `.env.example` must use empty placeholders only.

### Project Structure Notes

Expected new/update paths:

```txt
lib/env.ts                    NEW
lib/supabase/client.ts         NEW
lib/supabase/server.ts         NEW
lib/supabase/admin.ts          NEW
.env.example                   NEW or UPDATE
package.json                   UPDATE
package-lock.json              UPDATE if npm install is used
pnpm-lock.yaml                 UPDATE if pnpm install is used
```

Prefer the package manager already used by the active workflow. The repo contains both `package-lock.json` and `pnpm-lock.yaml`; choose one consistently for install/build commands and do not delete either lockfile unless explicitly instructed.

### Testing Requirements

- Verify TypeScript compiles after adding helpers.
- Run the project build if dependencies are installed.
- If build cannot run because dependencies are not installed or network is unavailable, document the exact blocker in Dev Agent Record.

### References

- PRD: `_bmad-output/planning-artifacts/prds/prd-TPA-Education-2026-06-08/prd.md#4.1-authentication-and-access-control`
- Architecture: `_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md#core-architectural-decisions`
- Epics: `_bmad-output/planning-artifacts/epics.md#story-11-configure-supabase-clients-and-environment`
- Supabase Next.js docs: https://supabase.com/nextjs
- Supabase SSR client docs: https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&package-manager=npm&queryGroups=framework&queryGroups=package-manager
- Next.js env docs: https://nextjs.org/docs/pages/guides/environment-variables

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- `npm install @supabase/ssr @supabase/supabase-js` completed.
- `npm install framer-motion` completed to restore pre-existing UI dependency required by build.
- `pnpm run build` passed after dependencies were installed; sandboxed run previously failed due Google Fonts network fetch.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added Supabase browser, server, and server-only admin client helpers.
- Added centralized env validation helpers and `.env.example` placeholders.
- Installed Supabase dependencies and restored missing `framer-motion` dependency used by existing UI components.
- Verified production build passes with network-enabled build execution.

### File List

- `.env.example`
- `lib/env.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `package.json`
- `package-lock.json`
- `next-env.d.ts`

### Change Log

- 2026-06-08: Implemented Supabase client/environment foundation for Story 1.1.


