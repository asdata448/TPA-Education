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

## Validation

```bash
pnpm exec tsc --noEmit
pnpm run build
```

Current status:
- TypeScript clean
- production build succeeds on Vercel

## Important Source Files

- `app/(auth)/login/page.tsx` - login form UI
- `app/(auth)/login/actions.ts` - login server action
- `app/dashboard/admin/page.tsx` - Admin Tutor dashboard
- `app/dashboard/admin/actions.ts` - Tutor create/update server actions
- `app/dashboard/admin/create-tutor-form.tsx` - Tutor create client form
- `app/dashboard/admin/data.ts` - Admin Tutor data loaders
- `app/dashboard/admin/tutors/[tutorId]/page.tsx` - Tutor detail page
- `proxy.ts` - session refresh + route protection
- `lib/supabase/*` - Supabase client helpers
- `lib/auth/role.ts` - role helpers
- `lib/email.tsx` - Brevo + React Email notification templates
- `app/dashboard/admin/settings/*` - Admin notification recipient settings

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

## Active Environment Variables

Required Supabase variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BREVO_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Email Notification Development

- Templates live in `lib/email.tsx`.
- Use React Email components and inline style objects only; email clients do not support the full web CSS model.
- Use `try/catch` around every email trigger so core actions still succeed when Brevo fails.
- Admin-recipient email goes through `sendAdminNotificationEmail()`, which reads `/dashboard/admin/settings` configuration from `public.email_settings`.
- Tutor-recipient email should use the Tutor auth email from Supabase Admin API.
- Logo is loaded from `${NEXT_PUBLIC_APP_URL}/logoTPA.png`; use the production URL when verifying final email visuals.

Manual local test:

```bash
# .env.local
BREVO_API_KEY=<key>
NEXT_PUBLIC_APP_URL=http://localhost:3000

pnpm dev
```

Then trigger a flow such as Tutor password reset or Tutor document feedback and check Brevo Transactional logs.

## Manual Test Flow

### Tutor flow
1. Login as Admin
2. Open `/dashboard/admin`
3. Create Tutor with fresh email
4. Confirm generated password appears once
5. Confirm Tutor appears in list
6. Open Tutor detail
7. Edit Tutor fields
8. Toggle inactive
9. Try Tutor login -> blocked
10. Toggle active back if needed


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.


## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
