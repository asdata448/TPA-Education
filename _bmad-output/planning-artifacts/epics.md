---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-TPA-Education-2026-06-08/prd.md"
  - "_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md"
---

# TPA-Education - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for TPA-Education, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Admin can log in with email and password to access the internal management interface.
FR-2: Tutor can log in with email and password created by Admin.
FR-3: System restricts feature and data access by role.
FR-4: Admin can create Tutor accounts with profile information, email, and generated initial password.
FR-5: Admin can view and update Tutor profile information and account status.
FR-6: Admin can create and edit Student records used by Classes.
FR-7: Admin can create and edit Parent records linked to Students and Classes.
FR-8: Admin can create Classes with subject, grade, Student, Parent, Tutor/open status, learning mode, start date, schedule, tuition fee, tutor pay, notes, and status.
FR-9: Admin can update Class details after creation.
FR-10: Admin can set and update Class status values for operational tracking.
FR-11: Admin can create and update one or more weekly Schedule entries for a Class.
FR-12: Tutor can view weekly Schedule information for assigned Classes only.
FR-13: Tutor can see a list of assigned Classes.
FR-14: Tutor can view details of an assigned Class, including Student, Parent, subject, status, Schedule, Tuition Fee, and teaching notes.
FR-15: Tutor can view Classes marked open and available for Tutor requests.
FR-16: Tutor can submit a Class Request for an Open Class.
FR-17: Admin can approve or reject a Class Request; approval assigns the Class to the Tutor.
FR-20: Admin can publish Teaching Material Library items with title, subject, grade, description, and one or more files stored in Cloudflare R2.
FR-21: Tutor can browse and download active Teaching Material Library items.
FR-22: Tutor can submit a document feedback item to request materials or report incorrect/missing/broken materials, optionally linked to a specific library item or Class.
FR-23: Admin can review document feedback items and resolve each item by marking it done or rejected.
FR-24: Tutor can view Admin resolution results directly in their feedback history, including admin notes or rejection reasons.
FR-25: Tutor can create a Monthly Report draft for an assigned Class and reporting month.
FR-26: Tutor can enter required monthly progress and student evaluation information into a structured report form.
FR-27: System can generate a branded Monthly Report image from report data and template.
FR-28: Tutor can download the generated Monthly Report image for manual sharing.

### NonFunctional Requirements

NFR-1: Security - protect Student data, Parent contact information, Tuition Fee, Tutor Pay, Teaching Materials, and Monthly Reports.
NFR-2: Authorization - Tutors must access only assigned Classes, own requests/proposals/reports, and permitted Open Class/Library data.
NFR-3: Privacy - Open Class listings must hide sensitive Parent contact details until Admin approves assignment.
NFR-4: Operational simplicity - MVP should use one Next.js app deployed on Vercel with Supabase for Auth, Postgres, Storage, and RLS.
NFR-5: Data integrity - database constraints and RLS policies must prevent invalid ownership, duplicate active Class Requests, and unauthorized mutations.
NFR-6: Storage security - Teaching Materials and persisted report images must use private Supabase Storage and signed/authenticated downloads.
NFR-7: Maintainability - implementation must follow documented naming, structure, validation, Server Action, and Supabase client patterns.
NFR-8: Report usability - Monthly Report output must be an image suitable for Tutor manual sharing with parents.
NFR-9: Scope control - chatbot/AI assistant, 5% fee tracking, payroll, parent/student portal, and Zalo parsing are not MVP features.
NFR-10: Deployment readiness - env vars, Supabase migrations, and RLS policies must be versioned/documented before production deployment.

### Additional Requirements

- Extend existing Next.js App Router app; do not create a new app.
- Use Supabase Auth with `@supabase/ssr` for sessions.
- Use Supabase Postgres with SQL migrations in `supabase/migrations/`.
- Use Supabase RLS for Admin/Tutor row-level authorization.
- Use private Cloudflare R2 for Teaching Materials; store R2 object metadata/keys in Postgres. Supabase Storage remains optional only for report images.
- Use Next.js Server Actions for mutations, not a separate REST backend.
- Keep service-role client in `lib/supabase/admin.ts` server-only.
- Use browser client in `lib/supabase/client.ts` and server client in `lib/supabase/server.ts`.
- Use `ActionResult<T> = { ok: true; data: T } | { ok: false; error: string }` for Server Actions.
- Use Zod schemas in `lib/validations/`.
- Use `snake_case` DB naming and `camelCase` TypeScript variables.
- Add tables: `profiles`, `tutors`, `students`, `parents`, `student_parents`, `subjects`, `classes`, `class_schedules`, `class_requests`, `schedule_proposals`, `document_feedback`, `teaching_material_library_items`, `teaching_material_library_files`, `monthly_reports`.
- Add protected routes under `app/dashboard/admin/` and `app/dashboard/tutor/`.
- Admin remains official source of truth for Class assignment and official Schedule.
- Tutor-initiated changes use request/proposal workflows, not direct mutation of official Class/Schedule data.
- Report image generation is browser-side from a React template for MVP.
- Vercel deploys app; Supabase provides backend services.

