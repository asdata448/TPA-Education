# Data Models

## Active Application Data Models

The application currently uses active Supabase-backed data models for:
- authentication / authorization
- Tutor operational management
- Class management with schedules and sessions
- Payment processing
- Progress reporting
- Document feedback
- Email notification settings
- Material library

## Supabase Auth Model

Primary identity is managed by Supabase Auth in `auth.users`.

Relevant fields used by the app:
- `id`
- `email`
- `encrypted_password`
- session metadata managed by Supabase

## Profiles Table

Created by:

```text
supabase/migrations/20260608000001_create_profiles.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, references `auth.users(id) on delete cascade` | User identity |
| `role` | `text` | NOT NULL, CHECK `(role in ('admin', 'tutor'))` | User role |
| `full_name` | `text` | NOT NULL | Display name |
| `active` | `boolean` | NOT NULL, default `true` | Account status |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

### Purpose
- Link each authenticated user to an application role
- Support server-side authorization in login action and middleware
- Support Admin/Tutor workflows

## Tutors Table

Created by:

```text
supabase/migrations/20260609000001_create_tutors.sql
supabase/migrations/20260609000002_add_tutor_subjects.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Tutor record ID |
| `profile_id` | `uuid` | NOT NULL, UNIQUE, references `profiles(id) on delete cascade` | Link to auth profile |
| `phone` | `text` | — | Phone number |
| `subjects` | `text` | — | Teaching subjects |
| `specialties` | `text` | — | Specialties |
| `notes` | `text` | — | Admin notes |
| `active` | `boolean` | NOT NULL, default `true` | Active status |
| `bank_name` | `text` | — | Payment bank name (e.g. Vietcombank) |
| `bank_account_no` | `text` | — | Bank account number |
| `bank_account_name` | `text` | — | Bank account holder name |
| `bank_qr_key` | `text` | — | R2 key for static QR code image |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

### Purpose
- Store Tutor operational profile data separately from auth identity
- Support Admin Tutor creation/editing
- Store Tutor payment details (bank account details and static QR code key)
- Support future Tutor assignment workflows

## Class Payments Table

Created by:

```text
supabase/migrations/20260610000003_add_payment_system.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Payment record ID |
| `class_id` | `uuid` | NOT NULL, references `classes(id) on delete cascade` | Linked class |
| `billing_month` | `varchar(7)` | NOT NULL | Billing cycle (YYYY-MM) |
| `tuition_fee` | `numeric(12,2)` | NOT NULL | Actual tuition collected |
| `tuition_status` | `text` | NOT NULL, default `'unpaid'`, CHECK in `('unpaid','paid')` | Parent payment status |
| `tuition_paid_at` | `timestamptz` | — | When parent paid |
| `tutor_payment_status` | `text` | NOT NULL, default `'unpaid'`, CHECK in `('unpaid','paid')` | Tutor payout status |
| `tutor_paid_at` | `timestamptz` | — | When Tutor was paid |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

### Purpose
- Track monthly tuition billing cycles per class
- Auto-calculate Tutor salary (95% of tuition fee)
- Enforce Tutor payout only after parent payment confirmed

## Class Progress Reports Table

Created by:

```text
supabase/migrations/20260610000004_create_progress_reports.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Report ID |
| `class_id` | `uuid` | NOT NULL, references `classes(id) on delete cascade` | Linked class |
| `reporting_month` | `varchar(7)` | NOT NULL | Report period (YYYY-MM) |
| `lessons_completed` | `integer` | NOT NULL, default `0` | Actual lessons in month |
| `rating_comprehension` | `integer` | NOT NULL | Comprehension rating (1-5) |
| `rating_homework` | `integer` | NOT NULL | Homework effort rating (1-5) |
| `rating_attendance` | `integer` | NOT NULL | Attendance rating (1-5) |
| `rating_attitude` | `integer` | NOT NULL | Attitude rating (1-5) |
| `teacher_comments` | `text` | NOT NULL | Detailed Tutor comments |
| `next_month_plan` | `text` | — | Next month learning plan |
| `tuition_fee` | `numeric(12,2)` | NOT NULL | Fee at report time |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

