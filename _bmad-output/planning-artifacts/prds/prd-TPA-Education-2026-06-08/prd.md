---
title: TPA-Education Internal Tutor and Class Management MVP
status: draft
created: 2026-06-08
updated: 2026-06-08
---

# PRD: TPA-Education Internal Tutor and Class Management MVP
*Working title - confirm.*

## 0. Document Purpose
This PRD defines the MVP requirements for an internal TPA-Education web application used to manage Tutor accounts, Classes, open-class requests, teaching materials, teaching-material requests, and monthly student progress reports. It is intended for PM, architecture, UX, and implementation workflows. It builds on existing project documentation in `docs/index.md`, `docs/project-overview.md`, and `docs/architecture.md`. This document is capability-focused; technical implementation decisions belong in downstream architecture.

## 1. Vision
TPA-Education needs to move from manual class coordination through chat messages and ad hoc tracking into a centralized internal system. The MVP should let a single Admin manage Tutor accounts, organize Classes, assign Tutors, and maintain weekly schedules with less ambiguity and less manual reconciliation.

The same system should give each Tutor a practical workspace: view assigned Classes, browse open Classes, request to take an open Class, propose schedules for assigned Classes, access a teaching-material library, request additional teaching materials when needed, and generate a monthly progress report for parents using a consistent center-branded template. The product should reduce operational friction while remaining lightweight enough to launch quickly as an internal MVP.

## 2. Target User

### 2.1 Jobs To Be Done
- As the Admin, I need one place to manage Tutors, Students, Parents, Classes, and schedules so I do not rely on scattered chat history.
- As the Admin, I need to create Tutor accounts myself so I can onboard Tutors quickly without a separate invitation flow.
- As the Admin, I need to track which Tutor teaches which Class and when each Class happens every week.
- As a Tutor, I need to see only my assigned Classes and schedules so I know what I am responsible for.
- As a Tutor, I need to browse open Classes and request to take a suitable Class so I can find new teaching opportunities.
- As a Tutor, I need to access a central Teaching Material Library so I can reuse center-approved materials.
- As a Tutor, I need to request teaching materials for a specific Class or general teaching need so the center can support lesson prep.
- As a Tutor, I need to produce a parent-facing monthly progress report quickly without manually designing a document each time.

### 2.2 Non-Users (v1)
- Parents and Students do not log into the system in MVP.
- Additional Admin roles are not supported in MVP.
- Finance staff, operations staff, and content authors as separate roles are not supported in MVP.

### 2.3 Key User Journeys
- **UJ-1. Admin creates a Tutor account and prepares the Tutor to teach.**
  - **Persona + context:** Admin is coordinating multiple Tutors and needs to onboard one quickly.
  - **Entry state:** Admin is authenticated in the internal dashboard.
  - **Path:** Admin opens Tutor management, enters Tutor profile details, sets email and initial password, saves the Tutor account, then verifies the Tutor appears in the Tutor list.
  - **Climax:** The Tutor account exists and is ready to be assigned to a Class.
  - **Resolution:** Admin continues to create or assign Classes.

- **UJ-2. Admin creates a Class and assigns it to a Tutor.**
  - **Persona + context:** Admin receives a new student arrangement and needs it tracked centrally.
  - **Entry state:** Admin is authenticated and has access to class management.
  - **Path:** Admin creates or selects Student and Parent records, enters Class information, sets start date, tuition fee, tutor pay, schedule, and Tutor assignment, then saves the Class.
  - **Climax:** The Class is visible in the system with Tutor, schedule, and fee information attached.
  - **Resolution:** The assigned Tutor can now view the Class in their own workspace.

- **UJ-3. Tutor checks upcoming Classes and schedule.**
  - **Persona + context:** Tutor wants a clear view of teaching responsibilities.
  - **Entry state:** Tutor is authenticated.
  - **Path:** Tutor opens the dashboard, sees only assigned Classes, opens a Class detail page, and reviews subject, Student, Parent contact, weekly schedule, and status.
  - **Climax:** Tutor confirms what to teach, for whom, and when.
  - **Resolution:** Tutor proceeds to teach or prepare.

