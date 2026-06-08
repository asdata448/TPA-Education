---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: 
  - '_bmad-output/planning-artifacts/prds/prd-TPA-Education-2026-06-08/prd.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
workflowType: 'architecture'
project_name: 'TPA-Education'
user_name: 'Admin'
date: '2026-06-08'
lastStep: 8
status: 'complete'
completedAt: '2026-06-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Metadata

- **Project:** TPA-Education
- **Date:** 2026-06-08
- **Architect:** Admin
- **Primary Input:** PRD - TPA-Education Internal Tutor and Class Management MVP
- **Purpose:** Define solution architecture for internal tutor/class management system supporting Admin + multi-Tutor roles with Class, Open Class Request, Teaching Material Library, Material Request, and Monthly Report management.

## Input Documents Discovered

1. `_bmad-output/planning-artifacts/prds/prd-TPA-Education-2026-06-08/prd.md` - Primary PRD for MVP scope
2. `docs/project-overview.md` - Existing project context
3. `docs/architecture.md` - Existing architecture documentation (may be outdated)

---

_Workflow initialized. Ready for Step 2: Input Document Review._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product introduces an internal management system layered onto the existing TPA-Education project. Architecturally, the requirements break into six main capability areas: authentication and role-restricted access, Tutor management, Student/Parent/Class management, Open Class discovery/request workflows, Teaching Material Library, Teaching Material request workflows, and Monthly Report generation. This implies a shift from a static content-driven site to a transactional application with protected data, CRUD workflows, per-role dashboards, and generated artifacts.

The Admin is the operational source of truth in MVP. The Tutor experience is intentionally narrower: view assigned Classes and Schedules, browse Open Classes, request Open Classes, propose Schedules, browse/download Teaching Material Library items, create Material Requests, download fulfilled Teaching Materials, and generate Monthly Reports. This role asymmetry is important architecturally because it favors strong server-side authorization boundaries and a data model centered on Class ownership.

**Non-Functional Requirements:**
The main non-functional requirements implied by the PRD are security, role isolation, operational simplicity, and fast MVP delivery. The system must protect Parent contact information, Student data, Tuition Fee data, and Tutor Pay data. It must also ensure that Tutors can access only their own Classes, requests, files, and reports. The architecture should optimize for low operational overhead and fast iteration rather than high-scale distributed complexity.

Monthly Report generation introduces a consistency requirement: outputs must follow a center-branded template and produce an image suitable for manual sharing. Teaching Material delivery adds storage and download requirements, but not collaborative editing or rich in-browser document workflows.

**Scale & Complexity:**
This is a medium-complexity internal web application.

- Primary domain: full-stack web application
- Complexity level: medium
- Estimated architectural components: 7-10 major components (auth, role access, Tutor management, Class/Schedule management, Material Requests, file storage, report generation, admin/tutor dashboards)

### Technical Constraints & Dependencies

- Existing codebase is a Next.js application currently oriented around a public marketing site.
- Existing project docs indicate no active backend, API layer, or database implementation in the current app.
- MVP should likely preserve the public site while adding a protected internal application surface.
- File support is required for downloadable PDF and Word Teaching Materials.
- Generated Monthly Reports must output as images, not PDFs.
- The system should support one Admin only in MVP, reducing but not eliminating access-control requirements.
- The product should be easy to deploy and operate with minimal platform overhead.

### Cross-Cutting Concerns Identified

- Authentication and role-based authorization
- Data ownership boundaries between Admin and Tutor
- Relational modeling for Class-centered operations
- File storage and secure download access
- Generated image rendering for Monthly Reports
- Separation between public marketing pages and protected internal dashboards
- Future extensibility for deferred features such as Zalo intake parsing, payroll, and richer reporting

## Starter Template Evaluation

### Primary Technology Domain

The project is a full-stack web application built on the existing TPA-Education Next.js repository.

The existing repository already provides:

- Next.js App Router structure under `app/`
- TypeScript configuration
- Tailwind CSS styling
- shadcn/ui + Radix UI component inventory
- Vercel project linkage
- Existing public marketing site

### Starter Options Considered

#### Option 1: Create a new Next.js app with `create-next-app`

The official Next.js starter remains valid for greenfield projects. It supports TypeScript, Tailwind CSS, and App Router configuration. However, this project already has those foundations in place.

**Rejected because:**
- It would duplicate existing setup.
- It would require moving current public-site code.
- It adds migration risk with little MVP benefit.

#### Option 2: Use a third-party admin dashboard starter

A dashboard starter could provide tables, sidebar layout, and CRUD screens faster. However, the current repo already includes a broad shadcn/ui component library and the MVP domain model is custom.

**Rejected because:**
- It may introduce unwanted architecture decisions.
- It may conflict with existing visual system.
- It may slow integration with current public marketing site.

