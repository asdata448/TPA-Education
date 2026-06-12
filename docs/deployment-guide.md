# Deployment Guide

## Current Deployment Shape

| Property | Value |
| --- | --- |
| Platform | Vercel |
| App runtime | Next.js 16 App Router (Turbopack) |
| Auth/data backend | Supabase (Postgres + Auth) |
| Email provider | Brevo Transactional Email |
| Package manager | pnpm (canonical) |
| Production URL | `https://tpaeducation.io.vn` |
| Vercel project URL | `https://tpa-education-mauve.vercel.app` |
| Custom domain | `tpaeducation.io.vn` |

## Active Supabase Environment

| Property | Value |
| --- | --- |
| Project name | `TPA Education Clean` |
| Project ref | `zxvddwycpfudbauaxqit` |
| Project URL | `https://zxvddwycpfudbauaxqit.supabase.co` |
| Region | `ap-southeast-1` (Singapore) |

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

### Vercel Production

| Variable | Purpose | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server Supabase clients | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + SSR auth session handling | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Admin operations (Tutor provisioning, email settings) | Yes |
| `BOOTSTRAP_ADMIN_EMAIL` | Reserved bootstrap helper variable | Yes |
| `BREVO_API_KEY` | Server-only Brevo Transactional Email API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Base URL for email CTA links and logo (`https://tpaeducation.io.vn`) | Yes |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare R2 storage | Yes |
| `CLOUDFLARE_R2_BUCKET` | R2 bucket name for material library files | Yes |
| `R2_ACCESS_KEY_ID` | R2 API access key | Yes |
| `R2_SECRET_ACCESS_KEY` | R2 API secret key | Yes |
| `R2_ENDPOINT` | R2 S3-compatible endpoint URL | Yes |

### Variable Usage Details

- `NEXT_PUBLIC_*` → available in both browser and server; inlined at build time
- `SUPABASE_SERVICE_ROLE_KEY` → server-only; used in `lib/supabase/admin.ts` for admin operations that bypass RLS
- `BREVO_API_KEY` → server-only; used in `lib/email.tsx` to send transactional emails via Brevo REST API
- `BOOTSTRAP_ADMIN_EMAIL` → used to auto-assign the `admin` role when the first user with this email signs up

## Manual Deployment

```bash
# 1. Type check (optional, skipBuildErrors is enabled)
pnpm exec tsc --noEmit

# 2. Build locally to verify
pnpm run build

# 3. Push any new migrations to Supabase
npx supabase db push

# 4. Deploy to Vercel production
vercel --prod
```

### Quick Deploy

```bash
pnpm run build && vercel --prod
```

## Email Notification Deployment

1. Confirm domain authentication in Brevo for `tpaeducation.io.vn`.
2. Set Vercel Production env `BREVO_API_KEY`.
3. Set `NEXT_PUBLIC_APP_URL=https://tpaeducation.io.vn`.
4. Apply `20260612000001_create_email_settings.sql` with `npx supabase db push`.
5. After deploy, open `/dashboard/admin/settings` and confirm Admin recipient emails.
6. Trigger a Tutor password reset and verify delivery in Brevo Transactional logs.

See [Email Notifications](./email-notifications.md) for full testing guide.

## pnpm Strict Mode Notes

pnpm uses strict dependency isolation — packages can only import their direct dependencies. This means:

1. **Every imported package must be in `package.json`** as a direct dependency, even if it's already a transitive dependency of another package.
2. **Do not commit `package-lock.json`** — the canonical lockfile is `pnpm-lock.yaml`.
3. **Build failures on Vercel but not local** are often caused by missing direct dependencies that happen to work locally due to different hoisting behavior.

Known direct-dependency requirement:
- `@react-email/render` must be a direct dependency (used by `lib/email.tsx`) even though it's a sub-dependency of `react-email`.

## Production Verification Checklist

### Core Flows

1. Open `https://tpaeducation.io.vn/login`
2. Login as Admin
3. Open `/dashboard/admin` — verify Tutor list loads
4. Create Tutor with a fresh email → confirm generated password appears once
5. Confirm Tutor appears in Tutor list
6. Open Tutor detail page → edit Tutor fields → save
7. Toggle Tutor inactive → verify Tutor login is blocked
8. Toggle active back → verify Tutor can login again

### Email Notifications

9. Open `/dashboard/admin/settings` → confirm Admin email recipients are set
10. Reset a Tutor password → verify email in Brevo logs
11. Login as Tutor → submit document feedback → check Admin inbox
12. Login as Tutor → request an open class → check Admin inbox
13. Login as Tutor → save a progress report → check Admin inbox

### Finance & Reports

14. Open `/dashboard/admin/finance` → verify payment dashboard loads
15. Mark a Tutor payment as paid → verify Tutor receives email
16. Login as Tutor → create/edit a progress report → verify admin notification

### Material Library

17. Open `/dashboard/tutor/library` → verify materials load
18. Admin uploads a new material → verify Tutor can see and download it

## Known Non-Issues During Browser Testing

These browser console messages are not bugs:
- `ERR_BLOCKED_BY_CLIENT` → usually ad blocker
- `Vercel Web Analytics failed to load` → analytics config issue only

The real production Tutor-create bug was previously caused by invalid `'use server'` exports and has been fixed.

## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.

## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