- **UJ-4. Tutor requests an open Class.**
  - **Persona + context:** Tutor wants to find additional suitable teaching work from Classes not yet assigned.
  - **Entry state:** Tutor is authenticated and opens the open Classes page.
  - **Path:** Tutor browses open Classes, reviews subject, grade, mode, fee, schedule notes, and requirements, then submits a request to take one Class.
  - **Climax:** The request is saved for Admin review.
  - **Resolution:** Admin approves or rejects the request; approved requests assign the Class to the Tutor.

- **UJ-5. Tutor proposes a schedule for an assigned Class.**
  - **Persona + context:** Tutor and family have discussed a preferred weekly time and Tutor needs the center to confirm it.
  - **Entry state:** Tutor is authenticated and opens an assigned Class.
    - **Climax:** The proposal becomes visible to Admin for approval.
  - **Resolution:** Admin approval updates the official Class Schedule.

- **UJ-6. Tutor requests teaching materials.**
  - **Persona + context:** Tutor needs center-prepared material for either a Class-specific need or a broader topic.
  - **Entry state:** Tutor is authenticated and knows what material is needed.
  - **Path:** Tutor opens material requests, creates a request, optionally links it to a Class, writes the desired topic and notes, and submits.
  - **Climax:** The request is saved with status tracking and becomes visible to the Admin.
  - **Resolution:** Tutor later downloads the material once the Admin fulfills the request.

- **UJ-7. Tutor creates a monthly progress report for a Class.**
  - **Persona + context:** End of month, Tutor needs a consistent parent-facing summary.
  - **Entry state:** Tutor is authenticated and opens one assigned Class.
  - **Path:** Tutor starts a monthly report, fills in progress and student evaluation fields, confirms the tuition amount shown for that Class, and generates the output.
  - **Climax:** The system creates a branded report image including a placeholder bank QR and class fee.
  - **Resolution:** Tutor downloads the image and sends it manually to the Parent.

## 3. Glossary
- **Admin** - The single center operator role in MVP. Admin has full management access.
- **Tutor** - A teaching user who authenticates with email and password and only sees data related to assigned Classes.
- **Student** - The learner attached to one or more Classes.
- **Parent** - The parent or guardian contact associated with a Student.
- **Class** - A tutoring engagement record containing subject, grade, Student, Parent, assigned Tutor, fee information, status, and schedule.
- **Open Class** - A Class that is not yet assigned to a Tutor and is visible for Tutors to request.
- **Class Request** - A Tutor request to take an Open Class, reviewed and approved or rejected by Admin.
- **Schedule** - One or more weekly recurring time slots attached to a Class.
- **Material Request** - A Tutor-created request asking the center for teaching materials, either tied to a Class or submitted as a general topic need.
- **Teaching Material** - A file provided by the Admin for a Material Request or Library item. MVP stores files in private Cloudflare R2 and surfaces them through authorized app access.
- **Teaching Material Library** - A central collection of Admin-published Teaching Materials that Tutors can browse and download.
- **Monthly Report** - A Tutor-generated parent-facing progress summary for a single Class, produced as an image.
- **Tuition Fee** - The amount charged for a Class and shown on the Monthly Report.
- **Tutor Pay** - The internal compensation amount associated with a Class.

## 4. Features

### 4.1 Authentication and Access Control
**Description:** The system supports internal authentication for one Admin and multiple Tutors. The Admin account model is single-user in MVP. Tutors log in with email and password created by the Admin. Tutor access must be restricted to their own Classes, schedules, Material Requests, Teaching Materials, and Monthly Reports. Realizes UJ-1, UJ-3, UJ-4, UJ-5.

**Functional Requirements:**

