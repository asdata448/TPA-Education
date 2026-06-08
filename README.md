# TPA-Education

TPA-Education is a Next.js 16 App Router application deployed on Vercel and backed by Supabase for authentication and profile-based authorization.

## Current Status

**Epic 1 Complete**: Auth foundation + role-based routing deployed to production.

- Supabase SSR clients (browser + server + admin)
- `profiles` schema + role model (`admin`, `tutor`)
- login flow at `/login`
- middleware-based dashboard protection in `proxy.ts`
- role-based redirect logic
- production test accounts verified

### Active Environments

**Supabase Project**
- Project name: `TPA Education Clean`
- Project ref: `zxvddwycpfudbauaxqit`
- Region: `ap-southeast-1` (Singapore)
- Migration applied: `20260608000001_create_profiles.sql`

**Vercel Deployment**
- Project: `tpa-education`
- Production URL: https://tpa-education-mauve.vercel.app

**Test Accounts** (created in production Supabase)
- Admin: `admin.test@tpa-education.com` / `Test@Admin123`
- Tutor: `tutor.test@tpa-education.com` / `Test@Tutor123`

## Core Stack

- Next.js 16
- React 19
- TypeScript
- shadcn/ui + Radix UI
- Supabase Auth + Postgres
- Vercel hosting

## Local Development

Install dependencies and run the app:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy values into `.env.local` and Vercel project envs.

Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zxvddwycpfudbauaxqit.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
BOOTSTRAP_ADMIN_EMAIL=<admin-email>
```

Notes:
- `NEXT_PUBLIC_*` values are safe for browser exposure
- `SUPABASE_SERVICE_ROLE_KEY` is server-only
- never commit real secrets

## Auth Routes

- `/login` - email/password login for Admin and Tutor
- `/dashboard/admin` - admin dashboard placeholder
- `/dashboard/tutor` - tutor dashboard placeholder

## Route Protection

`proxy.ts` protects `/dashboard/:path*`:

- unauthenticated users ? `/login`
- tutor users hitting `/dashboard/admin/*` ? `/dashboard/tutor`
- admin users allowed through dashboard routes
- role checks happen server-side against `profiles`

## Database

Current local migration:

- `supabase/migrations/20260608000001_create_profiles.sql`

Current required auth/profile model:

- Supabase Auth user in `auth.users`
- matching row in `public.profiles`
- supported roles: `admin`, `tutor`

## Deployment

Vercel auto-deploys from `main`:

```bash
pnpm run build
vercel --prod
```

Set environment variables in Vercel project settings before deploying.

## Epic Progress

- [x] Epic 1: Auth foundation with role-based routing
- [ ] Epic 2: Student management
- [ ] Epic 3: Tutor management
- [ ] Epic 4: Schedule + Booking engine
- [ ] Epic 5: Payments
- [ ] Epic 6: Analytics + Reporting

See `_spec/epics.yaml` for full epic definitions.

