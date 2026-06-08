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

Out of current scope:
- standalone Student/Parent CRUD

## Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [API Contracts](./api-contracts.md)
- [Data Models](./data-models.md)


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.