### UX Design Requirements

No UX Design document found. UX requirements inferred from PRD/architecture only:
UX-DR1: Provide role-specific Admin and Tutor dashboard navigation.
UX-DR2: Provide clear form flows for Tutor, Student, Parent, Class, Schedule, Open Class Request, Document Feedback submission, Library item, and Monthly Report creation.
UX-DR3: Tutor-facing Open Class list must clearly show available safe fields while hiding sensitive Parent contact data.
UX-DR4: Monthly Report flow must provide preview and image download.
UX-DR5: File upload/download UI must support multiple files for Teaching Material Library items, while document feedback remains a lightweight text-first workflow.
UX-DR6: Forms must show user-facing errors from typed Server Action results.

### FR Coverage Map

Epic 1: Authentication and Authorization Foundation ? FR-1, FR-2, FR-3
Epic 2: Tutor Account Management ? FR-4, FR-5
Epic 3: Student and Parent Management ? FR-6, FR-7
Epic 4: Class and Schedule Management ? FR-8, FR-9, FR-10, FR-11
Epic 5: Tutor Class Workspace ? FR-12, FR-13, FR-14
Epic 6: Open Class Request Workflow ? FR-15, FR-16, FR-17
Epic 7: Removed - Tutor self-schedules with parent outside app
Epic 8: Teaching Material Library ? FR-20, FR-21
Epic 9: Document Feedback and Resolution Workflow ? FR-22, FR-23, FR-24
Epic 10: Monthly Report Generation ? FR-25, FR-26, FR-27, FR-28

## Epic List

1. **Authentication and Authorization Foundation** ? Establish secure authentication and role-based authorization for Admin and Tutor users.
2. **Tutor Account Management** ? Enable Admin to create and manage Tutor accounts and profiles.
3. **Student and Parent Management** ? Enable Admin to create and manage Student and Parent records used by Classes.
4. **Class and Schedule Management** ? Enable Admin to create, update, and manage Classes with schedules, status, and assignment tracking.
5. **Tutor Class Workspace** ? Provide Tutors with read-only access to assigned Classes, schedules, and student information.
6. **Open Class Request Workflow** ? Enable Tutors to browse and request Open Classes, with Admin approval assigning Classes.
7. **Removed: Schedule Proposal Workflow** ? Tutor self-schedules with parent outside the app; no Admin approval workflow needed.
8. **Teaching Material Library** ? Enable Admin to publish teaching materials and Tutors to browse and download active items.
9. **Document Feedback and Resolution Workflow** ? Enable Tutors to request materials or report material issues, and let Admin resolve each item with Tutor feedback history results.
10. **Monthly Report Generation** ? Enable Tutors to create structured monthly reports and generate branded downloadable images.


## Epic 1: Authentication and Authorization Foundation

Establish secure Supabase Auth, session handling, protected dashboard routes, and role-based access for Admin and Tutor users.

### Story 1.1: Configure Supabase Clients and Environment

As a developer,
I want Supabase environment variables and client helpers configured,
So that future auth and data stories can use one consistent integration pattern.

**Acceptance Criteria:**

**Given** the existing Next.js app
**When** the Supabase setup is added
**Then** `lib/supabase/client.ts`, `lib/supabase/server.ts`, and `lib/supabase/admin.ts` exist
**And** `admin.ts` is server-only and never imported by Client Components
**And** required env vars are documented in `.env.example`
**And** missing required env vars fail with a clear developer-facing error.

### Story 1.2: Create Profiles Schema and Role Model

As an Admin/Tutor system,
I want a profile and role data model,
So that the app can distinguish Admin and Tutor permissions.

**Acceptance Criteria:**

**Given** Supabase migrations are used
**When** the profiles migration is applied
**Then** `profiles` table exists with auth user id, role, full name, active status, and timestamps
**And** role values are constrained to `admin` or `tutor`
**And** RLS is enabled on `profiles`
**And** Admin/Tutor profile reads follow documented authorization rules.

### Story 1.3: Implement Login and Session Middleware

