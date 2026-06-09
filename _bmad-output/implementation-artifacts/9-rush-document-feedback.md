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

**Problem:** Epic 9 was simplified from a material fulfillment workflow into a lightweight Tutor-to-Admin document feedback flow. Tutors need to request documents or report wrong/missing/broken documents; Admin needs to resolve each item as done or rejected; Tutors need a notification when it is resolved.

**Approach:** Add DB tables, server actions, data loaders, and dashboard UI for document feedback and resolution notifications, following existing app/dashboard server-action patterns and no separate REST API.

## Boundaries & Constraints

**Always:** Use `document_feedback` statuses `pending`, `done`, `rejected`; require a rejection reason for reject; create Tutor notification on done/rejected; scope Tutor reads/writes to their own tutor identity; keep Admin as only resolver.

**Ask First:** Adding email/realtime notifications, uploads on feedback, comment threads, priorities/SLA, or assignment workflow.

**Never:** Do not reintroduce material request file fulfillment, do not let Tutors resolve feedback, do not make library files public, do not revert existing uncommitted Epic 8/admin changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tutor submits feedback | Authenticated active Tutor selects type and message, optional class/library item | `document_feedback` row is created with `pending`; admin dashboard can see it | Missing type/message returns form error |
| Admin marks done | Pending feedback exists | status becomes `done`, handled metadata stored, notification created for owning Tutor | Missing feedback returns action error |
| Admin rejects | Pending feedback exists, reason supplied | status becomes `rejected`, reason stored, notification created including reason | Empty reason returns form error |
| Tutor views notifications | Tutor has done/rejected outcomes | Tutor sees own notifications and related feedback history | Unauthorized user cannot load page |

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
- [x] `supabase/migrations/20260610000001_create_document_feedback_notifications.sql` -- add `document_feedback`, `notifications`, indexes, updated_at trigger, and RLS -- persist Epic 9 state safely.
- [x] `app/dashboard/tutor/document-feedback-actions.ts` -- add submit action -- Tutor creates pending feedback.
- [x] `app/dashboard/admin/document-feedback-actions.ts` -- add resolve action -- Admin marks done/rejected and creates notification.
- [x] `app/dashboard/tutor/document-feedback-data.ts` -- add Tutor loaders for classes, library items, feedback, notifications -- render Tutor page.
- [x] `app/dashboard/admin/document-feedback-data.ts` -- add Admin loader -- render Admin queue.
- [x] `app/dashboard/tutor/document-feedback/page.tsx` and UI component -- form + feedback/notification history.
- [x] `app/dashboard/admin/document-feedback-manager.tsx` -- admin resolve UI with done/reject forms.
- [x] `app/dashboard/admin/page.tsx` and `app/dashboard/tutor/page.tsx` -- add links/sections for Epic 9.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- mark Epic 9 stories in review after implementation.

**Acceptance Criteria:**
- Given an active Tutor, when they submit type/message, then Admin sees a pending feedback item.
- Given Admin rejects feedback, when no reason is supplied, then the action refuses the reject.
- Given Admin resolves done/rejected, when Tutor opens feedback page, then Tutor sees a notification outcome.
- Given Tutor A exists, when Tutor B opens their page, then Tutor B cannot see Tutor A feedback or notifications.

## Spec Change Log

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: TypeScript passes.
- `npm run build` -- expected: Next.js build succeeds.
- `npm run lint` -- expected: no errors; existing warnings outside Epic 9 may remain.
- `npx supabase db push` -- expected: migration applies successfully.
