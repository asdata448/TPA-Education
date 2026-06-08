from pathlib import Path
p=Path('docs/r2-material-library-plan.md')
text=p.read_text()
text=text.replace('Suggested bucket:\n\n```text\ntpa-teaching-materials\n```', 'Created bucket:\n\n```text\ntpa-teaching-materials\n```')
text=text.replace('CLOUDFLARE_ACCOUNT_ID=<account-id>', 'CLOUDFLARE_ACCOUNT_ID=d89f4239433ffc169f910b495022c51f')
text=text.replace('R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com', 'R2_ENDPOINT=https://d89f4239433ffc169f910b495022c51f.r2.cloudflarestorage.com')
text=text.replace('1. Create R2 bucket with Wrangler.', '1. Create R2 bucket with Wrangler. Done: `tpa-teaching-materials`.')
text += '\n\n## Implementation Status\n\nCompleted for Epic 8.1 foundation:\n\n- R2 bucket created: `tpa-teaching-materials`.\n- Installed S3-compatible packages: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`.\n- Added server-only helper: `lib/r2/client.ts`.\n- Added metadata migration: `20260609000008_create_r2_material_library.sql`.\n- Applied Supabase migration with `npx supabase db push`.\n- TypeScript validation passed.\n\nPending before file upload UI:\n\n- Add R2 credentials to `.env.local`.\n- Add R2 credentials to Vercel production env.\n- Never commit `R2_SECRET_ACCESS_KEY`.\n'
p.write_text(text)

p=Path('_bmad-output/implementation-artifacts/sprint-status.yaml')
text=p.read_text()
text=text.replace('last_updated: 2026-06-09T03:00:00','last_updated: 2026-06-09T03:20:00')
text=text.replace('epic-8: backlog','epic-8: in-progress')
text=text.replace('8-1-admin-creates-library-item-with-files: backlog','8-1-r2-material-library-foundation: review')
p.write_text(text)

@'
# Story 8.1: R2 Material Library Foundation

Status: review

## Story

As the system,
I want Teaching Material metadata tables and Cloudflare R2 integration config,
so that uploaded teaching materials are stored privately and controlled by the app.

## Acceptance Criteria

1. R2 bucket exists and is private.
2. Required R2 env vars are documented.
3. Postgres metadata tables exist for library items and files.
4. App has a server-only R2 helper for upload and signed download URL generation.
5. Admin/Tutor access strategy is server-authorized.

## Completion Notes

- Created R2 bucket `tpa-teaching-materials` using Wrangler.
- Added AWS S3-compatible dependencies for Cloudflare R2.
- Added server-only R2 helper at `lib/r2/client.ts`.
- Added migration `20260609000008_create_r2_material_library.sql`.
- Applied migration to Supabase.
- TypeScript validation passed.

## Pending

- Add R2 credentials to local and Vercel env before implementing upload UI.
- Build Story 8.2 Admin upload form.
- Build Story 8.3 Tutor library/download UI.

## File List

- `lib/env.ts`
- `lib/r2/client.ts`
- `supabase/migrations/20260609000008_create_r2_material_library.sql`
- `docs/r2-material-library-plan.md`
- `_bmad-output/implementation-artifacts/8-1-r2-material-library-foundation.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