#### FR-1: Admin authentication
The Admin can log in with email and password to access the internal management interface. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Unauthenticated users cannot access Admin pages.
- Successful Admin login opens Admin-only screens.
- MVP supports only one Admin account.

#### FR-2: Tutor authentication
A Tutor can log in with email and password created by the Admin. Realizes UJ-3, UJ-6, UJ-7.

**Consequences (testable):**
- A Tutor account cannot be used before Admin creates it.
- Successful Tutor login opens Tutor-only screens.
- Tutor credentials are distinct per Tutor.

#### FR-3: Role-restricted access
The system restricts feature and data access by role. Realizes UJ-2, UJ-3, UJ-4, UJ-5.

**Consequences (testable):**
- Tutor cannot access Admin management pages.
- Tutor cannot view Classes assigned to another Tutor.
- Admin can view and manage all MVP data entities.

### 4.2 Tutor Management
**Description:** The Admin can create and manage Tutor accounts and Tutor profile information. This includes operational onboarding through manual password setup rather than invitation flow. Realizes UJ-1.

**Functional Requirements:**

#### FR-4: Create Tutor account
The Admin can create a Tutor account with profile information, email, and initial password. Realizes UJ-1.

**Consequences (testable):**
- Required Tutor fields must be validated before save.
- Duplicate Tutor email addresses are rejected.
- Newly created Tutor appears in the Tutor list after save.

#### FR-5: Manage Tutor profile
The Admin can view and update Tutor profile information and account status. Realizes UJ-1.

**Consequences (testable):**
- Admin can edit Tutor details after creation.
- Admin can disable a Tutor account without deleting historical Class data.
- Inactive Tutors cannot log in.

### 4.3 Student and Parent Management
**Description:** The Admin can create and maintain Student and Parent records used by Classes. Parent contact information is needed so Tutors can understand who they report to outside the system. Realizes UJ-2.

**Functional Requirements:**

#### FR-6: Create and edit Student records
The Admin can create and edit Student records used by Classes. Realizes UJ-2.

**Consequences (testable):**
- Student full name is required.
- Grade/class level can be recorded.
- Student record can be reused across multiple Classes if needed.

#### FR-7: Create and edit Parent records
The Admin can create and edit Parent records linked to Students and Classes. Realizes UJ-2.

**Consequences (testable):**
- Parent name and phone number can be stored.
- Parent can be linked to at least one Student.
- Parent contact details are visible in related Class detail views.

### 4.4 Class Management
**Description:** The Admin can create and manage Classes as the core operational record. A Class contains academic, commercial, and assignment information. Realizes UJ-2.

**Functional Requirements:**

#### FR-8: Create Class
The Admin can create a Class with subject, grade/class level, Student, Parent, Tutor, learning mode, start date, weekly schedule, tuition fee, tutor pay, notes, and status. Realizes UJ-2.

**Consequences (testable):**
- A Class cannot be saved without required core fields.
- A Class can be assigned to one Tutor in MVP.
- Tuition Fee and Tutor Pay are stored per Class.

#### FR-9: Edit Class
The Admin can update Class details after creation. Realizes UJ-2.

**Consequences (testable):**
- Admin can change Tutor assignment, schedule, fees, notes, and status.
- Changes are reflected in the assigned Tutor view.
- Historical Class record remains accessible after edits.

#### FR-10: Manage Class status
The Admin can set and update Class status values for operational tracking. Realizes UJ-2.

**Consequences (testable):**
- Status is visible in Admin and Tutor views.
- Inactive/completed/cancelled Classes remain historically viewable.
- Status options are constrained to defined values. [ASSUMPTION: status set will include at least pending, active, paused, completed, cancelled.]

### 4.5 Weekly Schedule Management
**Description:** Each Class may have one or more recurring weekly Schedule entries. Admin may enter initial schedule context, but Tutors coordinate schedule changes directly with parents outside the app. Tutors can view schedule/class context but do not submit schedule proposals in-app. Realizes UJ-2, UJ-3.

