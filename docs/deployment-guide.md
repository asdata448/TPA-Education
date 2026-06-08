# Deployment Guide

## Current Deployment Shape

- Platform: Vercel
- App runtime: Next.js 16 App Router
- Auth/data backend: Supabase
- Production URL: `https://tpa-education-mauve.vercel.app`

## Active Supabase Environment

- Project name: `TPA Education Clean`
- Project ref: `zxvddwycpfudbauaxqit`
- Project URL: `https://zxvddwycpfudbauaxqit.supabase.co`
- Region: `ap-southeast-1`

## Applied Migrations

```text
20260608000001_create_profiles.sql
20260609000001_create_tutors.sql
20260609000002_add_tutor_subjects.sql
20260609000006_remove_students_parents.sql
```

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zxvddwycpfudbauaxqit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
BOOTSTRAP_ADMIN_EMAIL=<admin-email>
```

## Variable Usage

- `NEXT_PUBLIC_SUPABASE_URL` -> browser + server Supabase clients
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> browser + SSR auth session handling
- `SUPABASE_SERVICE_ROLE_KEY` -> server-only Admin operations like Tutor provisioning
- `BOOTSTRAP_ADMIN_EMAIL` -> reserved bootstrap helper variable

## Manual Deployment

```bash
pnpm exec tsc --noEmit
pnpm run build
npx supabase db push
vercel --prod
```

## Production Verification Checklist

1. Open `/login`
2. Login as Admin
3. Open `/dashboard/admin`
4. Create Tutor with a fresh email
5. Confirm generated password appears once
6. Confirm Tutor appears in Tutor list
7. Open Tutor detail page
8. Edit Tutor fields
9. Toggle inactive and verify Tutor access block

## Known Non-Issues During Browser Testing

These browser console messages are not the Tutor-create bug:
- `ERR_BLOCKED_BY_CLIENT` -> usually ad blocker
- `Vercel Web Analytics failed to load` -> analytics config issue only

The real production Tutor-create bug was previously caused by invalid `'use server'` exports and has been fixed.


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.
