# TPA-Education

TPA-Education is a Next.js 16 App Router application deployed on Vercel and backed by Supabase for authentication, profile-based authorization, and Admin-managed Tutor operations.

## Current Status

**Epic 1 Complete**: Auth foundation + role-based routing deployed to production.  
**Epic 2 Complete**: Tutor account creation + Tutor profile management deployed to production.  
**Epic 3 Cancelled / Removed from current scope**: Student/Parent records were intentionally removed. That data will instead be captured later inside the schedule/class workflow where Admin publishes classes and Tutors receive them.

### Live Features

- Supabase SSR clients (browser + server + admin)
- `profiles` schema + role model (`admin`, `tutor`)
- Tutor operational schema in `public.tutors`
- login flow at `/login`
- middleware-based dashboard protection in `proxy.ts`
- role-based redirect logic
- Admin dashboard with:
  - Tutor account creation
  - generated one-time initial password display
  - Tutor list
  - Tutor detail/edit page
  - Tutor active/inactive access control

### Important Recent Fix

Tutor creation was failing because `app/dashboard/admin/actions.ts` was marked with `'use server'` but exported non-async objects (`initialState`, `initialUpdateState`).

That is invalid in Next.js server action modules and caused:
- local runtime error
- production `POST /dashboard/admin` 500 during Tutor creation

Fix applied:
- only async functions remain exported from the server action file
- client components now own their local initial state objects

## Active Environments

### Supabase Project
- Project name: `TPA Education Clean`
- Project ref: `zxvddwycpfudbauaxqit`
- Region: `ap-southeast-1` (Singapore)

### Applied Migrations
- `20260608000001_create_profiles.sql`
- `20260609000001_create_tutors.sql`
- `20260609000002_add_tutor_subjects.sql`
- `20260609000006_remove_students_parents.sql`

### Vercel Deployment
- Project: `tpa-education`
- Production URL: https://tpa-education-mauve.vercel.app

## Test Accounts

### Admin
- email: `admin.test@tpa-education.com`
- password: `Test@Admin123`

### Tutor
- email: `tutor.test@tpa-education.com`
- password: `Test@Tutor123`

## Core Stack

- Next.js 16
- React 19
- TypeScript
- shadcn/ui + Radix UI
- Supabase Auth + Postgres
- Vercel hosting

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Required Environment Variables

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

## Routes

- `/login` - email/password login for Admin and Tutor
- `/dashboard/admin` - Admin Tutor management dashboard
- `/dashboard/admin/tutors/[tutorId]` - Tutor detail/edit page
- `/dashboard/tutor` - Tutor dashboard placeholder

## Route Protection

`proxy.ts` protects `/dashboard/:path*`:

- unauthenticated users -> `/login`
- Tutor users hitting `/dashboard/admin/*` -> `/dashboard/tutor`
- inactive Tutor users hitting Tutor dashboard -> `/login?reason=inactive`
- Admin users allowed through admin dashboard routes
- role checks happen server-side against `profiles`

## Database

Current active domain tables:
- `public.profiles`
- `public.tutors`

Removed from current scope:
- `public.students`
- `public.parents`
- `public.student_parents`

Reason: Student/Parent information will be attached later to the class/schedule flow instead of being managed as standalone Admin CRUD right now.

## Manual Test Flow

### Tutor Creation
1. Login as Admin
2. Open `/dashboard/admin`
3. Create Tutor with fresh email
4. Confirm generated password appears once
5. Confirm Tutor appears in Tutor list
6. Open Tutor detail
7. Update Tutor fields
8. Toggle Tutor inactive
9. Try Tutor login -> should be blocked from Tutor dashboard
10. Toggle Tutor active again

## Validation Commands

```bash
pnpm exec tsc --noEmit
pnpm run build
npx supabase db push
vercel deploy --prod
```

## Deployment

```bash
pnpm run build
vercel --prod
```

Set environment variables in Vercel project settings before deploying.

## Epic Progress

- [x] Epic 1: Auth foundation with role-based routing
- [x] Epic 2: Tutor management foundation
- [x] Epic 3: Removed from current implementation scope
- [ ] Epic 4: Class + subject + schedule workflow
- [ ] Epic 5: Tutor class workspace / open class flow
- [ ] Epic 6+: Remaining business workflows