**Functional Requirements:**

#### FR-11: Create and update weekly Schedule
The Admin can create and update one or more weekly Schedule entries for a Class. Realizes UJ-2.

**Consequences (testable):**
- A Schedule entry records weekday and time range.
- A Class can have multiple recurring weekly entries.
- Updated Schedule values are immediately visible in Tutor views.

#### FR-12: Tutor Schedule visibility
A Tutor can view weekly Schedule information for assigned Classes only. Realizes UJ-3.

**Consequences (testable):**
- Tutor dashboard lists only assigned Classes.
- Tutor Class detail shows its weekly Schedule.
- Tutor cannot edit the Schedule.

### 4.6 Tutor Workspace
**Description:** Tutors need a simplified, role-limited workspace focused on execution rather than management. They can view Class details and use the Class context to create Material Requests and Monthly Reports. Realizes UJ-3, UJ-6, UJ-7.

**Functional Requirements:**

#### FR-13: Tutor Class list
A Tutor can see a list of assigned Classes. Realizes UJ-3.

**Consequences (testable):**
- List excludes Classes assigned to other Tutors.
- List shows enough summary information to identify each Class.
- Tutor can open a Class detail from the list.

#### FR-14: Tutor Class detail
A Tutor can view details of an assigned Class, including Student, Parent, subject, status, Schedule, Tuition Fee, and notes relevant to teaching. Realizes UJ-3, UJ-5.

**Consequences (testable):**
- Parent contact information is visible for the assigned Class.
- Tuition Fee is visible because it is needed in Monthly Reports.
- Tutor cannot modify core Class data in MVP.

### 4.7 Open Class Discovery and Requests
**Description:** Tutors can browse Open Classes and submit a Class Request to take a suitable Class. Admin remains the source of truth and must approve before a Class becomes assigned. Realizes UJ-4.

**Functional Requirements:**

#### FR-15: Browse Open Classes
A Tutor can view Classes marked as open and available for Tutor requests. Realizes UJ-4.

**Consequences (testable):**
- Tutor can see only Classes marked open/available.
- Open Class listing includes subject, grade, mode, fee, schedule notes if available, and requirements.
- Sensitive Parent contact details are hidden until assignment is approved.

#### FR-16: Request Open Class
A Tutor can submit a Class Request for an Open Class. Realizes UJ-4.

**Consequences (testable):**
- A Tutor cannot submit duplicate active requests for the same Open Class.
- Admin can see pending Class Requests.
- Submitting a request does not automatically assign the Class.

#### FR-17: Approve or reject Class Request
Admin can approve or reject a Class Request. Realizes UJ-4.

**Consequences (testable):**
- Approval assigns the Class to the Tutor and removes it from Open Classes.
- Rejection keeps the Class open unless Admin changes status.
- Tutor can see the request outcome.

### 4.8 Removed: Schedule Proposals

Schedule Proposal workflow is removed from MVP. Tutors self-coordinate schedule changes with parents outside the app.

### 4.9 Teaching Material Library
**Description:** Admin can publish Teaching Materials to a central library. Tutors can browse and download published materials in addition to requesting custom materials. Realizes UJ-6.

**Functional Requirements:**

#### FR-20: Admin publishes Teaching Material Library item
Admin can create a library item with title, subject, grade, description, and one or more uploaded files stored in private Cloudflare R2. Realizes UJ-6.

**Consequences (testable):**
- Library item can contain multiple R2-backed files.
- Admin can mark items active/inactive.
- Inactive items are hidden from Tutors.

#### FR-21: Tutor browses and downloads Teaching Material Library
Tutor can browse and download active Teaching Material Library items. Realizes UJ-6.

**Consequences (testable):**
- Tutor can filter or search by subject/grade where implemented.
- Tutor can access authorized R2-backed files from the web catalog through app-controlled download/open flows.
- Tutor cannot edit library items.

