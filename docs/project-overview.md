# TPA-Education Project Overview

## Executive Summary

TPA-Education is a single-repository Next.js marketing website for a tutoring center brand named TPA+. The current app is a static, client-heavy landing page focused on lead generation, tutor credibility, subject positioning, and contact capture.

## Project Purpose

- Present the TPA+ tutoring brand for THCS/THPT students
- Showcase tutors, subjects, process, commitments, and FAQs
- Convert visitors into consultation requests via the contact form and call-to-action links
- Support deployment to Vercel and iterative visual editing from v0

## Repository Classification

- Type: monolith
- Project type: web
- Runtime model: Next.js App Router frontend
- Deployment target: Vercel

## Primary Technology Stack

| Category | Technology | Version | Notes |
| --- | --- | --- | --- |
| Framework | Next.js | 16.2.6 | App Router under `app/` |
| UI | React | 19.x | Client/server component mix |
| Language | TypeScript | 5.7.3 | Strict mode enabled |
| Styling | Tailwind CSS | 4.2.0 | CSS variables in `app/globals.css` |
| Component base | shadcn/ui + Radix UI | mixed | Large local `components/ui/` inventory |
| Forms | react-hook-form, zod | installed | Not yet used in contact flow |
| Charts/UX | recharts, embla, vaul, sonner | installed | Mostly design-system capacity |
| Analytics | Vercel Analytics | 1.6.1 | Enabled only in production |
| Theme | next-themes | 0.4.6 | Present but dark mode not wired into main page |

## Functional Scope

- Single-page landing experience assembled in `app/page.tsx`
- Static tutor/subject/FAQ/process/commitment content from `lib/data.ts`
- Contact form UI with local validation and simulated async submission
- No live backend submission, no persisted leads, no API route implementation found

## Key Risks / Gaps

- `next.config.mjs` ignores TypeScript build errors
- Contact form simulates submit only; no real lead pipeline
- `.env.local` contains secrets for systems not represented in current app surface
- No automated tests found
- `styles/globals.css` appears to be legacy/unused alongside `app/globals.css`

## Documentation Map

- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
- [Deployment Guide](./deployment-guide.md)
- [API Contracts](./api-contracts.md)
- [Data Models](./data-models.md)