As an Admin or Tutor,
I want to log in with email/password,
So that I can access my protected dashboard.

**Acceptance Criteria:**

**Given** a valid Supabase Auth user exists
**When** the user logs in from `/login`
**Then** the app creates a valid session
**And** redirects Admin users to `/dashboard/admin`
**And** redirects Tutor users to `/dashboard/tutor`
**And** invalid credentials show a user-facing error string.

### Story 1.4: Protect Dashboard Routes by Role

As the system,
I want dashboard routes protected by role,
So that users cannot access unauthorized pages.

**Acceptance Criteria:**

**Given** an unauthenticated visitor opens `/dashboard/*`
**When** middleware runs
**Then** the visitor is redirected to `/login`
**And** a Tutor opening `/dashboard/admin/*` is blocked or redirected
**And** an Admin opening `/dashboard/tutor/*` is handled according to role navigation rules
**And** role checks are server-side, not UI-only.

## Epic 2: Tutor Account Management

Enable Admin to create and manage Tutor accounts and profiles.

### Story 2.1: Create Tutor Database Model

As an Admin,
I want Tutor profile data stored separately from auth identity,
So that Tutor operational details can be managed safely.

**Acceptance Criteria:**

**Given** the profile schema exists
**When** Tutor migrations are applied
**Then** `tutors` table exists and links to `profiles`
**And** Tutor records include profile id, contact fields, specialties/notes, active status, and timestamps
**And** RLS prevents Tutors from editing their own system-managed profile fields unless explicitly allowed.

### Story 2.2: Admin Creates Tutor Account with Generated Password

As an Admin,
I want to create a Tutor account with a generated initial password,
So that I can onboard Tutors without exposing account creation to the public.

**Acceptance Criteria:**

**Given** Admin is authenticated
**When** Admin submits valid Tutor account details
**Then** a Supabase Auth user is created server-side
**And** a `profiles` row with role `tutor` is created
**And** a `tutors` row is created
**And** the generated password is shown once for Admin to copy
**And** duplicate Tutor emails are rejected with a user-facing error.

### Story 2.3: Admin Views and Edits Tutor Profiles

As an Admin,
I want to view and edit Tutor profiles,
So that Tutor information stays current.

**Acceptance Criteria:**

**Given** at least one Tutor exists
**When** Admin opens the Tutor list
**Then** Tutors are listed with key profile fields and active status
**And** Admin can open a Tutor detail page
**And** Admin can update editable Tutor profile fields
**And** inactive Tutors cannot log in or access Tutor dashboard.

## Epic 3: Student and Parent Management

Enable Admin to create and manage Student and Parent records used by Classes.

### Story 3.1: Create Student Records

As an Admin,
I want to create Student records,
So that Classes can be linked to learners.

**Acceptance Criteria:**

**Given** Admin is authenticated
**When** Admin submits valid Student details
**Then** a `students` row is created
**And** Student full name is required
**And** grade/class level can be recorded
**And** invalid submissions return field-level or form-level errors.

### Story 3.2: Create Parent Records

As an Admin,
I want to create Parent records,
So that Classes can reference parent/guardian contacts.

**Acceptance Criteria:**

**Given** Admin is authenticated
**When** Admin submits valid Parent details
**Then** a `parents` row is created
**And** Parent name and phone can be stored
**And** invalid submissions return user-facing errors.

### Story 3.3: Link Students and Parents

As an Admin,
I want to link Students and Parents,
So that each Class can expose correct guardian context.

**Acceptance Criteria:**

**Given** a Student and Parent exist
**When** Admin links them
**Then** a `student_parents` relation is created
**And** duplicate links are prevented
**And** linked Parents appear on the Student detail page.

## Epic 4: Class and Schedule Management

Enable Admin to create, update, and manage Classes with schedules, status, and assignment tracking.

### Story 4.1: Create Class and Subject Schema

As the system,
I want Class, Subject, and Schedule tables,
So that tutoring engagements can be represented consistently.

**Acceptance Criteria:**

**Given** migrations are applied
**When** the schema update completes
**Then** `subjects`, `classes`, and `class_schedules` tables exist
**And** `classes` can store subject, Student, Parent, Tutor assignment/open status, mode, start date, tuition fee, tutor pay, notes, and status
**And** RLS is enabled on Class-related tables.

### Story 4.2: Admin Creates a Class

As an Admin,
I want to create a Class,
So that a tutoring engagement becomes trackable.

**Acceptance Criteria:**