### 4.10 Teaching Material Requests
**Description:** Tutors can ask the center for Teaching Materials either for a specific Class or as a general subject/topic need. The Admin manages request fulfillment and uploads files. Tutors can download fulfilled files and review request history. Realizes UJ-6.

**Functional Requirements:**

#### FR-22: Create Material Request
A Tutor can create a Material Request linked either to a specific Class or to a general topic request. Realizes UJ-6.

**Consequences (testable):**
- Request captures request type, title/topic, description, and optional Class link.
- Request is visible to the Admin after submission.
- Request is stored in Tutor request history.

#### FR-23: Admin manages Material Requests
The Admin can view, update status, and fulfill Material Requests. Realizes UJ-6.

**Consequences (testable):**
- Admin can see all Material Requests.
- Admin can mark request status values. [ASSUMPTION: status set will include submitted, in_progress, fulfilled, rejected.]
- Admin can attach one or more Cloudflare R2 file/folder links as Teaching Materials.

#### FR-24: Tutor opens fulfilled Cloudflare R2 Teaching Material links
A Tutor can view request history and download Teaching Materials attached to fulfilled requests. Realizes UJ-6.

**Consequences (testable):**
- Tutor can see status history for own requests.
- Tutor can open/download linked Cloudflare R2 PDF or Word files according to Cloudflare R2 permissions.
- Tutor cannot access another Tutor's Material Requests.

### 4.11 Monthly Progress Reports
**Description:** Tutors generate a center-branded Monthly Report per Class by filling in structured information at month end. The system outputs an image containing report content, placeholder bank QR, and the Tuition Fee associated with that Class. Tutors download the image and send it manually to Parents. Realizes UJ-7.

**Functional Requirements:**

#### FR-25: Create Monthly Report draft
A Tutor can create a Monthly Report for an assigned Class and reporting month. Realizes UJ-7.

**Consequences (testable):**
- Tutor can start a report only for an assigned Class.
- A report is associated with one Class and one reporting month.
- The system prevents duplicate final reports for the same Class-month pair. [ASSUMPTION: duplicate drafts may be allowed before final generation.]

#### FR-26: Fill Monthly Report content
A Tutor can enter the required monthly progress and student evaluation information into a structured form. Realizes UJ-7.

**Consequences (testable):**
- Form captures the fields required by the report template.
- Tutor can save progress before final image generation. [ASSUMPTION: draft save is desirable for usability.]
- Tuition Fee shown in the report is pulled from the linked Class.

#### FR-27: Generate branded Monthly Report image
The system can generate a branded image from Monthly Report data using a predefined template. Realizes UJ-7.

**Consequences (testable):**
- Generated output is an image, not PDF.
- Output includes a placeholder bank QR image.
- Output includes Tuition Fee from the Class record.

#### FR-28: Tutor downloads Monthly Report image
A Tutor can download the generated Monthly Report image for manual sharing. Realizes UJ-7.

**Consequences (testable):**
- Tutor can download the generated image after creation.
- Tutor can access only reports for assigned Classes.
- The system does not send the report to Parents automatically in MVP.

## 5. Non-Goals (Explicit)
- No Parent or Student login in MVP.
- No multi-Admin support in MVP.
- No invite-email onboarding flow for Tutors in MVP.
- No automatic parsing of pasted Zalo chat blocks in MVP.
- No Tutor editing of Class core data in MVP.
- No automatic sending of Monthly Reports to Parents in MVP.
- No payroll, attendance tracking, or lesson-by-lesson reporting in MVP.
- No chatbot/AI lesson-prep assistant in MVP; it is deferred for later.
- No automated curriculum generation by AI in MVP; only request tracking, file delivery, and Admin-published library materials.
- No center fee, commission, or 5% monthly fee tracking in the app MVP.
- No Supabase Storage upload pipeline for Teaching Materials in MVP; Cloudflare R2 is the document source of truth.

