# Project Documentation Index

## Project Overview

- **Type:** monolith
- **Project type:** web
- **Primary language:** TypeScript
- **Architecture:** Next.js frontend monolith with Supabase-backed auth and Tutor management

## Quick Reference

| Category | Technology | Version |
| --- | --- | --- |
| Framework | Next.js | 16.2.6 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS 4 + shadcn/ui + Radix UI | — |
| Auth | Supabase Auth + `@supabase/ssr` | active |
| Email | Brevo Transactional Email + React Email templates | active |
| Database | Supabase Postgres | active |
| Storage | Cloudflare R2 | active |
| Hosting | Vercel | active |
| Package manager | pnpm | 10.x |

- **Production URL:** `https://tpaeducation.io.vn`
- **Custom domain:** `tpaeducation.io.vn`
- **Supabase project ref:** `zxvddwycpfudbauaxqit`

## Current Product Scope

- marketing landing page
- Admin/Tutor login
- protected dashboards with role-based routing
- Admin Tutor creation with one-time generated password
- Admin Tutor profile management (list, detail, edit)
- Tutor active/inactive access control
- Tutor self-service password change
- Admin email notification recipient settings (`/dashboard/admin/settings`)
- Brevo transactional email notifications for all Tutor/Admin operational workflows
- Class management (create, schedule, sessions, attendance)
- Open class request/approval workflow
- Document feedback (material requests + library issue reports)
- Monthly student progress reporting (Tutor submits, public report card)
- Admin progress report verification dashboard
- Tuition fee collection dashboard
- Admin Tutor salary payout (auto-calculated 95% of tuition fee, QR scan payment)
- Cloudflare R2 material library (upload, download, role-based access)
- Tutor bank account & static QR code configuration

Out of current scope:
- standalone Student/Parent CRUD
- automatic parent report email delivery
- schedule proposal workflow

## Generated Documentation

- [Project Overview](./project-overview.md) — high-level summary, tech stack, scope
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
