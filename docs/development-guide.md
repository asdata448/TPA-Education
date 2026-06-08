# Development Guide

## Prerequisites

- Node.js 20+ recommended
- `pnpm` available
- Access to Vercel project if deploying previews/production
- Access to the linked Supabase project if managing auth users or schema

## Install

```bash
pnpm install
```

## Local Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Build

```bash
pnpm run build
pnpm run start
```

## Lint

```bash
npm run lint
```

Current lint status:
- no errors
- warnings still exist in older UI files outside Epic 1 auth scope

## Important Source Files

- `app/page.tsx` - landing page assembly
- `app/layout.tsx` - metadata and shell
- `app/globals.css` - theme tokens and utilities
- `app/(auth)/login/page.tsx` - login form UI
- `app/(auth)/login/actions.ts` - login server action
- `app/dashboard/admin/page.tsx` - admin dashboard placeholder
- `app/dashboard/tutor/page.tsx` - tutor dashboard placeholder
- `proxy.ts` - session refresh + route protection
- `lib/supabase/*` - Supabase client helpers
- `lib/auth/role.ts` - role helpers

## Active Environment Variables

Required Supabase variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOTSTRAP_ADMIN_EMAIL`

Legacy Auth0 variables may still exist in env files, but the current Epic 1 auth flow uses Supabase.

## Current Production-Linked Supabase Project

- project ref: `zxvddwycpfudbauaxqit`
- URL: `https://zxvddwycpfudbauaxqit.supabase.co`

## Test Accounts

Use these for manual login validation:

- Admin: `admin.test@tpa-education.com` / `Test@Admin123`
- Tutor: `tutor.test@tpa-education.com` / `Test@Tutor123`

## Content Editing Workflow

- Tutor/FAQ/process/commitment text lives in `lib/data.ts`
- Hero/header/contact/footer sections also embed local content directly
- Brand styling is centralized in `app/globals.css`
- Remote images are embedded in component props rather than a media registry

## Auth Development Notes

- keep `SUPABASE_SERVICE_ROLE_KEY` server-only
- never import `lib/supabase/admin.ts` from client code
- route authorization should stay centralized in `proxy.ts`
- role values must remain aligned with the database check constraint: `admin`, `tutor`

## Recommended Developer Tasks

- add automated auth E2E coverage
- remove stale Auth0 references if they are no longer required
- implement real contact submission endpoint/server action
- re-enable strict TypeScript build failure when the codebase is clean enough