## 6. MVP Scope

### 6.1 In Scope
- Internal login for one Admin and multiple Tutors
- Tutor account creation by Admin
- Tutor profile management
- Student and Parent management
- Class creation and editing
- Weekly Schedule management
- Tutor view of assigned Classes and Schedules
- Tutor browsing of Open Classes
- Tutor Class Request submission for Open Classes
- Admin approval/rejection of Class Requests
- Removed: Tutor Schedule Proposal submission
- Removed: Admin approval/rejection of Schedule Proposals
- Teaching Material Library browsing and Cloudflare R2 link access
- Tutor Material Request creation and history
- Admin Teaching Material link/catalog management and request fulfillment
- Monthly Report form and branded image generation
- Tuition Fee display on generated Monthly Reports
- Placeholder bank QR shown on generated Monthly Reports

### 6.2 Out of Scope for MVP
- Multi-Admin access - deferred because operating model is single Admin now.
- Parent/Student portal - deferred because current workflow is internal only.
- Zalo-message parsing intake - deferred because manual form entry is acceptable for MVP.
- Automatic report delivery - deferred because Tutors will send reports manually.
- Tutor class-status editing - deferred to keep Admin as source of truth.
- Finance automation and payroll calculation - deferred because it expands domain scope significantly.
- Rich in-app document preview/editor for Teaching Materials - deferred; Cloudflare R2 handles viewing/downloading in MVP.

## 7. Success Metrics

**Primary**
- **SM-1**: 100% of active Classes can be represented in the system with Tutor, Student, Parent, weekly Schedule, Tuition Fee, and status. Validates FR-8, FR-9, FR-11.
- **SM-2**: Admin can create a new Tutor and assign a new Class without relying on external chat-based tracking as the system of record. Validates FR-4, FR-8, FR-11.
- **SM-3**: A Tutor can independently retrieve assigned Class information and generate a monthly parent-facing report image without Admin intervention. Validates FR-13, FR-14, FR-18, FR-19, FR-20, FR-21.

**Secondary**
- **SM-4**: 90%+ of Teaching Material requests can be tracked from submission to fulfilled/rejected status inside the system. Validates FR-15, FR-16, FR-17.
- **SM-5**: Monthly Report generation produces a usable output on first attempt for most Tutor use cases. Validates FR-19, FR-20, FR-21.

**Counter-metrics (do not optimize)**
- **SM-C1**: Do not reduce required reporting fields so aggressively that Monthly Reports become too vague for Parents. Counterbalances SM-5.
- **SM-C2**: Do not broaden Tutor edit permissions just to reduce Admin work if it weakens source-of-truth control in MVP. Counterbalances SM-2.

## 8. Open Questions
1. What exact visual layout and field order should the Monthly Report template use?
2. What Cloudflare R2 sharing permission convention should be used for Teaching Material links?
3. What exact status vocabulary should Material Requests use?
4. What exact status vocabulary should Classes use?
5. Should Tuition Fee be displayed as a single monthly number, per-session number, or flexible text value in the Monthly Report template?
6. Does the Admin need a simple dashboard summary in MVP, or are CRUD lists sufficient initially?
7. Should generated Monthly Report images be re-openable and regenerable later by the Tutor?
8. What exact Open Class status/request status vocabulary should be used?
9. What fields should be visible to Tutors before a Class Request is approved?
10. Should Teaching Material Library filtering be required in MVP or start as a simple list?

## 9. Assumptions Index
- Section 4.4 / FR-10 - Class statuses will include at least pending, active, paused, completed, cancelled.
- Section 4.7 / FR-16 - Material Request statuses will include submitted, in_progress, fulfilled, rejected.
- Section 4.8 / FR-18 - Duplicate drafts may be allowed before final Monthly Report generation.
- Section 4.8 / FR-19 - Draft save before final generation is desirable for usability.
