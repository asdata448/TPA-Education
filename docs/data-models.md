# Data Models

## Active Application Data Models

The application now includes active Supabase-backed data models for Epic 1 authentication and authorization.

## Supabase Auth Model

Primary identity is managed by Supabase Auth in `auth.users`.

Relevant fields used by the app:

- `id` - UUID primary key
- `email` - login identifier
- `encrypted_password` - managed by Supabase
- auth session metadata - managed by Supabase

## Profiles Table

The application uses a `public.profiles` table created by:

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
- support future Admin/Tutor workflows in later epics

## Authorization Model

Supported roles:

- `admin`
- `tutor`

Behavior:

- Admin users land on `/dashboard/admin`
- Tutor users land on `/dashboard/tutor`
- Tutor access to `/dashboard/admin/*` is blocked and redirected

## Static Content Structures

The landing page still uses `lib/data.ts` for static marketing content such as:

- tutor records
- subject definitions
- FAQ entries
- consultation process steps
- commitment cards

## Current Gaps

- no domain models yet for students, classes, schedules, payments, or reports
- no server-side persistence yet for contact form submissions
- no automated schema drift checks or migration tests in CI
