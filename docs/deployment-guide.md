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
20260609000003_create_students.sql
20260609000004_create_parents.sql
20260609000005_link_students_parents.sql
20260609000006_remove_students_parents.sql
20260609000007_create_classes_schedules_requests.sql
20260609000008_create_r2_material_library.sql
20260610000001_create_document_feedback_notifications.sql
20260610000002_simplify_document_feedback.sql
20260610000003_add_payment_system.sql
20260610000004_create_progress_reports.sql
20260610000006_create_class_sessions.sql
20260612000001_create_email_settings.sql
```

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zxvddwycpfudbauaxqit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
BOOTSTRAP_ADMIN_EMAIL=<admin-email>
BREVO_API_KEY=<brevo-transactional-api-key>
NEXT_PUBLIC_APP_URL=https://tpaeducation.io.vn
```

## Variable Usage

- `NEXT_PUBLIC_SUPABASE_URL` -> browser + server Supabase clients
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> browser + SSR auth session handling
- `SUPABASE_SERVICE_ROLE_KEY` -> server-only Admin operations like Tutor provisioning
- `BOOTSTRAP_ADMIN_EMAIL` -> reserved bootstrap helper variable
- `BREVO_API_KEY` -> server-only Brevo Transactional Email API key
- `NEXT_PUBLIC_APP_URL` -> base URL used in email CTA links and logo URL

## Manual Deployment

```bash
pnpm exec tsc --noEmit
pnpm run build
npx supabase db push
vercel deploy --prod
```

## Email Notification Deployment

1. Confirm domain authentication in Brevo for `tpaeducation.io.vn`.
2. Set Vercel Production env `BREVO_API_KEY`.
3. Set `NEXT_PUBLIC_APP_URL=https://tpaeducation.io.vn`.
4. Apply `20260612000001_create_email_settings.sql` with `npx supabase db push`.
5. After deploy, open `/dashboard/admin/settings` and confirm Admin recipient emails.
6. Trigger a Tutor password reset and verify delivery in Brevo Transactional logs.

The canonical package manager for deployment is pnpm. Keep `pnpm-lock.yaml` committed and do not commit `package-lock.json`.

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
10. Open `/dashboard/admin/settings` and confirm Admin email recipients
11. Reset a Tutor password and verify Brevo email delivery

## Known Non-Issues During Browser Testing

These browser console messages are not the Tutor-create bug:
- `ERR_BLOCKED_BY_CLIENT` -> usually ad blocker
- `Vercel Web Analytics failed to load` -> analytics config issue only

The real production Tutor-create bug was previously caused by invalid `'use server'` exports and has been fixed.


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.


## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
