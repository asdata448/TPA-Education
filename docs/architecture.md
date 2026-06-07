# TPA-Education Architecture

## Executive Summary

The application is a monolithic Next.js 16 App Router site with one primary route (`app/page.tsx`). It behaves as a marketing frontend rather than a transactional product. Most business content is represented as local arrays and rendered through presentation-first React components.

## Architecture Pattern

- Pattern: component-based frontend monolith
- Composition: route shell + section components + local UI kit
- Data source: static in-repo content (`lib/data.ts` + inline arrays)
- State model: local component state only
- Network model: no active API integration detected in current page flow

## Runtime Flow

1. `app/layout.tsx` sets metadata, fonts, skip link, analytics gate, global styles
2. `app/page.tsx` composes the landing page sections in fixed order
3. Section components render content from either:
   - `lib/data.ts`
   - component-local constant arrays
   - hard-coded image/CTA links
4. Interactive widgets use client-side state (`useState`, `useEffect`, `useRef`, `useCallback`)
5. Contact form validates locally and simulates success without external submission

## Source-Level Layers

### App Layer

- `app/layout.tsx` - root HTML shell, metadata, analytics, accessibility link
- `app/page.tsx` - top-level page composition
- `app/globals.css` - brand tokens, motion, utilities, accessibility styles

### Feature Sections

- `components/site-header.tsx`
- `components/hero-section.tsx`
- `components/trust-section.tsx`
- `components/tutors-section.tsx`
- `components/process-section.tsx`
- `components/about-section.tsx`
- `components/commitments-section.tsx`
- `components/parent-report-section.tsx`
- `components/faq-section.tsx`
- `components/contact-section.tsx`
- `components/floating-cta.tsx`
- `components/site-footer.tsx`

### Shared Data / Utilities

- `lib/data.ts` - tutor, subject, FAQ, process, commitment datasets
- `lib/utils.ts` - `cn()` class merge helper

### UI Foundation

- `components/ui/` - local shadcn/Radix-derived primitives plus animated utility components
- `components.json` - shadcn alias + styling config

## State Management

- No global state store
- No Context provider usage in app-level feature flow
- Local state used for:
  - sticky/mobile header behavior
  - floating CTA visibility
  - contact form selections and submission states
  - visual micro-interactions in UI primitives

## API / Integration Architecture

Current implementation has no first-party API routes under `app/api` and no server actions. External integrations are limited to:

- Vercel Analytics in production
- External asset hosting via Vercel Blob URLs / remote images
- CTA links to phone, email, Facebook, and Zalo
- v0 project linkage referenced in `README.md`

## Data Architecture

- Primary content is static TypeScript objects/arrays
- No ORM, schema, migrations, or database access found in active source paths
- Environment files mention Supabase/Auth0, but no corresponding runtime usage detected in scanned app code

## Security / Auth

- No active user auth flows found in app source
- Environment contains Auth0 and Supabase credentials; current site does not expose auth UI
- Contact form does not transmit PII to a backend yet, reducing runtime attack surface but also leaving business workflow incomplete

## Build / Deployment Architecture

- Next.js build via `npm run build`
- Config in `next.config.mjs`
- Vercel project metadata in `.vercel/project.json`
- Images set `unoptimized: true`, implying no Next image optimization pipeline
- TypeScript build errors explicitly ignored in Next config

## Testing Strategy

- No test suite detected
- `lint` script exists, but no ESLint config file was found in the scanned set
- Best current validation mode is manual UI verification + build/lint checks

## Architectural Risks

- Static-content-heavy structure slows non-technical content updates
- Form lacks backend delivery / CRM persistence
- Hidden env secrets can drift from actual deployed architecture
- Ignoring TypeScript build errors can ship regressions