#### Option 3: Extend the existing Next.js app

The current repository becomes the foundation. Protected internal routes are added alongside the public landing page.

**Selected.**

### Selected Starter: Existing Next.js App Router Repository

**Rationale for Selection:**
The fastest, lowest-risk path is to preserve the current public marketing site and add an internal protected dashboard within the same Next.js application. This keeps deployment simple on Vercel and lets the implementation reuse existing Tailwind, shadcn/ui, and component patterns.

### Architectural Decisions Provided by Existing Foundation

**Language & Runtime:**
- TypeScript
- React 19
- Next.js App Router

**Styling Solution:**
- Tailwind CSS
- CSS variables in `app/globals.css`
- shadcn/ui component conventions

**Build Tooling:**
- Next.js build on Vercel
- Existing `npm run build`, `npm run dev`, `npm run start`

**Code Organization:**
- `app/` for routes and layouts
- `components/` for feature and shared components
- `components/ui/` for UI primitives
- `lib/` for utilities and data access modules

**Development Experience:**
- Continue current Next.js development workflow.
- Add Supabase integration incrementally.
- Add protected route groups for Admin and Tutor dashboards.

### Implementation Note

Project initialization is not needed. The first implementation story should instead add Supabase packages/configuration and protected route structure to the existing app.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Backend platform: Supabase.
2. Hosting/deployment: Vercel.
3. Auth/session: Supabase Auth with `@supabase/ssr`.
4. Authorization: database role model plus Supabase RLS.
5. Data model: relational Postgres centered on `Class`.
6. Teaching Material storage: private Cloudflare R2 objects + catalog metadata in Postgres; generated Monthly Report storage remains optional.
7. Protected app structure: Next.js route groups for public, auth, and dashboard surfaces.

**Important Decisions (Shape Architecture):**
1. Server access pattern: Server Components and Server Actions for privileged operations.
2. Client access pattern: browser Supabase client only for user-scoped reads where RLS protects data.
3. Report image generation: browser-side export/screenshot from a React template for MVP.
4. Tutor password setup: system generates a random initial password for Admin to copy and provide manually.
5. Teaching Material fulfillment: multiple files may be attached to each Material Request.
6. Admin account model: single bootstrap Admin in Supabase Auth plus role table, not `.env` password auth long-term.
7. Form validation: shared schema validation with Zod.
8. UI architecture: shadcn/ui primitives plus feature-specific components.

**Deferred Decisions (Post-MVP):**
1. Zalo parsing intake.
2. Parent/student portal.
3. Multi-admin.
4. Automatic report sending.
5. Payroll/attendance.
6. Rich teaching-material preview/editor.
7. Server-side report image rendering, unless browser export proves unreliable.

### Data Architecture

**Decision:** Use Supabase Postgres as the relational database.

**Rationale:** The MVP data is strongly relational: Tutors, Students, Parents, Classes, Schedules, Material Requests, Teaching Materials, and Monthly Reports. Supabase provides Postgres, Auth, Storage, and RLS in one platform, matching the MVP need for fast delivery and low operations overhead.

**Core tables:**
- `profiles`
- `tutors`
- `students`
- `parents`
- `student_parents`
- `subjects`
- `classes`
- `class_schedules`
- `class_requests`
- `schedule_proposals`
- `material_requests`
- `teaching_material_library_items`
- `teaching_materials`
- `teaching_material_library_files`
- `monthly_reports`

**Migration approach:** SQL migrations managed in the repo.

**Validation approach:** Zod schemas at form/server action boundaries; database constraints for required relational integrity.

**Caching approach:** No custom cache in MVP. Use standard Next.js/Supabase fetching, with mutation-triggered revalidation where needed.

### Authentication & Security

**Decision:** Use Supabase Auth with email/password and `@supabase/ssr` session handling.

**Authorization pattern:** Store role and profile metadata in DB (`profiles.role = 'admin' | 'tutor'`) and enforce data boundaries with Supabase RLS policies.

**Admin model:** MVP supports one Admin. `.env` may provide bootstrap identity such as `BOOTSTRAP_ADMIN_EMAIL`, but ongoing Admin access must be represented in Supabase Auth and the role table rather than `.env` password logic.

**Tutor account creation:** Admin creates Tutor accounts through a server-only action. The system generates a random initial password for Admin to copy and send manually.

