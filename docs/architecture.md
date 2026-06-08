# TPA-Education Architecture

## Executive Summary

The application is a monolithic Next.js 16 App Router app deployed on Vercel. Epic 1 authentication and authorization is now implemented and deployed on production using Supabase Auth, SSR session refresh, and profile-based role checks for Admin and Tutor dashboards.

## Architecture Pattern

- Pattern: frontend-first Next.js monolith with server-side auth boundary
- Composition: App Router pages + server actions + SSR middleware + local UI kit
- Auth/data backend: Supabase Auth + Postgres
- Authorization model: profile role lookup from `public.profiles`
- Hosting: Vercel

## Runtime Flow

1. `app/layout.tsx` sets global shell, metadata, analytics gate, and styles
2. marketing page renders from `app/page.tsx`
3. login page at `app/(auth)/login/page.tsx` submits credentials
4. `app/(auth)/login/actions.ts` authenticates with Supabase and resolves role from `profiles`
5. client navigates to role target dashboard
6. `proxy.ts` refreshes session for `/dashboard/:path*` and enforces server-side route protection
7. dashboard pages render placeholder content for authorized users

## Source-Level Layers

### App Layer

- `app/layout.tsx` - root shell
- `app/page.tsx` - landing page
- `app/globals.css` - global tokens and styles
- `app/(auth)/login/page.tsx` - login form UI
- `app/(auth)/login/actions.ts` - login server action
- `app/dashboard/admin/page.tsx` - admin dashboard placeholder
- `app/dashboard/tutor/page.tsx` - tutor dashboard placeholder
- `proxy.ts` - SSR session refresh + dashboard authorization

### Auth / Supabase Layer

- `lib/env.ts` - env access helpers
- `lib/auth/role.ts` - role constants + type guards
- `lib/supabase/client.ts` - browser Supabase client
- `lib/supabase/server.ts` - server Supabase client with cookies
- `lib/supabase/admin.ts` - service-role Supabase client

### Database Layer

- `supabase/migrations/20260608000001_create_profiles.sql` - `profiles` schema + RLS
- active Supabase project ref: `zxvddwycpfudbauaxqit`

### UI Foundation

- `components/ui/` - shadcn/Radix primitives
- auth screens currently reuse shared `Card`, `Form`, `Input`, `Button`

## Auth Architecture

### Identity

- primary identity source: Supabase Auth `auth.users`
- login method: email/password
- no self-service signup in current product scope

### Authorization

- app roles: `admin`, `tutor`
- role source: `public.profiles.role`
- role checks are server-side
- middleware protects dashboard routes before page render

### Session Handling

- `@supabase/ssr` used for cookie-aware session refresh
- `proxy.ts` runs on `/dashboard/:path*`
- unauthenticated requests redirect to `/login`
- tutor requests to `/dashboard/admin/*` redirect to `/dashboard/tutor`
- admin requests to dashboard routes are allowed

## Data Architecture

Current persistence split:

- marketing content: static TypeScript arrays and local component constants
- auth identity: Supabase Auth
- role/profile data: Supabase Postgres `public.profiles`

`public.profiles` currently stores:

- `id`
- `role`
- `full_name`
- `active`
- `created_at`
- `updated_at`

## Deployment Architecture

- frontend hosting: Vercel
- backend/auth: Supabase
- repo linked Vercel project: `tpa-education`
- production URL: `https://tpa-education-mauve.vercel.app`
- active production Supabase project ref: `zxvddwycpfudbauaxqit`

## Testing Strategy

### Current Validation

- local build verification passes
- lint runs with warnings only, no errors
- production deployment updated to the new Supabase project
- production test accounts created for Admin and Tutor
- manual auth verification ready

### Missing Coverage

- no automated unit tests for auth helpers
- no automated integration tests for login action
- no E2E coverage for dashboard authorization flows

## Current Risks

- app still relies on manual acceptance testing for auth flows
- TypeScript build errors are ignored by Next.js config
- service role key handling must remain server-only
- repo still contains some older documentation references that may need cleanup in future audits

## Near-Term Recommendations

1. run full manual acceptance test pass using the provided Admin and Tutor accounts
2. add automated E2E tests for login and role redirects
3. remove stale Auth0 references if no longer needed
4. proceed to Epic 2 only after Epic 1 is accepted and sprint status is updated