**Given** Student, Parent, Subject, and optional Tutor records exist
**When** Admin submits valid Class details
**Then** a Class record is created
**And** required fields are validated
**And** the Class can be assigned to a Tutor or marked open/unassigned
**And** Tuition Fee and Tutor Pay are stored per Class.

### Story 4.3: Admin Updates Class Details and Status

As an Admin,
I want to update Class details and status,
So that operational changes are reflected in the system.

**Acceptance Criteria:**

**Given** a Class exists
**When** Admin updates assignment, fee, notes, mode, or status
**Then** changes are saved
**And** assigned Tutor views reflect updated data
**And** status values are constrained to approved vocabulary.

### Story 4.4: Admin Manages Official Weekly Schedules

As an Admin,
I want to create and update official weekly Schedules,
So that each Class has accurate recurring times.

**Acceptance Criteria:**

**Given** a Class exists
**When** Admin adds weekly schedule entries
**Then** `class_schedules` rows are created with weekday, start time, and end time
**And** multiple entries per Class are supported
**And** updates are visible in assigned Tutor views.

## Epic 5: Tutor Class Workspace

Provide Tutors with read-only access to assigned Classes, schedules, and student information.

### Story 5.1: Tutor Views Assigned Classes

As a Tutor,
I want to view my assigned Classes,
So that I know my teaching responsibilities.

**Acceptance Criteria:**

**Given** Tutor is authenticated
**When** Tutor opens `/dashboard/tutor/classes`
**Then** only Classes assigned to that Tutor are shown
**And** Classes assigned to other Tutors are hidden
**And** each Class card includes subject, student, status, and schedule summary.

### Story 5.2: Tutor Views Assigned Class Detail

As a Tutor,
I want to view details of an assigned Class,
So that I can prepare and communicate correctly.

**Acceptance Criteria:**

**Given** Tutor owns an assigned Class
**When** Tutor opens the Class detail page
**Then** Student, Parent contact, subject, schedule, Tuition Fee, and notes are visible
**And** Tutor cannot edit core Class fields
**And** unauthorized Class ids return not found or access denied.

## Epic 6: Open Class Request Workflow

Enable Tutors to browse and request Open Classes, with Admin approval assigning Classes.

### Story 6.1: Tutor Browses Open Classes

As a Tutor,
I want to browse Open Classes,
So that I can find teaching opportunities.

**Acceptance Criteria:**

**Given** Classes exist with open/available status
**When** Tutor opens `/dashboard/tutor/open-classes`
**Then** available Open Classes are listed
**And** subject, grade, mode, fee, schedule notes, and requirements are visible
**And** sensitive Parent contact details are hidden.

### Story 6.2: Tutor Requests an Open Class

As a Tutor,
I want to request an Open Class,
So that Admin can consider assigning it to me.

**Acceptance Criteria:**

**Given** Tutor views an Open Class
**When** Tutor submits a Class Request
**Then** a `class_requests` row is created with pending status
**And** duplicate active requests for the same Tutor/Class are prevented
**And** the Class is not assigned until Admin approval.

### Story 6.3: Admin Reviews Class Requests

As an Admin,
I want to approve or reject Class Requests,
So that Class assignment remains controlled by the center.

**Acceptance Criteria:**

**Given** a pending Class Request exists
**When** Admin approves it
**Then** the Class is assigned to the requesting Tutor
**And** the Class is removed from Open Classes
**And** other pending requests for that Class are handled safely
**And** rejection leaves the Class open unless Admin changes it.

## Epic 7: Removed - Schedule Proposal Workflow

This epic is intentionally removed from current scope. Tutors coordinate schedule changes directly with parents outside the app. The system should not build Tutor schedule proposal creation or Admin approval for schedule changes.

## Epic 8: Teaching Material Library

Enable Admin to publish teaching materials and Tutors to browse and download active items.

### Story 8.1: Admin Creates Library Item with Files

As an Admin,
I want to publish Teaching Material Library items,
So that Tutors can reuse center-approved materials.

**Acceptance Criteria:**

**Given** Admin is authenticated
**When** Admin creates a library item with title, subject, grade, description, and files
**Then** `teaching_material_library_items` and file rows are created
**And** multiple R2-backed files are supported
**And** R2 object keys and metadata are stored in Postgres.

### Story 8.2: Tutor Browses and Downloads Library Items

As a Tutor,
I want to browse and download active library materials,
So that I can prepare lessons efficiently.

**Acceptance Criteria:**

**Given** active library items exist
**When** Tutor opens the Material Library
**Then** active items are listed
**And** inactive items are hidden
**And** Tutor can access authorized R2-backed files from the web catalog
**And** Tutor cannot edit library items.

