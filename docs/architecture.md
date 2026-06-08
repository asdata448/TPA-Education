# TPA-Education Architecture

## Executive Summary

The application is a monolithic Next.js 16 App Router app deployed on Vercel. The active internal workflow is Admin/Tutor authentication plus Admin-managed Tutor provisioning, Tutor profile management, and class/open-class workflow using Supabase Auth and Postgres.

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
5. Admin dashboard renders Tutor create/list features
6. Tutor detail page supports Admin edits
7. `proxy.ts` refreshes session and enforces route protection

## Source-Level Layers

### App Layer
- `app/(auth)/login/*`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/admin/actions.ts`
- `app/dashboard/admin/create-tutor-form.tsx`
- `app/dashboard/admin/data.ts`
- `app/dashboard/admin/tutors/[tutorId]/*`
- `app/dashboard/tutor/page.tsx`
- `proxy.ts`

### Auth / Supabase Layer
- `lib/env.ts`
- `lib/auth/role.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`

### Database Layer
- `public.profiles`
- `public.tutors`

## Tutor Provisioning Flow

1. Admin submits Tutor form on `/dashboard/admin`
2. server action verifies active Admin session
3. server action uses service-role Supabase client
4. create auth user via `auth.admin.createUser`
5. insert `profiles` row with role `tutor`
6. insert `tutors` row with operational fields
7. return one-time generated password to Admin
8. Admin can later edit Tutor detail page

## Important Constraint

`'use server'` modules must export only async functions.

This is now a documented architectural rule for this repo because it directly caused a production Tutor-create failure.


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.
