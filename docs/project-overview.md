# TPA-Education Project Overview

## Executive Summary

TPA-Education is a single-repository Next.js application for a tutoring center brand named TPA+. The active product includes a marketing landing page, an internal Admin/Tutor auth layer, Tutor account provisioning, class management with scheduling, progress reporting, tuition fee collection, material library, and Brevo-powered transactional email notifications.

## Current Scope

### Included

- marketing landing experience
- Admin/Tutor login with role-based protected dashboards
- Admin Tutor account creation with one-time generated password
- Admin Tutor list and Tutor detail editing
- Tutor active/inactive access control
- Tutor self-service password change
- Class management (create, assign, open classes, schedule, sessions, attendance)
- Open class request/approval/rejection workflow
- Document feedback (material requests + library issue reports) with admin resolution
- Monthly student progress reporting (Tutor submits, public 16:9 report card, PNG export)
- Admin progress report verification dashboard
- Tuition fee collection dashboard
- Admin Tutor salary payout dashboard (auto-calculated 95% of tuition fee, QR scan payment)
- Cloudflare R2 material library (upload, download, role-based access)
- Tutor bank account & static QR code configuration
- Brevo transactional email notifications for Admin/Tutor operational workflows
- Admin email notification recipient settings (`/dashboard/admin/settings`)

### Explicitly Removed From Current Scope

- standalone Student CRUD
- standalone Parent CRUD
- Student-Parent linking UI
- automatic parent report email delivery
- schedule proposal workflow

Reason: that information will be recorded later inside the class/schedule workflow where Admin publishes classes and Tutors receive them.

## Repository Classification

| Property | Value |
| --- | --- |
| Type | monolith |
| Project type | web |
| Runtime model | Next.js App Router frontend with server-side auth integration |
| Deployment target | Vercel |
| Package manager | pnpm |

## Primary Technology Stack

| Category | Technology | Version | Notes |
| --- | --- | --- | --- |
| Framework | Next.js | 16.2.6 | App Router under `app/`, Turbopack build |
| UI | React | 19.x | Client/server component mix |
| Language | TypeScript | 5.7.3 | `ignoreBuildErrors: true` in next.config |
| Styling | Tailwind CSS | 4.2.0 | CSS variables in `app/globals.css` |
| Components | shadcn/ui + Radix UI | — | Pre-built accessible components |
| Auth | Supabase Auth + `@supabase/ssr` | active | Email/password auth for Admin/Tutor |
| Database | Supabase Postgres | active | `profiles`, `tutors`, `classes`, `email_settings`, etc. |
| Email | Brevo Transactional Email + React Email | active | Operational notifications using `lib/email.tsx` templates |
| Storage | Cloudflare R2 | active | Material library files |
| Hosting | Vercel | active | Production deployed |
| Analytics | Vercel Analytics | active | `@vercel/analytics` |

## Active Production Services

| Service | URL / Reference |
| --- | --- |
| Production URL | `https://tpaeducation.io.vn` |
| Vercel project | `https://tpa-education-mauve.vercel.app` |
| Custom domain | `tpaeducation.io.vn` |
| Supabase project ref | `zxvddwycpfudbauaxqit` |
| Supabase region | `ap-southeast-1` (Singapore) |
| Brevo sender | `TPA+ <no-reply@tpaeducation.io.vn>` |

## Email Notification Scope

The project includes server-side transactional email for operational Admin/Tutor events. Email templates live in `lib/email.tsx`, use React Email components, and send through Brevo from `TPA+ <no-reply@tpaeducation.io.vn>`. Admin recipients are configured in `/dashboard/admin/settings` and stored in `public.email_settings`.

Covered events:
- Tutor onboarding (welcome email with temporary password)
- Tutor password reset / change
- Open-class request submission and Admin approval/rejection
- Class assignment by Admin
- Document feedback submission and resolution
- Tutor progress report submission
- Tutor payout confirmation

Automatic Parent report delivery remains deferred.

See [Email Notifications](./email-notifications.md) for full template inventory, trigger matrix, and step-by-step testing guide.

## Important Recent Bug Fixes

### Tutor-creation 500 (fixed)

Problem:
- `app/dashboard/admin/actions.ts` used `'use server'`
- the module exported non-async objects (`initialState`, `initialUpdateState`)
- Next.js only allows async function exports from server action modules

Resolution:
- keep only async function exports in the server action module
- move local initial state objects into client components

### Vercel build failure (fixed)

Problem:
- `@react-email/render` was imported directly in `lib/email.tsx` but only existed as a transitive dependency
- pnpm strict mode on Vercel blocked the import, causing `pnpm run build` to fail

Resolution:
- add `@react-email/render` as a direct dependency in `package.json`

## Documentation Map

- [Architecture](./architecture.md) — runtime flow, source layers, email architecture
- [Development Guide](./development-guide.md) — setup, coding rules, testing
- [Deployment Guide](./deployment-guide.md) — deploy steps, env vars, verification checklist
- [API Contracts](./api-contracts.md) — server action signatures
- [Data Models](./data-models.md) — Supabase tables, columns, relationships
- [Email Notifications](./email-notifications.md) — templates, triggers, testing guide
- [Cloudflare R2 Material Library Plan](./r2-material-library-plan.md) — R2 storage design

## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.

## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