## Epic 9: Document Feedback and Resolution Workflow

Enable Tutors to send lightweight document-related requests or issue reports, and let Admin resolve them with explicit outcomes and Tutor feedback history results.

### Story 9.1: Tutor Submits Document Feedback

As a Tutor,
I want to submit a document feedback item,
So that Admin knows when I need materials or when a document has a problem.

**Acceptance Criteria:**

**Given** Tutor is authenticated
**When** Tutor submits a material request message from `/dashboard/tutor/document-feedback` or a library issue report from a material card
**Then** a `document_feedback` row is created with `pending` status
**And** the feedback is linked to the submitting Tutor only
**And** the feedback is stored as either `material_request` or `material_report` based on the entry point.

### Story 9.2: Admin Resolves Document Feedback

As an Admin,
I want to review and resolve document feedback items,
So that Tutor requests and document issues are handled with a clear final decision.

**Acceptance Criteria:**

**Given** a pending document feedback item exists
**When** Admin opens the item
**Then** Admin can mark it `done` when the issue has been handled
**And** Admin can mark it `rejected` only after entering a rejection reason
**And** the system stores `handled_by`, `handled_at`, final status, and any admin note or rejection reason.

### Story 9.3: Tutor Views Feedback Resolution History

As a Tutor,
I want to see Admin resolution results in my feedback history,
So that I know whether my request/report was completed or rejected.

**Acceptance Criteria:**

**Given** Tutor owns a document feedback item
**When** Admin marks the item `done`
**Then** the Tutor feedback history shows that the feedback has been handled
**And** any admin note is visible on the related feedback item.

**Given** Tutor owns a document feedback item
**When** Admin marks the item `rejected`
**Then** the Tutor feedback history shows that the feedback was rejected
**And** the rejection reason is visible on the related feedback item
**And** Tutor cannot view another Tutor's feedback history.

## Epic 10: Monthly Report Generation

Enable Tutors to create structured monthly reports and generate branded downloadable images.

### Story 10.1: Create Monthly Report Draft

As a Tutor,
I want to create a Monthly Report draft for an assigned Class,
So that I can prepare parent-facing progress updates.

**Acceptance Criteria:**

**Given** Tutor has an assigned Class
**When** Tutor starts a report for a reporting month
**Then** a draft Monthly Report is created for that Class/month
**And** duplicate final reports for the same Class/month are prevented
**And** Tutor cannot create reports for unassigned Classes.

### Story 10.2: Fill Monthly Progress and Evaluation Form

As a Tutor,
I want to fill report fields for student progress and evaluation,
So that the generated report contains meaningful parent-facing information.

**Acceptance Criteria:**

**Given** a draft report exists
**When** Tutor enters progress, evaluation, notes, and related fields
**Then** the report data is saved
**And** Tuition Fee is pulled from the linked Class
**And** validation prevents missing required report fields.

### Story 10.3: Generate and Download Branded Report Image

As a Tutor,
I want to generate and download a branded report image,
So that I can send it manually to the Parent.

**Acceptance Criteria:**

**Given** report form data is valid
**When** Tutor generates the report image
**Then** the browser renders the report template
**And** output is an image file
**And** placeholder bank QR and Tuition Fee are included
**And** Tutor can download the image
**And** the system does not send it automatically to Parents.


## Final Validation

### FR Coverage Validation

All 28 Functional Requirements are covered by at least one epic/story.

### Architecture Implementation Validation

- Existing Next.js app is extended; no new starter template setup story required.
- Database/entities are introduced by the first story that needs them rather than all upfront.
- Supabase Auth, RLS, Server Actions, Storage, route groups, and validation patterns align with the architecture document.

### Story Quality Validation

- Stories are sized for single dev-agent implementation.
- Each story has clear user value and Gherkin acceptance criteria.
- Stories depend only on prior foundation/domain stories.
- Tutor-initiated changes use request/proposal flows, not direct mutation.

### Epic Structure Validation

- 10 epics deliver coherent domain value.
- Epic order starts with auth and role foundation, then proceeds through Admin data management, Tutor workspace, request/proposal workflows, materials, and reporting.
- Some shared files such as Supabase clients, auth helpers, and dashboard layout will be reused across epics; this is intentional and does not indicate harmful file churn.

### Dependency Validation

- Epic 1 provides shared auth/session foundation.
- Later epics build naturally on prior data models.
- Open Class, Material Library, Document Feedback, and Monthly Report epics can be implemented independently after the required auth/data foundations exist. Schedule Proposal workflow is removed.

### Final Status

READY FOR DEVELOPMENT PLANNING.
