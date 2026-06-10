# Project Documentation Index

## Project Overview

- **Type:** monolith
- **Project type:** web
- **Primary language:** TypeScript
- **Architecture:** Next.js frontend monolith with Supabase-backed auth and Tutor management

## Quick Reference

- **Framework:** Next.js 16 App Router
- **UI:** React 19 + Tailwind CSS 4 + shadcn/ui + Radix UI
- **Auth:** Supabase Auth + `@supabase/ssr`
- **Database:** Supabase Postgres (`profiles`, `tutors`)
- **Production URL:** `https://tpa-education-mauve.vercel.app`
- **Supabase project ref:** `zxvddwycpfudbauaxqit`

## Current Product Scope

- marketing landing page
- Admin/Tutor login
- protected dashboards
- Admin Tutor creation
- Admin Tutor profile management
- Tutor Bank Account & static QR code configuration (R2-backed)
- Admin Tuition Fee collecting dashboard
- Admin Tutor Salary payout dashboard (auto-calculated 95% of tuition fee, QR scan payment)
- Monthly Student Progress Reporting & Tuition Fee Notifications (Tutor submits, public 16:9 report card page, PNG export)
- Admin Progress Report Verification Dashboard

Out of current scope:
- standalone Student/Parent CRUD


## Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [API Contracts](./api-contracts.md)
- [Data Models](./data-models.md)`n- [Cloudflare R2 Material Library Plan](./r2-material-library-plan.md)


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.


## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.