### Purpose
- Monthly student progress evaluation by Tutor
- Public anonymous-read link for sharing with parents via Zalo/Messenger
- Display tuition info with center QR code (`qrtrungtam.png`)

## Class Sessions Table

Created by:

```text
supabase/migrations/20260610000006_create_class_sessions.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Session ID |
| `class_id` | `uuid` | NOT NULL, references `classes(id) on delete cascade` | Linked class |
| `session_date` | `date` | NOT NULL | Session date |
| `start_time` | `time` | NOT NULL | Start time |
| `end_time` | `time` | NOT NULL | End time |
| `status` | `text` | NOT NULL, default `'scheduled'`, CHECK in `('scheduled','attended','absent','cancelled')` | Session status |
| `tutor_comments` | `text` | — | Quick Tutor note about student |
| `attendance_checked_at` | `timestamptz` | — | When attendance was marked |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

### Purpose
- Individual lesson instances auto-generated from weekly schedule
- Support attendance tracking with Tutor comments
- Support single-session rescheduling without affecting recurring schedule

## Class Schedules Table

Created by:

```text
supabase/migrations/20260609000007_create_classes_schedules_requests.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, default `gen_random_uuid()` | Schedule ID |
| `class_id` | `uuid` | NOT NULL, references `classes(id) on delete cascade` | Linked class |
| `weekday` | `smallint` | NOT NULL, CHECK between 0-6 | Day of week (0=Sun, 1=Mon, ..., 6=Sat) |
| `start_time` | `time` | NOT NULL | Start time |
| `end_time` | `time` | NOT NULL | End time |
| `notes` | `text` | — | Schedule notes |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |

### Purpose
- Manage fixed weekly recurring time slots per class
- Source data for auto-generating `class_sessions` 30 days ahead

## Email Settings Table

Created by:

```text
supabase/migrations/20260612000001_create_email_settings.sql
```

### Columns

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `boolean` | PK, default `true` | Singleton row (always `true`) |
| `admin_notification_emails` | `text[]` | NOT NULL, default `'{}'` | Admin recipient inboxes |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation time |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time |

### Purpose
- Store Admin-managed email recipients without code changes or redeploys
- Powers `sendAdminNotificationEmail()` in `lib/email.tsx`
- Editable by active Admin users at `/dashboard/admin/settings`

### Authorization
- Active Admin users can select/update through RLS
- Server-side email delivery reads the row using service-role because some triggers originate from Tutor server actions

## Authorization Model

### Supported Roles

| Role | Dashboard | Capabilities |
| --- | --- | --- |
| `admin` | `/dashboard/admin` | Full management: Tutor CRUD, class management, finance, feedback, reports, settings |
| `tutor` | `/dashboard/tutor` | View assigned classes, submit reports, submit feedback, request open classes, change password, manage bank settings |

### Access Control

- Admin users land on `/dashboard/admin`
- Tutor users land on `/dashboard/tutor`
- Tutor access to `/dashboard/admin/*` is blocked and redirected
- Inactive Tutor users are blocked from Tutor dashboard access
- Route protection enforced by `proxy.ts` middleware

## Entity Relationships

```
auth.users ──1:1──▶ profiles ──1:1──▶ tutors
                              │
                              ▼
                         classes ──1:N──▶ class_schedules
                              │
                              ├──1:N──▶ class_sessions
                              │
                              ├──1:N──▶ class_payments
                              │
                              ├──1:N──▶ progress_reports
                              │
                              └──1:N──▶ document_feedback

email_settings (singleton)
```

## Removed Models

Removed by:

```text
supabase/migrations/20260609000006_remove_students_parents.sql
```

Removed tables:
- `students`
- `parents`
- `student_parents`

Reason:
- Student/Parent data is no longer treated as independent Admin CRUD in the current product slice
- That information will instead be entered later as part of class/schedule management

## Static Content Structures

The landing page still uses `lib/data.ts` for static marketing content such as:
- tutor records
- subject definitions
- FAQ entries
- consultation process steps
- commitment cards

## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.

## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