**Service role key rule:** `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side and never exposed to browser code.

**RLS direction:**
- Admin can access and manage all MVP data.
- Tutor can access only assigned Classes and related Schedules.
- Tutor can access only their own Material Requests, Teaching Materials, and Monthly Reports.

### API & Communication Patterns

**Decision:** Use Next.js Server Actions and Route Handlers rather than a separate external REST backend for MVP.

**Rationale:** The app is a single Next.js deployment. Server Actions and Route Handlers keep mutation logic close to UI flows while allowing privileged server-side Supabase operations.

**Server-side operations:**
- Create Tutor Auth user and profile.
- Create/update Classes and Schedules.
- Upload Teaching Materials.
- Create/update Material Requests.
- Create/update Monthly Report records.
- Produce signed download URLs where needed.

**Client-side operations:**
- Read user-scoped data where RLS fully protects access.
- Run local report template export for browser-side image generation.

**Error handling:** Use typed action results: `{ ok: true, data } | { ok: false, error }`.

### Frontend Architecture

**Decision:** Add protected dashboards into the existing Next.js App Router project.

**Route structure:**

```txt
app/
  page.tsx
  login/
    page.tsx
  dashboard/
    layout.tsx
    admin/
      page.tsx
      tutors/
      students/
      parents/
      classes/
      material-requests/
      reports/
    tutor/
      page.tsx
      classes/
      material-requests/
      reports/
```

**Component structure:**

```txt
components/
  dashboard/
  admin/
  tutor/
  reports/
  materials/
  ui/
lib/
  supabase/
  db/
  auth/
  actions/
  validations/
  reports/
```

**State management:** Server-fetched data by default. Local state for forms, modals, and client-side report export. No Redux/Zustand in MVP.

**Report generation:** Browser-side export/screenshot from a React report template. The generated image is downloaded by the Tutor and may optionally be uploaded/stored as a Monthly Report artifact.

### File Storage

**Decision:** Use Supabase Storage.

**Buckets:**
- Teaching Materials are stored in private Cloudflare R2, not in Supabase Storage.
- `monthly-reports` for generated report images if persisted.

**Access pattern:** Buckets private by default. Downloads use signed URLs or authenticated access checks. Multiple R2-backed files may be attached to one Material Request or Library item.

### Infrastructure & Deployment

**Decision:** Deploy the Next.js app to Vercel and use hosted Supabase for Auth, Postgres, and Storage.

**Environment variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BOOTSTRAP_ADMIN_EMAIL`

**Free-tier assessment:** Free tiers are acceptable for MVP development and internal testing. For real production operation, Supabase Pro is likely the first upgrade pressure because of database/storage limits and free project pause behavior. Vercel Hobby can work technically for low usage, but Vercel plan terms and production/commercial usage should be reviewed before live operation.

### Decision Impact Analysis

**Implementation Sequence:**
1. Add Supabase client/server setup and env validation.
2. Add auth/session middleware and login flow.
3. Create database schema and RLS policies.
4. Add Admin dashboard layout and Tutor account creation.
5. Add Class/Student/Parent/Schedule management.
6. Add Open Class browsing and Class Request approval flow.
7. Removed: Schedule Proposal flow; Tutors self-coordinate with parents outside the app.
8. Add Tutor dashboard and assigned Class views.
9. Add Teaching Material Library.
10. Add Material Request workflow and file uploads.
11. Add Monthly Report template and browser-side image export.

**Cross-Component Dependencies:**
- Tutor dashboard depends on Auth, profile roles, Tutor profile mapping, and RLS.
- Class management depends on Student, Parent, Tutor, Subject, and Schedule tables.
- Material Requests depend on Tutor identity and optional Class linkage.
- Monthly Reports depend on assigned Class access, Tuition Fee, report template, and optional Storage persistence.
- File download security depends on Storage bucket privacy and signed URL policy.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
The project has 10 major consistency areas where AI agents could otherwise make incompatible choices: database naming, component naming, action return shape, Supabase client placement, RLS management, date serialization, validation schema placement, multi-file storage modeling, report image handling, and error formatting.

### Naming Patterns

**Database Naming Conventions:**
- Tables use `snake_case`, plural nouns.
- Columns use `snake_case`.
- Foreign keys use `{entity}_id`.
- Join tables use both entity names in `snake_case`.

**Examples:**
- Good: `class_schedules`, `material_requests`, `teaching_materials`, `teaching_material_library_files`
- Good: `tutor_id`, `student_id`, `class_id`
- Avoid: `ClassSchedules`, `materialRequestId`, `fkTutor`

**API / Server Action Naming Conventions:**
- Server Actions use verb-first camelCase names.
- Action files are grouped by domain under `lib/actions/`.

**Examples:**
- `createTutorAccount`
- `updateClass`
- `createMaterialRequest`
- `uploadTeachingMaterial`
- `generateMonthlyReportRecord`

**Code Naming Conventions:**
- React component exports use PascalCase.
- Reusable component files use PascalCase or existing project convention if already established.
- Route files follow Next.js conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- Domain utility files use kebab-case or lowercase domain names consistently.

### Structure Patterns

