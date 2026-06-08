# Cloudflare R2 Material Library Plan

## Decision

Epic 8 uses Cloudflare R2 instead of Google Drive for Teaching Material Library files.

- R2 bucket stays private.
- Postgres stores library item metadata and R2 object metadata.
- App enforces Admin/Tutor authorization before upload/download.
- MVP should use app-controlled upload/download first.
- Presigned URLs or a Cloudflare Worker gateway can be added later when file size or traffic requires it.

## Why Replace Google Drive

Google Drive is optimized for manual sharing and collaboration. The TPA app needs app-owned authorization, metadata, and role-controlled access. R2 fits better because file ownership, object keys, metadata, and access can be governed by the product instead of by external Drive permissions.

## Source References

Local source docs used:

```text
cloudflare_r2 docs/pages/r2.md
cloudflare_r2 docs/pages/r2_api.md
cloudflare_r2 docs/pages/r2_api_s3_api.md
cloudflare_r2 docs/pages/r2_api_s3_presigned-urls.md
cloudflare_r2 docs/pages/r2_api_workers_workers-api-usage.md
cloudflare_r2 docs/pages/r2_reference_wrangler-commands.md
```

Official online docs:

- https://developers.cloudflare.com/r2/
- https://developers.cloudflare.com/r2/api/
- https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- https://developers.cloudflare.com/r2/api/workers/workers-api-usage/
- https://developers.cloudflare.com/r2/reference/wrangler-commands/

## Recommended MVP Architecture

```text
Admin browser
  -> Next.js Server Action / Route Handler
  -> authorize active Admin
  -> upload file to private R2 bucket
  -> write metadata rows in Supabase Postgres

Tutor browser
  -> Next.js page/route
  -> authorize active Tutor/Admin
  -> read Postgres metadata
  -> download/open file through app-controlled endpoint
```

## Later Optimization

Use direct-to-R2 presigned URLs when needed:

```text
Admin browser
  -> app requests signed upload URL
  -> browser uploads directly to R2
  -> app records metadata after upload success
```

Use signed download URLs or Worker gateway when file delivery should bypass Vercel server runtime.

## Bucket Strategy

Suggested bucket:

```text
tpa-teaching-materials
```

Keep it private. Do not expose a public bucket for Tutor-only internal materials.

## Object Key Strategy

Recommended object key format:

```text
library/{libraryItemId}/{timestamp}-{safeFileName}
```

Why this format:

- avoids collisions
- keeps all files for one library item grouped
- does not require renaming objects if subject/grade metadata changes

## Environment Variables

```bash
CLOUDFLARE_ACCOUNT_ID=<account-id>
CLOUDFLARE_R2_BUCKET=tpa-teaching-materials
R2_ACCESS_KEY_ID=<r2-access-key-id>
R2_SECRET_ACCESS_KEY=<r2-secret-access-key>
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

Keep `R2_SECRET_ACCESS_KEY` server-only.

## Wrangler CLI Tasks

You are already logged in with:

```bash
wrangler login
```

Create bucket:

```bash
wrangler r2 bucket create tpa-teaching-materials
```

List buckets:

```bash
wrangler r2 bucket list
```

List objects for debugging:

```bash
wrangler r2 object list tpa-teaching-materials
```

Do not rely on Wrangler for app runtime uploads. Wrangler is for setup/debug; the app should use server-side code or Worker bindings.

## Postgres Schema Plan

### teaching_material_library_items

```sql
id uuid primary key default gen_random_uuid(),
title text not null,
subject_id uuid references public.subjects(id) on delete set null,
subject_name text,
grade_level text,
description text,
active boolean not null default true,
created_by_profile_id uuid references public.profiles(id) on delete set null,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### teaching_material_library_files

```sql
id uuid primary key default gen_random_uuid(),
library_item_id uuid not null references public.teaching_material_library_items(id) on delete cascade,
r2_key text not null unique,
file_name text not null,
mime_type text,
size_bytes bigint,
version integer not null default 1,
uploaded_by_profile_id uuid references public.profiles(id) on delete set null,
created_at timestamptz not null default now()
```

## Access Rules

Admin:

- create library items
- upload files
- activate/deactivate items
- view/download all items

Tutor:

- view active library items
- download/open active item files
- cannot upload/edit/delete library items

## Epic 8 Revised Stories

### Story 8.1: R2 Material Library Foundation

As the system, I want Teaching Material metadata tables and R2 integration config so that uploaded teaching materials are stored privately and controlled by the app.

Acceptance:

- R2 bucket exists and is private.
- required R2 env vars are documented.
- Postgres metadata tables exist.
- Admin/Tutor access strategy is server-authorized.

### Story 8.2: Admin Uploads Library Item Files

As an Admin, I want to create a library item with one or more uploaded files so Tutors can reuse center-approved materials.

Acceptance:

- Admin can enter title, subject/grade, description, active status.
- Admin can attach one or more files.
- Files are stored in R2.
- Postgres stores metadata and R2 object keys.
- failed upload or metadata insert returns a user-facing error.

### Story 8.3: Tutor Browses and Downloads Library Items

As a Tutor, I want to browse and download active library materials so I can prepare lessons efficiently.

Acceptance:

- Tutor sees active items only.
- inactive items are hidden.
- Tutor can download/open authorized files.
- Tutor cannot edit library items.
- Parent/student/class private details are not exposed through library browsing.

## Non-Goals For MVP

- Google Drive integration
- public R2 bucket access
- direct browser upload via presigned URL
- Cloudflare Worker gateway
- file version UI beyond storing a version number
- full-text search
- preview renderer for PDFs/docs

## Implementation Sequence

1. Create R2 bucket with Wrangler.
2. Add R2 env vars locally and in Vercel.
3. Add Postgres migration.
4. Add server-only R2 helper.
5. Add Admin upload form.
6. Add Tutor library browse page.
7. Add authenticated download route.
8. Deploy and test with one PDF/doc file.
