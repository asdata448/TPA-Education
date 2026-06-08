# TPA-Education Project Overview

## Executive Summary

TPA-Education is a single-repository Next.js application for a tutoring center brand named TPA+. The active product now includes a marketing landing page plus an internal Admin/Tutor auth layer, Tutor account provisioning, and Tutor profile management.

## Current Scope

### Included
- marketing landing experience
- Admin/Tutor login
- role-based protected dashboards
- Admin Tutor account creation
- one-time generated Tutor password display
- Admin Tutor list and Tutor detail editing
- Tutor active/inactive access control

### Explicitly Removed From Current Scope
- standalone Student CRUD
- standalone Parent CRUD
- Student-Parent linking UI

Reason: that information will be recorded later inside the class/schedule workflow where Admin publishes classes and Tutors receive them.

## Repository Classification

- Type: monolith
- Project type: web
- Runtime model: Next.js App Router frontend with server-side auth integration
- Deployment target: Vercel

## Primary Technology Stack

| Category | Technology | Version | Notes |
| --- | --- | --- | --- |
| Framework | Next.js | 16.2.6 | App Router under `app/` |
| UI | React | 19.x | Client/server component mix |
| Language | TypeScript | 5.7.3 | typecheck clean |
| Styling | Tailwind CSS | 4.2.0 | CSS variables in `app/globals.css` |
| Auth | Supabase Auth + `@supabase/ssr` | active | Email/password auth for Admin/Tutor |
| Database | Supabase Postgres | active | `profiles` + `tutors` |
| Hosting | Vercel | active | production deployed |

## Active Production Services

- Vercel production URL: `https://tpa-education-mauve.vercel.app`
- Supabase project ref: `zxvddwycpfudbauaxqit`
- Test accounts provisioned for Admin and Tutor

## Important Recent Bug Fix

A production Tutor-creation bug was traced to invalid Next.js server action exports.

Problem:
- `app/dashboard/admin/actions.ts` used `'use server'`
- the module exported non-async objects (`initialState`, `initialUpdateState`)
- Next.js only allows async function exports from server action modules

Impact:
- local runtime crash
- production `POST /dashboard/admin` 500 during Tutor creation

Resolution:
- keep only async function exports in the server action module
- move local initial state objects into client components

## Documentation Map

- [Architecture](./architecture.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [API Contracts](./api-contracts.md)
- [Data Models](./data-models.md)


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.


## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