**Project Organization:**
- Route surfaces live in `app/`.
- Reusable dashboard components live in `components/dashboard/`.
- Admin-only components live in `components/admin/`.
- Tutor-only components live in `components/tutor/`.
- Report template/export code lives in `components/reports/` and `lib/reports/`.
- Supabase helpers live in `lib/supabase/`.
- Server Actions live in `lib/actions/`.
- Validation schemas live in `lib/validations/`.

**Required Supabase Client Files:**
- `lib/supabase/client.ts` ? browser client only.
- `lib/supabase/server.ts` ? SSR server client using `@supabase/ssr`.
- `lib/supabase/admin.ts` ? server-only service-role client for privileged actions.

**Rule:**
`lib/supabase/admin.ts` must never be imported by Client Components.

**Database / RLS Structure:**
- Schema and RLS live in `supabase/migrations/`.
- Policies are versioned with schema migrations.
- Do not create RLS policies only in Supabase dashboard.

### Format Patterns

**Server Action Result Format:**
All Server Actions return:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
```

**Examples:**
```ts
return { ok: true, data: tutor }
return { ok: false, error: "Email already exists." }
```

**Anti-patterns:**
```ts
return { success: true, tutor }
throw new Error("Show this to user")
return { error: { code: "X", message: "Y" } }
```

**Date Format:**
- Dates crossing client/server boundaries use ISO 8601 strings.
- Database uses Postgres `date`, `time`, and `timestamptz` types appropriately.
- UI converts ISO strings for display.

**JSON Field Format:**
- Database fields are `snake_case`.
- TypeScript variables and props are `camelCase`.
- Mapping is handled at query boundaries or via generated Supabase types.

### Data Modeling Patterns

**Multi-file Teaching Materials:**
- `material_requests` stores request metadata.
- `teaching_materials`
- `teaching_material_library_files` stores one row per uploaded file.
- Each `teaching_materials` row references `material_request_id`.

**Report Images:**
- MVP browser-generates report image from React template.
- Tutor downloads image manually.
- Persistence to `monthly_reports` bucket is optional; if implemented, record metadata in `monthly_reports`.

### Communication Patterns

**Auth / Role Checks:**
- UI route guards are not enough.
- Every privileged Server Action checks session + role.
- RLS enforces DB access boundaries.
- Admin operations requiring service role must stay server-only.

**Mutation Revalidation:**
- After mutations, revalidate the relevant dashboard path.
- Do not rely on full page refresh unless necessary.

**Signed URLs:**
- Teaching Material links should point to Cloudflare R2 files/folders with the correct sharing permissions; report images use signed URLs only if persisted in Supabase Storage.
- Do not expose public bucket URLs for private Teaching Materials.

### State Management Patterns

**Default Rule:**
- Server-fetched data by default.
- Local React state for forms, modals, selections, loading states, and browser report export.
- No Redux/Zustand in MVP unless a later feature creates real shared client-state pressure.

### Process Patterns

**Validation:**
- Zod schemas live in `lib/validations/`.
- Client validation is UX convenience.
- Server validation is source of truth.
- Database constraints are final integrity guard.

**Error Handling:**
- MVP user-facing errors are single strings.
- Server Actions return `{ ok: false, error }`.
- UI displays errors near the triggering form/action.
- Internal logs may contain more detail; user-facing error strings stay simple.

**Loading States:**
- Form submit buttons show pending state.
- Destructive actions require confirmation.
- Upload actions show progress when feasible; otherwise show pending state.

### Enforcement Guidelines

**All AI Agents MUST:**
- Use `snake_case` DB names and `camelCase` TS variables.
- Put Supabase clients in `lib/supabase/`.
- Put Server Actions in `lib/actions/`.
- Put Zod schemas in `lib/validations/`.
- Return typed `ActionResult<T>` from Server Actions.
- Keep service-role usage server-only.
- Implement RLS policies in migrations.
- Treat Admin as source of truth for Class data in MVP.
- Prevent Tutors from editing core Class data.
- Use one `teaching_materials` row per uploaded file.

**Pattern Enforcement:**
- Review imports for `lib/supabase/admin.ts` to ensure server-only usage.
- Review migrations for every table requiring RLS.
- Review actions for `ActionResult<T>` return shape.
- Review Tutor views/actions for ownership filtering.
- Review Storage access for signed/private URL handling.

### Pattern Examples

**Good Examples:**

```ts
// lib/actions/tutors.ts
export async function createTutorAccount(input: CreateTutorInput): Promise<ActionResult<Tutor>> {
  // role check, server validation, Supabase admin operation
}
```

```sql
create table class_schedules (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id),
  weekday smallint not null,
  start_time time not null,
  end_time time not null
);
```

**Anti-Patterns:**
- Creating Tutor Auth users from a Client Component.
- Using service-role key in browser code.
- Letting Tutor update `classes` directly.
- Storing multiple teaching material files as a JSON blob inside `material_requests`.
- Making Storage buckets public for private teaching files.
- Returning inconsistent action shapes across domains.

## Project Structure & Boundaries

### Complete Project Directory Structure

```txt
TPA-Education/
??? README.md
??? package.json
??? pnpm-lock.yaml
??? next.config.mjs
??? tailwind.config.ts
??? tsconfig.json
??? postcss.config.mjs
??? components.json
??? .env.local
??? .env.example
??? .gitignore
??? .vercelignore
??? vercel.json
??? .github/
?   ??? workflows/
?       ??? ci.yml
??? app/
?   ??? globals.css
?   ??? layout.tsx
?   ??? page.tsx
?   ??? login/
?   ?   ??? page.tsx
?   ??? dashboard/
?       ??? layout.tsx
?       ??? admin/
?       ?   ??? page.tsx
?       ?   ??? tutors/
?       ?   ??? students/
?       ?   ??? parents/
?       ?   ??? classes/
?       ?   ??? material-requests/
?       ?   ??? reports/
?       ??? tutor/
?           ??? page.tsx
?           ??? classes/
?           ??? material-requests/
?           ??? reports/
??? components/
?   ??? ui/
?   ??? dashboard/
?   ??? admin/
?   ??? tutor/
?   ??? reports/
??? lib/
?   ??? supabase/
?   ?   ??? client.ts
?   ?   ??? server.ts
?   ?   ??? admin.ts
?   ??? actions/
?   ?   ??? tutors.ts
?   ?   ??? students.ts
?   ?   ??? parents.ts
?   ?   ??? classes.ts
?   ?   ??? schedules.ts
?   ?   ??? material-requests.ts
?   ?   ??? teaching-materials.ts
?   ?   ??? reports.ts
?   ??? validations/
?   ?   ??? tutors.ts
?   ?   ??? students.ts
?   ?   ??? parents.ts
?   ?   ??? classes.ts
?   ?   ??? schedules.ts
?   ?   ??? material-requests.ts
?   ?   ??? reports.ts
?   ??? db/
?   ?   ??? types.ts
?   ?   ??? queries.ts
?   ??? auth/
?   ?   ??? session.ts
?   ?   ??? role.ts
?   ??? reports/
?   ?   ??? generator.ts
?   ?   ??? exporter.ts
?   ??? utils.ts
??? supabase/
?   ??? config.toml
?   ??? migrations/
?       ??? 20250101000000_init_schema.sql
?       ??? 20250101000001_create_profiles.sql
?       ??? 20250101000002_create_tutors.sql
?       ??? 20250101000003_create_students.sql
?       ??? 20250101000004_create_parents.sql
?       ??? 20250101000005_create_student_parents.sql
?       ??? 20250101000006_create_subjects.sql
?       ??? 20250101000007_create_classes.sql
?       ??? 20250101000008_create_class_schedules.sql
?       ??? 20250101000009_create_material_requests.sql
?       ??? 20250101000010_create_teaching_materials.sql
?       ??? 20250101000011_create_monthly_reports.sql
?       ??? 20250101000012_rls_policies.sql
??? types/
?   ??? index.ts
??? middleware.ts
??? public/
?   ??? logo.png
?   ??? assets/
??? tests/
    ??? unit/
    ??? integration/
    ??? e2e/
