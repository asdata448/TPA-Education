---
title: 'Epic 9 Document Feedback Rush MVP'
type: 'feature'
created: '2026-06-10'
status: 'in-review'
baseline_commit: '576bf0dbc3bcfeac3e504c0003c564e7ff6e2981'
context:
  - '_bmad-output/planning-artifacts/epics.md'
  - '_bmad-output/planning-artifacts/architecture-TPA-Education-2026-06-08.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Epic 9 should stay extremely lightweight. Tutors need one simple page to request materials, and one tiny report action inside the material library to report document issues. Admin resolves each item as done or rejected, and Tutors read the result directly in feedback history.

**Approach:** Refactor document feedback into two entry flows: a material-request textarea page and a per-library-item report action. Keep outcomes inside feedback history rather than a separate notification surface.

## Boundaries & Constraints

**Always:** Use `document_feedback` statuses `pending`, `done`, `rejected`; require a rejection reason for reject; store only `kind = material_request | material_report`; keep Tutor submission forms minimal; scope Tutor reads/writes to their own tutor identity; keep Admin as only resolver.

**Ask First:** Adding email/realtime  uploads on feedback, comment threads, priorities/SLA, or assignment workflow.

**Never:** Do not reintroduce material request file fulfillment, do not let Tutors resolve feedback, do not make library files public, do not revert existing uncommitted Epic 8/admin changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tutor requests material | Authenticated active Tutor enters textarea content on `/dashboard/tutor/document-feedback` | `document_feedback` row is created with `kind = material_request` and `pending` | Missing message returns form error |
| Tutor reports library item | Authenticated active Tutor clicks tiny report action on a library item and submits text | `document_feedback` row is created with `kind = material_report` and linked `library_item_id` | Missing message returns form error |
| Admin rejects | Pending feedback exists, reason supplied | status becomes `rejected`, reason stored on the same feedback item | Empty reason returns form error |
| Tutor views history | Tutor has done/rejected outcomes | Tutor sees admin note or reject reason directly in feedback history | Unauthorized user cannot load page |

</frozen-after-approval>

## Code Map

- `supabase/migrations/` -- existing SQL migration pattern with RLS policies and helper functions.
- `app/dashboard/tutor/classes-data.ts` -- active Tutor identity helper.
- `app/dashboard/admin/data.ts` -- active Admin role helper.
- `app/dashboard/admin/page.tsx` -- current Admin dashboard composition.
- `app/dashboard/tutor/page.tsx` -- current Tutor dashboard links.
- `app/dashboard/admin/materials-data.ts` -- data loader shape conventions.
- `app/dashboard/admin/*-actions.ts` and `app/dashboard/tutor/*-actions.ts` -- current server action return-state patterns.

## Tasks & Acceptance

**Execution:**
- [x] `supabase/migrations/20260610000001_create_document_feedback_notifications.sql` and `20260610000002_simplify_document_feedback.sql` -- persist simplified `document_feedback` state with `kind`, no notification UI dependency.
- [x] `app/dashboard/tutor/document-feedback-actions.ts` -- add submit action -- Tutor creates pending feedback.
- [x] `app/dashboard/admin/document-feedback-actions.ts` -- add resolve action -- Admin marks done/rejected and stores result on feedback row.
- [x] `app/dashboard/tutor/document-feedback-data.ts` -- add Tutor feedback history loader -- render Tutor page.
- [x] `app/dashboard/admin/document-feedback-data.ts` -- add Admin loader -- render Admin queue.
- [x] `app/dashboard/tutor/document-feedback/page.tsx` and UI component -- request form + feedback history.
- [x] `app/dashboard/admin/document-feedback-manager.tsx` -- admin resolve UI with done/reject forms.
- [x] `app/dashboard/admin/page.tsx` and `app/dashboard/tutor/page.tsx` -- add links/sections for Epic 9.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- mark Epic 9 stories in review after implementation.

**Acceptance Criteria:**
- Given an active Tutor, when they submit a material request or library issue report, then Admin sees a pending feedback item.
- Given Admin rejects feedback, when no reason is supplied, then the action refuses the reject.
- Given Admin resolves done/rejected, when Tutor opens feedback history, then Tutor sees the admin note or reject reason on that item.
- Given Tutor A exists, when Tutor B opens their page, then Tutor B cannot see Tutor A feedback history.

## Spec Change Log

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: TypeScript passes.
- `npm run build` -- expected: Next.js build succeeds.
- `npm run lint` -- expected: no errors; existing warnings outside Epic 9 may remain.
- `npx supabase db push` -- expected: migration applies successfully.
