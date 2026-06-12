# Development Guide

## Prerequisites

- **Node.js 20+** (production uses 24.x on Vercel)
- **pnpm** available globally (`npm i -g pnpm`)
- Access to Vercel project if deploying previews/production
- Access to the linked Supabase project if managing auth users or schema
- Brevo account with API key (for email notification testing)

## Install

```bash
pnpm install
```

## Local Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Validation

```bash
# Type check
pnpm exec tsc --noEmit

# Production build
pnpm run build
```

Current status:
- TypeScript: `ignoreBuildErrors: true` in `next.config.mjs`
- Production build succeeds on Vercel

## Important Source Files

### Auth & Core

| File | Purpose |
| --- | --- |
| `app/(auth)/login/page.tsx` | Login form UI |
| `app/(auth)/login/actions.ts` | Login server action |
| `proxy.ts` | Session refresh + route protection middleware |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client (cookie-based) |
| `lib/supabase/admin.ts` | Service-role Supabase client (bypasses RLS) |
| `lib/auth/role.ts` | Role helper functions |
| `lib/env.ts` | Server env variable validation |

### Admin Dashboard

| File | Purpose |
| --- | --- |
| `app/dashboard/admin/page.tsx` | Admin main dashboard |
| `app/dashboard/admin/actions.ts` | Tutor create/update server actions |
| `app/dashboard/admin/data.ts` | Admin data loaders |
| `app/dashboard/admin/tutors/page.tsx` | Tutor list page |
| `app/dashboard/admin/tutors/[tutorId]/page.tsx` | Tutor detail/edit page |
| `app/dashboard/admin/tutors/[tutorId]/edit-tutor-form.tsx` | Tutor edit form |
| `app/dashboard/admin/class-actions.ts` | Class create/approve/reject actions |
| `app/dashboard/admin/finance/finance-actions.ts` | Payment actions |
| `app/dashboard/admin/document-feedback-actions.ts` | Feedback resolution actions |
| `app/dashboard/admin/settings/page.tsx` | Email settings page |
| `app/dashboard/admin/settings/actions.ts` | Email settings server actions |
| `app/dashboard/admin/settings/email-settings-form.tsx` | Email settings form |

### Tutor Dashboard

| File | Purpose |
| --- | --- |
| `app/dashboard/tutor/page.tsx` | Tutor main dashboard |
| `app/dashboard/tutor/class-actions.ts` | Open class request actions |
| `app/dashboard/tutor/classes/[classId]/report-actions.ts` | Per-class report actions |
| `app/dashboard/tutor/document-feedback-actions.ts` | Feedback submission actions |
| `app/dashboard/tutor/reports/report-actions.ts` | Report management actions |
| `app/dashboard/tutor/change-password/page.tsx` | Password change page |
| `app/dashboard/tutor/change-password/actions.ts` | Password change action |

### Email & Shared

| File | Purpose |
| --- | --- |
| `lib/email.tsx` | All email templates + Brevo send function |

## Critical Next.js Rule Learned Here

If a file contains:

```ts
'use server'
```

it must only export async functions.

Do **not** export:
- state objects
- config objects
- constants used only by client forms

Example of previous bug:
- exporting `initialState` from `app/dashboard/admin/actions.ts`
- caused local runtime crash and production Tutor-create 500

Fix pattern:
- keep state objects inside client components
- import only async server actions from the `'use server'` file

## pnpm Strict Mode Rule

pnpm does not hoist transitive dependencies. Every package that is directly imported in source code **must** be a direct dependency in `package.json`.

This caused a production build failure where `@react-email/render` was imported in `lib/email.tsx` but only existed as a transitive dependency of `react-email`. The fix was adding it as a direct dependency.

Rule of thumb: if you `import` from a package, it must be in `package.json` dependencies.

## Active Environment Variables

| Variable | Scope | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes |
| `BOOTSTRAP_ADMIN_EMAIL` | Server only | Yes |
| `BREVO_API_KEY` | Server only | For email |
| `NEXT_PUBLIC_APP_URL` | Browser + server | For email links |
| `CLOUDFLARE_ACCOUNT_ID` | Server only | For R2 |
| `CLOUDFLARE_R2_BUCKET` | Server only | For R2 |
| `R2_ACCESS_KEY_ID` | Server only | For R2 |
| `R2_SECRET_ACCESS_KEY` | Server only | For R2 |
| `R2_ENDPOINT` | Server only | For R2 |

## Email Notification Development

### Setup

1. Add to `.env.local`:
   ```bash
   BREVO_API_KEY=<your-brevo-api-key>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
2. Restart `pnpm dev`

### Template Development

- Templates live in `lib/email.tsx`.
- Use React Email components and inline style objects only; email clients do not support the full web CSS model.
- Use `try/catch` around every email trigger so core actions still succeed when Brevo fails.
- Admin-recipient email goes through `sendAdminNotificationEmail()`, which reads `/dashboard/admin/settings` configuration from `public.email_settings`.
- Tutor-recipient email should use the Tutor auth email from Supabase Admin API.
- Logo is loaded from `${NEXT_PUBLIC_APP_URL}/logoTPA.png`; use the production URL when verifying final email visuals.

### Local Email Testing

1. Set up `.env.local` with `BREVO_API_KEY`
2. Run `pnpm dev`
3. Login as Admin → create a Tutor → check Tutor inbox for welcome email
4. Or: Login as Tutor → submit feedback → check Admin inbox
5. Check Brevo Transactional logs at https://app.brevo.com → Transactional → Logs

See [Email Notifications](./email-notifications.md) for the complete step-by-step testing guide covering all 8 notification types.

## Manual Test Flow

### Admin → Tutor Management

1. Login as Admin
2. Open `/dashboard/admin`
3. Create Tutor with fresh email
4. Confirm generated password appears once
5. Confirm Tutor appears in list (`/dashboard/admin/tutors`)
6. Open Tutor detail
7. Edit Tutor fields (name, phone, subjects, notes)
8. Toggle inactive
9. Try Tutor login → blocked
10. Toggle active back if needed

### Tutor → Class Workflow

1. Login as Tutor
2. Browse open classes
3. Request an open class
4. Check Admin inbox for notification
5. Login as Admin → approve/reject request
6. Check Tutor inbox for result

### Tutor → Report Workflow

1. Login as Tutor
2. Navigate to reports
3. Create/edit monthly progress report
4. Save → check Admin inbox for notification
5. Login as Admin → verify report in admin dashboard

### Tutor → Document Feedback

1. Login as Tutor
2. Submit material request or library issue report
3. Check Admin inbox for notification
4. Login as Admin → resolve feedback (done/rejected)
5. Check Tutor inbox for resolution email

### Admin → Payment

1. Login as Admin
2. Navigate to finance dashboard
3. Mark a Tutor payment as paid
4. Check Tutor inbox for payment confirmation email

## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.

## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
