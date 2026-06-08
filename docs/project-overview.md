# TPA-Education Project Overview

## Executive Summary

TPA-Education is a single-repository Next.js application for a tutoring center brand named TPA+. The project now includes both a marketing landing page and an Epic 1 authentication layer with Supabase-backed Admin/Tutor login and protected dashboards.

## Project Purpose

- Present the TPA+ tutoring brand for THCS/THPT students
- Showcase tutors, subjects, process, commitments, and FAQs
- Convert visitors into consultation requests via the contact form and call-to-action links
- Support Admin and Tutor authentication as the foundation for later internal workflows
- Support deployment to Vercel with Supabase as the auth/data backend

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
| Language | TypeScript | 5.7.3 | Strict mode enabled |
| Styling | Tailwind CSS | 4.2.0 | CSS variables in `app/globals.css` |
| Component base | shadcn/ui + Radix UI | mixed | Large local `components/ui/` inventory |
| Forms | react-hook-form, zod | installed | Used in login flow |
| Auth | Supabase Auth + `@supabase/ssr` | active | Email/password auth for Admin/Tutor |
| Database | Supabase Postgres | active | `profiles` schema with role model |
| Analytics | Vercel Analytics | 1.6.1 | Enabled only in production |
| Theme | next-themes | 0.4.6 | Present but dark mode not wired into main page |

## Functional Scope

- Marketing landing experience assembled in `app/page.tsx`
- Static tutor/subject/FAQ/process/commitment content from `lib/data.ts`
- Login page at `/login`
- Role-based redirects to `/dashboard/admin` and `/dashboard/tutor`
- Middleware-protected dashboard routes
- Contact form UI with local validation and simulated async submission

## Active Production Services

- Vercel production URL: `https://tpa-education-mauve.vercel.app`
- Supabase project ref: `zxvddwycpfudbauaxqit`
- Test accounts provisioned for Admin and Tutor

## Key Risks / Gaps

- `next.config.mjs` ignores TypeScript build errors
- Contact form still simulates submit only; no real lead pipeline
- No automated E2E or integration tests yet for auth flows
- Legacy Auth0-related environment entries still exist and may need cleanup
- Some generated docs still require periodic refresh as implementation evolves

## Documentation Map

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [API Contracts](./api-contracts.md)
- [Data Models](./data-models.md)
