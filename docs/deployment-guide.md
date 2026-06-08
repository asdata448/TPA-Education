# Deployment Guide

## Current Deployment Shape

- Platform: Vercel
- Vercel project metadata source: `.vercel/project.json`
- Vercel project name: `tpa-education`
- App runtime: Next.js 16 App Router
- Auth/data backend: Supabase

## Active Supabase Environment

Current production project:

- Project name: `TPA Education Clean`
- Project ref: `zxvddwycpfudbauaxqit`
- Project URL: `https://zxvddwycpfudbauaxqit.supabase.co`
- Region: `ap-southeast-1` (Singapore)
- Migration state: `20260608000001_create_profiles.sql` applied
- Production test accounts created and verified

## Linked Services

### Vercel

From `.vercel/project.json`:

- `projectId`: `prj_U7QjGt8QaILZlia6jnteNfMcFIrW`
- `orgId`: `team_EJHFWB5auJE268WwnHniRdBW`
- `projectName`: `tpa-education`
- Production URL: https://tpa-education-mauve.vercel.app

### Supabase

Repo linked via Supabase CLI to:

- `zxvddwycpfudbauaxqit`

## Required Environment Variables

Set these in both local `.env.local` and Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zxvddwycpfudbauaxqit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
BOOTSTRAP_ADMIN_EMAIL=<admin-email>
```

### Variable Usage

- `NEXT_PUBLIC_SUPABASE_URL`
  - used by browser + server Supabase clients
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - used by browser + SSR auth session handling
- `SUPABASE_SERVICE_ROLE_KEY`
  - used only by server-side admin operations
- `BOOTSTRAP_ADMIN_EMAIL`
  - reserved for later bootstrap/admin stories

## Database State

### Applied Local Migration

```text
supabase/migrations/20260608000001_create_profiles.sql
```

### Migration Result

Applied successfully to production Supabase project via:

```bash
npx supabase db push
```

### Expected Schema

`public.profiles` includes:

- `id uuid primary key references auth.users(id) on delete cascade`
- `role text not null` with allowed values `admin`, `tutor`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- unique index on `id`
- index on `role` for fast filtering

## Deployment Workflow

### Manual Deployment

```bash
pnpm run build
vercel --prod
```

### Auto-Deploy

Vercel automatically deploys commits pushed to `main` branch.

## Test Accounts

Production Supabase includes test accounts for each role:

**Admin**
- email: `admin.test@tpa-education.com`
- password: `Test@Admin123`
- default landing: `/dashboard/admin`

**Tutor**
- email: `tutor.test@tpa-education.com`
- password: `Test@Tutor123`
- default landing: `/dashboard/tutor`

## Verification Checklist

After deployment:

1. Navigate to `/login`
2. Login as admin -> should land on `/dashboard/admin`
3. Logout, login as tutor -> should land on `/dashboard/tutor`
4. While logged out, visit `/dashboard/admin` -> should redirect to `/login`
5. Login as tutor, visit `/dashboard/admin` -> should redirect to `/dashboard/tutor`

## Known Deployment Constraints

- Next.js build step ignores TypeScript errors (`next.config.mjs` sets `ignoreBuildErrors: true`)
- No ESLint errors block deployment
- Vercel Analytics enabled only in production environment

## Local Supabase Development

If running local Supabase via CLI:

```bash
npx supabase start
npx supabase db reset
```

Local Supabase will serve at `http://127.0.0.1:54321`.

Update `.env.local` to point to local instance:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
```

## Rollback

If a deployment breaks production:

1. Revert commit on `main`
2. Vercel auto-deploys the revert
3. If database migration caused the issue, manually rollback schema in Supabase dashboard

## Support

- Vercel dashboard: https://vercel.com/team_EJHFWB5auJE268WwnHniRdBW/tpa-education
- Supabase dashboard: https://supabase.com/dashboard/project/zxvddwycpfudbauaxqit
