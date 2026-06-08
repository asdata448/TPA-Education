# Data Models

## Active Application Data Models

The application currently uses active Supabase-backed data models for:
- authentication / authorization
- Tutor operational management

## Supabase Auth Model

Primary identity is managed by Supabase Auth in `auth.users`.

Relevant fields used by the app:
- `id`
- `email`
- `encrypted_password`
- session metadata managed by Supabase

## Profiles Table

Created by:

```text
supabase/migrations/20260608000001_create_profiles.sql
```

### Columns
- `id uuid primary key references auth.users(id) on delete cascade`
- `role text not null check (role in ('admin', 'tutor'))`
- `full_name text not null`
- `active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Purpose
- link each authenticated user to an application role
- support server-side authorization in login action and middleware
- support Admin/Tutor workflows

## Tutors Table

Created by:

```text
supabase/migrations/20260609000001_create_tutors.sql
supabase/migrations/20260609000002_add_tutor_subjects.sql
```

### Columns
- `id uuid primary key default gen_random_uuid()`
- `profile_id uuid not null unique references public.profiles(id) on delete cascade`
- `phone text`
- `subjects text`
- `specialties text`
- `notes text`
- `active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Purpose
- store Tutor operational profile data separately from auth identity
- support Admin Tutor creation/editing
- support future Tutor assignment workflows

## Authorization Model

Supported roles:
- `admin`
- `tutor`

Behavior:
- Admin users land on `/dashboard/admin`
- Tutor users land on `/dashboard/tutor`
- Tutor access to `/dashboard/admin/*` is blocked and redirected
- inactive Tutor users are blocked from Tutor dashboard access

## Removed Models

Removed by:

```text
supabase/migrations/20260609000006_remove_students_parents.sql
```

Removed tables:
- `students`
- `parents`
- `student_parents`

Reason:
- Student/Parent data is no longer treated as independent Admin CRUD in the current product slice
- that information will instead be entered later as part of class/schedule management

## Static Content Structures

The landing page still uses `lib/data.ts` for static marketing content such as:
- tutor records
- subject definitions
- FAQ entries
- consultation process steps
- commitment cards


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.


## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
