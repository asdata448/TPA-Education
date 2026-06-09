# Story 8.2/8.3: R2 Material Upload and Tutor Library

Status: review

## Implemented

- Admin upload UI on `/dashboard/admin`.
- Admin creates teaching material library item with title, subject, grade, description, active flag, and multiple files.
- Server action uploads file bytes to private Cloudflare R2.
- Postgres stores library item metadata and R2 file metadata.
- Tutor library page at `/dashboard/tutor/library`.
- Tutor dashboard links to material library.
- Authenticated download route at `/materials/[fileId]/download`.
- Download route creates short-lived R2 signed URL after app auth checks.
- Server actions validate allowed file type and enforce a 25MB per-file limit.
- Admin and Tutor library views include client-side search/filter.
- Delete flows remove database rows and best-effort clean private R2 objects.
- Admin can edit teaching material metadata, toggle active/inactive status, add files during edit, delete individual files, and delete full material items.

## Validation

- Local R2 credential smoke test uploaded/read/deleted a test object successfully.
- TypeScript validation passed.
- Scoped ESLint validation for material library files passed.
- Production build command executed.
- Vercel production deploy completed.

## Files

- `app/dashboard/admin/materials-data.ts`
- `app/dashboard/admin/material-actions.ts`
- `app/dashboard/admin/material-library-manager.tsx`
- `app/dashboard/admin/create-material-form.tsx`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/tutor/library/page.tsx`
- `app/dashboard/tutor/tutor-material-library.tsx`
- `app/dashboard/tutor/page.tsx`
- `app/materials/[fileId]/download/route.ts`
- `lib/r2/client.ts`
- `docs/r2-material-library-plan.md`
