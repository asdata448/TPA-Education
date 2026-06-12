# TPA-Education Architecture

## Executive Summary

The application is a monolithic Next.js 16 App Router app deployed on Vercel. The active internal workflow is Admin/Tutor authentication plus Admin-managed Tutor provisioning, class management, progress reporting, payment processing, material library, and transactional email notifications — all backed by Supabase Auth and Postgres.

## Architecture Pattern

| Property | Value |
| --- | --- |
| Pattern | Frontend-first Next.js monolith with server-side auth boundary |
| Composition | App Router pages + server actions + SSR middleware + local UI kit |
| Auth/data backend | Supabase Auth + Postgres |
| Authorization model | Profile role lookup from `public.profiles` |
| Hosting | Vercel |
| Transactional email | Brevo REST API rendered through React Email templates |
| File storage | Cloudflare R2 |
| Package manager | pnpm |

## Runtime Flow

```
┌──────────────────────────────────────────────────────┐
│                    Browser                            │
│  Landing (/) → Login (/login) → Dashboard            │
└──────────────┬──────────────────────────┬────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐   ┌──────────────────────────┐
│   Next.js App Router │   │   Middleware (proxy.ts)   │
│   SSR + Server       │   │   - Session refresh       │
│   Actions            │   │   - Route protection      │
│                      │   │   - Role-based redirect    │
└──────────┬───────────┘   └──────────────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐ ┌──────────────┐
│ Supabase │ │ Brevo REST   │
│ Auth +   │ │ API          │
│ Postgres │ │ (email)      │
└──────────┘ └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │ Cloudflare   │
             │ R2 (files)   │
             └──────────────┘
```

1. `app/layout.tsx` sets global shell, metadata, analytics gate, and styles
2. Marketing page renders from `app/page.tsx`
3. Login page at `app/(auth)/login/page.tsx` submits credentials
4. `app/(auth)/login/actions.ts` authenticates with Supabase and resolves role from `profiles`
5. `proxy.ts` middleware refreshes session and enforces route protection
6. Admin dashboard renders Tutor management, class management, finance, reports, feedback, settings
7. Tutor dashboard renders classes, reports, feedback, materials, bank settings, password change

## Source-Level Layers

### App Layer — Auth
- `app/(auth)/login/*`
- `proxy.ts` (middleware)

### App Layer — Admin Dashboard
- `app/dashboard/admin/page.tsx` — main dashboard
- `app/dashboard/admin/actions.ts` — Tutor create/update
- `app/dashboard/admin/data.ts` — data loaders
- `app/dashboard/admin/tutors/page.tsx` — Tutor list
- `app/dashboard/admin/tutors/[tutorId]/*` — Tutor detail/edit
- `app/dashboard/admin/class-actions.ts` — class management
- `app/dashboard/admin/finance/finance-actions.ts` — payment processing
- `app/dashboard/admin/document-feedback-actions.ts` — feedback resolution
- `app/dashboard/admin/settings/*` — email recipient settings

### App Layer — Tutor Dashboard
- `app/dashboard/tutor/page.tsx` — main dashboard
- `app/dashboard/tutor/class-actions.ts` — open class requests
- `app/dashboard/tutor/classes/[classId]/report-actions.ts` — per-class reports
- `app/dashboard/tutor/document-feedback-actions.ts` — feedback submission
- `app/dashboard/tutor/reports/report-actions.ts` — report management
- `app/dashboard/tutor/change-password/*` — self-service password change

### Auth / Supabase Layer
- `lib/env.ts` — environment variable validation
- `lib/auth/role.ts` — role helpers
- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — cookie-based server client
- `lib/supabase/admin.ts` — service-role client (bypasses RLS)

### Email Layer
- `lib/email.tsx` — all email templates + Brevo API send function

## Tutor Provisioning Flow

1. Admin submits Tutor form on `/dashboard/admin`
2. Server action verifies active Admin session
3. Server action uses service-role Supabase client
4. Create auth user via `auth.admin.createUser`
5. Insert `profiles` row with role `tutor`
6. Insert `tutors` row with operational fields
7. Return one-time generated password to Admin
8. Send `sendTutorWelcomeEmail` to Tutor with temporary password
9. Admin can later edit Tutor detail page

## Email Notification Architecture

The app sends operational email through `lib/email.tsx`. Templates are React Email components rendered server-side to HTML and submitted to Brevo Transactional Email through the REST API. The sender is fixed as `TPA+ <no-reply@tpaeducation.io.vn>`.

```
┌─────────────────┐    ┌────────────────┐    ┌───────────────┐    ┌──────────┐
│  Tutor Action   │───▶│ Server Action  │───▶│ lib/email.tsx │───▶│  Brevo   │
│  (e.g. submit   │    │ (try/catch)    │    │ render() +    │    │ REST API │
│   feedback)     │    │                │    │ sendEmail()   │    │          │
└─────────────────┘    └────────────────┘    └───────────────┘    └──────────┘
                              │                                       │
                              ▼                                       ▼
                       Business action                          ┌──────────┐
                       succeeds regardless                      │ Recipient │
                       of email result                          │  inbox   │
                                                               └──────────┘
```

### Admin Recipient Resolution

1. `sendAdminNotificationEmail()` calls `getAdminNotificationEmails()`
2. `getAdminNotificationEmails()` reads `public.email_settings` using service-role client
3. Returns `admin_notification_emails text[]` array
4. If array is empty, logs warning and skips sending
5. Admin configures recipients at `/dashboard/admin/settings`

### Email Types

**Tutor-facing** (6 types):
- Welcome email (new account + temporary password)
- Password reset email (new temporary password)
- Password changed alert (security notification)
- Class request approved/rejected
- Class assigned notification
- Feedback resolved notification
- Payment confirmation notification

**Admin-facing** (3 types):
- Class request from Tutor
- Document feedback from Tutor
- Progress report submitted by Tutor

Notification triggers catch and log email errors without failing the primary business action.

See [Email Notifications](./email-notifications.md) for full details.

## Important Constraint

`'use server'` modules must export only async functions.

This is now a documented architectural rule for this repo because it directly caused a production Tutor-create failure.

## pnpm Strict Mode

All directly imported packages must be listed as direct dependencies in `package.json`. pnpm does not hoist transitive dependencies, so importing a sub-dependency directly will fail on Vercel even if it works locally.

## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.

## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