```

### Architectural Boundaries

**API Boundaries:**
- No external REST API in MVP. All mutations happen through Next.js Server Actions in `lib/actions/`.
- Browser client (`lib/supabase/client.ts`) is for Client Components and user-scoped reads protected by RLS.
- Server client (`lib/supabase/server.ts`) is for Server Components and Server Actions with session-aware queries.
- Admin client (`lib/supabase/admin.ts`) is server-only for privileged mutations such as Tutor account creation.

**Component Boundaries:**
- `components/ui/` contains reusable primitives. No business logic.
- `components/dashboard/` contains layout/navigation shared across Admin and Tutor.
- `components/admin/` contains Admin-specific forms and lists. Must never be imported by Tutor routes.
- `components/tutor/` contains Tutor-specific UI. Must never be imported by Admin routes.
- `components/reports/` contains report template and export logic shared by report surfaces.

**Service Boundaries:**
- Server Actions in `lib/actions/` are the only entry points for mutations.
- Each action file groups operations by domain.
- Actions return `ActionResult<T>`.
- All Server Actions check session and role before privileged operations.

**Data Boundaries:**
- Postgres is the source of truth.
- RLS policies enforce row-level access.
- Admin can access all rows.
- Tutor can access only rows related to their Tutor identity and assigned Classes.
- Supabase Storage buckets are private by default.

### Requirements to Structure Mapping

**Tutor management:**
- Routes: `app/dashboard/admin/tutors/`
- Components: `components/admin/TutorForm.tsx`, `components/admin/TutorList.tsx`
- Actions: `lib/actions/tutors.ts`
- Validation: `lib/validations/tutors.ts`
- DB: `profiles`, `tutors`

**Student management:**
- Routes: `app/dashboard/admin/students/`
- Components: `components/admin/StudentForm.tsx`, `components/admin/StudentList.tsx`
- Actions: `lib/actions/students.ts`
- Validation: `lib/validations/students.ts`
- DB: `students`

**Parent management:**
- Routes: `app/dashboard/admin/parents/`
- Components: `components/admin/ParentForm.tsx`, `components/admin/ParentList.tsx`
- Actions: `lib/actions/parents.ts`
- Validation: `lib/validations/parents.ts`
- DB: `parents`, `student_parents`

**Class and Schedule management:**
- Routes: `app/dashboard/admin/classes/`, `app/dashboard/tutor/classes/`
- Components: `components/admin/ClassForm.tsx`, `components/admin/ScheduleForm.tsx`, `components/tutor/ClassCard.tsx`
- Actions: `lib/actions/classes.ts`, `lib/actions/schedules.ts`
- Validation: `lib/validations/classes.ts`, `lib/validations/schedules.ts`
- DB: `classes`, `class_schedules`, `subjects`

**Material Requests and Teaching Materials:**
- Routes: `app/dashboard/tutor/material-requests/`, `app/dashboard/admin/material-requests/`
- Components: `components/tutor/MaterialRequestForm.tsx`, `components/admin/MaterialUploadForm.tsx`
- Actions: `lib/actions/material-requests.ts`, `lib/actions/teaching-materials.ts`
- Validation: `lib/validations/material-requests.ts`
- DB: `material_requests`, `teaching_materials`
- Storage: Cloudflare R2 link catalog

**Monthly Reports:**
- Routes: `app/dashboard/tutor/reports/`, `app/dashboard/admin/reports/`
- Components: `components/reports/MonthlyReportTemplate.tsx`, `components/reports/ReportExporter.tsx`, `components/reports/ReportPreview.tsx`
- Actions: `lib/actions/reports.ts`
- Validation: `lib/validations/reports.ts`
- DB: `monthly_reports`
- Storage: `monthly-reports` if persistence is implemented

### Integration Points

**Internal Communication:**
1. User submits form in Client Component.
2. Form calls Server Action from `lib/actions/`.
3. Server Action validates input with Zod schema from `lib/validations/`.
4. Server Action checks session and role via `lib/auth/`.
5. Server Action uses Supabase server or admin client.
6. RLS policies enforce row-level access.
7. Server Action returns `ActionResult<T>`.
8. Server Action calls `revalidatePath()` when needed.
9. UI displays success or error.

**External Integrations:**
- Supabase Auth for login/logout/session.
- Supabase Postgres for all CRUD operations.
- Supabase Storage for uploads/downloads.
- Vercel for app deployment and serverless execution.

### File Organization Patterns

**Configuration Files:**
- Root-level config for Next.js, TypeScript, Tailwind, PostCSS, shadcn/ui.
- `.env.local` stores local secrets.
- `.env.example` documents required variables.
- Supabase config lives in `supabase/config.toml`.

**Source Organization:**
- `app/` follows App Router file-system routing.
- `components/` grouped by role and shared UI concern.
- `lib/` contains server/client helper code, actions, validation, auth, and reports.
- `types/` contains app-level shared types.

**Database Organization:**
- `supabase/migrations/` contains timestamped SQL files.
- Schema and RLS are version-controlled.
- Policies are not manually maintained only in dashboard.

**Asset Organization:**
- `public/` stores static public assets only.
- User-uploaded files never go in `public/`.
- Teaching Materials and Monthly Report images go to Supabase Storage if persisted.

### Development Workflow Integration

**Development Server Structure:**
- Next.js dev server runs the app.
- Supabase local dev can be used, but hosted Supabase is acceptable for MVP.
- Middleware enforces auth on `/dashboard/*`.

**Build Process Structure:**
- Next.js builds routes, Server Actions, components, and styles.
- No separate backend build exists.
- TypeScript, linting, and schema generation should be part of validation before deployment.

**Deployment Structure:**
- Vercel deploys the Next.js app.
- Supabase migrations are applied before production deploys.
- Vercel env vars configure Supabase URL, anon key, service role key, and bootstrap Admin email.

### Security Boundaries

**Service Role Key Isolation:**
- `lib/supabase/admin.ts` must never be imported by Client Components.
- Only server-only modules may import admin client.
- Manual review or lint rule should enforce this.

**RLS Enforcement:**
- Every table containing user or operational data has RLS enabled.
- Tutor-facing reads must be scoped by RLS.
- Admin operations may use service role only after explicit Admin role verification.

**File Access Control:**
- Storage buckets are private.
- Signed URLs are generated server-side.
- No app-hosted Teaching Material files in MVP; Cloudflare R2 permissions control underlying document access.

## Architecture Update - Open Classes and Material Library

### Scope Delta

The PRD now includes three additional MVP capabilities:

1. Tutors can browse Open Classes and submit a Class Request.
2. Schedule Proposal workflow removed; Tutors coordinate schedule changes with parents outside the app.
3. Tutors can browse/download a Teaching Material Library published by Admin.

The PRD explicitly excludes 5% monthly center-fee tracking from app scope. The chatbot/AI lesson-prep assistant is deferred and should not be architected for MVP.

### Data Model Additions

Add the following tables to the architecture:

- `class_requests` ? Tutor requests to take Open Classes.
- `teaching_material_library_items` ? Admin-published library item metadata.
- `teaching_material_library_files` ? one row per file attached to a library item.

`classes` should support open/available state before assignment. Parent contact details should remain hidden from Tutors until the Class Request is approved and the Class is assigned.

### Authorization Additions

RLS must support:

- Tutors can view Open Classes with limited fields.
- Tutors can create Class Requests for Open Classes.
- Tutors can view their own Class Requests.
- Admin can view/approve/reject all Class Requests.
- Tutors can read active Teaching Material Library items and download files through authenticated access.
- Tutors cannot edit library items or official Class data.

### Route Structure Additions

```txt
app/dashboard/admin/class-requests/
app/dashboard/admin/schedule-proposals/
app/dashboard/admin/material-library/
app/dashboard/tutor/open-classes/
app/dashboard/tutor/class-requests/
app/dashboard/tutor/schedule-proposals/
app/dashboard/tutor/material-library/
```

### Action Additions

```txt
lib/actions/class-requests.ts
lib/actions/schedule-proposals.ts
lib/actions/material-library.ts
lib/validations/class-requests.ts
lib/validations/schedule-proposals.ts
lib/validations/material-library.ts
```

### Implementation Rule Updates

- Admin remains source of truth for official Class assignment and official Schedule.
- Tutor actions create requests/proposals, not direct Class/Schedule mutations.
- Open Class listings must not expose sensitive Parent contact data before assignment approval.
- 5% monthly center-fee policy must not be represented in MVP tables, reports, or dashboards.
- Chatbot/AI lesson-prep assistant must remain deferred until a later PRD/architecture update.

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:**
All core decisions remain coherent after the scope update. Next.js App Router on Vercel is compatible with Supabase Auth, Postgres, Storage, RLS, and `@supabase/ssr`. Open Class Requests fit the request/approval pattern already used for Teaching Material Requests. The 5% monthly center-fee policy is explicitly excluded from app scope, avoiding unnecessary finance-module complexity. The chatbot/AI lesson-prep assistant is deferred and does not affect MVP architecture.

**Pattern Consistency:**
The existing implementation patterns support the new scope. `class_requests`, `schedule_proposals`, `teaching_material_library_items`, and `teaching_material_library_files` follow the same `snake_case` table naming, Server Action, Zod validation, and RLS policy conventions. Tutors create requests/proposals; Admin approves official mutations.

**Structure Alignment:**
The structure supports all updated capabilities through additional route/action/validation modules for Open Classes, Class Requests, and Material Library. Admin and Tutor boundaries remain clear.

### Requirements Coverage Validation

**Feature Coverage:**
- Admin/Tutor auth: covered.
- Tutor management: covered.
- Student/Parent/Class/Schedule management: covered.
- Open Classes and Class Requests: covered by `class_requests`, open-state Classes, Tutor request routes, and Admin approval routes.
- Schedule Proposals: removed from MVP; no `schedule_proposals` table or approval workflow should be built.
- Teaching Material Library: covered by library item/file tables, Admin publish routes, Tutor browse/download routes, and private Storage.
- Teaching Material Requests: covered.
- Monthly Reports: covered.
- Chatbot/AI assistant: explicitly deferred.
- 5% monthly fee: explicitly excluded from app scope.

**Functional Requirements Coverage:**
All current PRD functional requirement categories have architectural support. The prior conflict around Tutor schedule editing is resolved by proposal/approval workflow.

**Non-Functional Requirements Coverage:**
Security and role isolation remain covered through Auth, DB roles, RLS, server-side role checks, private Storage, and signed URLs. Open Class listings add a new privacy requirement: Tutor-facing open listings must hide sensitive Parent contact data before approval.

### Implementation Readiness Validation

**Decision Completeness:**
Critical architecture decisions are complete. Newly added request/proposal/library patterns are consistent with existing request/approval and file-storage architecture.

**Structure Completeness:**
The document defines route, action, validation, table, and RLS additions for new scope. This is enough for implementation planning.

**Pattern Completeness:**
Naming, action return shape, validation, RLS, file storage, report generation, and role boundaries are sufficiently specified for AI agents to implement consistently.

### Gap Analysis Results

**Critical Gaps:**
None.

**Important Gaps:**
- Exact status vocabulary needs finalization for Classes/Open Classes, Class Requests, and Material Requests.
- Exact Open Class fields visible before approval need finalization.
- Monthly Report template field order/layout remains flexible pending implementation.

**Minor Gaps:**
- Exact browser image export library not selected.
- Exact testing framework not selected.
- Material Library search/filter can start simple and improve later.

### Validation Issues Addressed

- Tutor schedule ownership conflict resolved: Tutor proposes, Admin approves.
- Open Class assignment risk resolved: Tutor requests, Admin approves; no direct self-claim.
- Fee policy risk resolved: 5% center fee excluded from the app.
- AI complexity risk resolved: chatbot deferred out of MVP architecture.

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** high

**Key Strengths:**
- Extends existing Next.js app instead of restarting.
- Uses Supabase to keep auth, database, storage, and RLS together.
- Preserves Admin as source of truth through request/proposal approval workflows.
- Keeps Tutor-facing scope practical and safe.
- Excludes finance fee tracking and AI chatbot from MVP, reducing scope risk.

**Areas for Future Enhancement:**
- Chatbot / AI lesson-prep assistant.
- Server-side report image generation if browser export is unreliable.
- Parent/Student portal.
- Multi-admin.
- Attendance, payroll, and lesson logs.
- Zalo intake parser.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented.
- Use request/proposal patterns for Tutor-initiated changes.
- Do not let Tutors directly assign Classes or mutate official Schedules.
- Hide Parent contact data in Open Class listings until assignment approval.
- Do not implement 5% monthly fee tracking.
- Do not implement chatbot/AI assistant in MVP.
- Never expose service-role key to browser code.
- Use RLS for Tutor data isolation.

**First Implementation Priority:**
Add Supabase setup, environment validation, protected auth/session structure, and initial schema/RLS migrations before building CRUD UI.

## Architecture Completion & Handoff

### Completion Summary

Architecture workflow completed for TPA-Education Internal Tutor and Class Management MVP.

Together we defined:

- Existing Next.js app extension strategy.
- Supabase + Vercel platform architecture.
- Supabase Auth + `@supabase/ssr` session model.
- Database role model plus RLS authorization.
- Class-centered relational data model.
- Open Class request/approval flow.
- Schedule proposal/approval flow.
- Teaching Material Library and Material Request workflows.
- Monthly Report image generation workflow.
- Protected route structure for Admin and Tutor dashboards.
- Server Action, validation, naming, file storage, and security consistency rules.
- Scope exclusions for 5% monthly fee tracking and chatbot/AI assistant.

### Final Implementation Guidance

**First build slice:**
1. Add Supabase dependencies and environment validation.
2. Create Supabase client files: `client.ts`, `server.ts`, `admin.ts`.
3. Add middleware/session handling for protected dashboard routes.
4. Create initial schema and RLS migrations.
5. Implement Admin/Tutor role checks.
6. Build login + dashboard shell.

**Recommended next BMad workflow:**
- `bmad-create-epics-and-stories` to break this architecture and PRD into implementable stories.

### Architecture Status

Status: complete and ready for implementation planning.


## Architecture Update - Cloudflare R2 Teaching Material Storage

### Decision Change

Teaching Materials will be stored in Cloudflare R2, not Supabase Storage. The web app becomes the catalog, access surface, and workflow tracker for those documents.

### Updated Storage Model

- Cloudflare R2 is the source of truth for PDF/Word teaching documents.
- Postgres stores metadata: title, subject, grade, description, Drive URL, optional Drive file/folder id, visibility/status, request/library relationship, and timestamps.
- Supabase Storage is not used for Teaching Materials in MVP.
- Supabase Storage may still be used later for generated Monthly Report images if persistence is desired.

### Updated Implementation Rules

- Admin publishes Teaching Material Library items by adding Cloudflare R2 file/folder links.
- Admin fulfills Material Requests by attaching one or more Cloudflare R2 links.
- Tutor views/open links from the web app.
- The app must not assume a Drive link is private just because it is hidden in the UI; Cloudflare R2 sharing permissions must be set correctly.
- MVP does not need Cloudflare R2 API integration unless automatic file listing/permission management becomes required later.

### Deferred Cloudflare R2 Enhancements

- Cloudflare R2 OAuth integration.
- Automatic Drive folder sync.
- Automatic permission provisioning per Tutor.
- In-app document preview/editor.
