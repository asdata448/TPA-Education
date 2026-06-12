# Email Notifications

## Overview

TPA-Education uses Brevo Transactional Email for operational notifications. Email sending is server-only and is wrapped by `lib/email.tsx`, which renders maintainable React Email templates and sends the resulting HTML through the Brevo REST API.

Notifications are intentionally non-blocking: if Brevo is unavailable or an API key is missing, the primary product action still succeeds and the error is logged with `console.error` / `console.warn`.

## Provider and Sender

- Provider: Brevo Transactional Email API
- Sender name: `TPA+`
- Sender email: `no-reply@tpaeducation.io.vn`
- Primary helper: `sendEmail({ to, subject, html })`
- React Email templates: `lib/email.tsx`
- Logo asset: `public/logoTPA.png`
- Logo URL in email: `${NEXT_PUBLIC_APP_URL || 'https://tpaeducation.io.vn'}/logoTPA.png`

## Environment Variables

Required for actual sending:

```bash
BREVO_API_KEY=<brevo-transactional-api-key>
NEXT_PUBLIC_APP_URL=https://tpaeducation.io.vn
```

If `BREVO_API_KEY` is missing, `sendEmail()` logs and skips sending. This is expected in local environments where email is not being tested.

## Admin Recipient Settings

Admin notification recipients are not hardcoded. They are stored in Supabase:

- Table: `public.email_settings`
- Singleton row: `id = true`
- Column: `admin_notification_emails text[]`
- Admin UI: `/dashboard/admin/settings`

Migration:

```text
supabase/migrations/20260612000001_create_email_settings.sql
```

Initial seed values:

```text
tameanhanh@gmail.com
phuchcm2006@gmail.com
```

Only active Admin users can read/update settings through RLS. Server-side notification sending reads this table using the service-role client because some notification triggers are executed by Tutor actions.

## Template Inventory

All templates live in `lib/email.tsx`.

| Function | Recipient | Purpose |
| --- | --- | --- |
| `sendTutorWelcomeEmail` | Tutor | New Tutor account created; includes temporary password. |
| `sendTutorPasswordResetEmail` | Tutor | Admin reset Tutor password; includes temporary password. |
| `sendTutorPasswordChangedEmail` | Tutor | Tutor self-service password change security alert. |
| `sendAdminClassRequestEmail` | Admin recipients | Tutor requested to take an open class. |
| `sendTutorClassRequestApprovedEmail` | Tutor | Admin approved a Tutor class request. |
| `sendTutorClassRequestRejectedEmail` | Tutor | Admin rejected a Tutor class request. |
| `sendTutorClassAssignedEmail` | Tutor | Admin directly assigned Tutor when creating a class. |
| `sendAdminFeedbackReceivedEmail` | Admin recipients | Tutor submitted material request or library issue report. |
| `sendTutorFeedbackResolvedEmail` | Tutor | Admin marked feedback done/rejected. |
| `sendAdminReportSubmittedEmail` | Admin recipients | Tutor submitted/saved monthly progress report. |
| `sendTutorPaymentNotificationEmail` | Tutor | Admin confirmed Tutor payment for a class billing month. |

## Trigger Matrix

| Product event | Action file | Email function | Notes |
| --- | --- | --- | --- |
| Admin creates Tutor | `app/dashboard/admin/actions.ts` | `sendTutorWelcomeEmail` | Sends generated temporary password. |
| Admin resets Tutor password | `app/dashboard/admin/actions.ts` | `sendTutorPasswordResetEmail` | Password is still shown once in Admin UI and emailed to Tutor. |
| Tutor changes own password | `app/dashboard/tutor/change-password/actions.ts` | `sendTutorPasswordChangedEmail` | Security alert only; no password content. |
| Tutor requests open class | `app/dashboard/tutor/class-actions.ts` | `sendAdminClassRequestEmail` | Sent to configured Admin recipients. |
| Admin approves class request | `app/dashboard/admin/class-actions.ts` | `sendTutorClassRequestApprovedEmail` | Links to assigned class detail. |
| Admin rejects class request | `app/dashboard/admin/class-actions.ts` | `sendTutorClassRequestRejectedEmail` | Links to open classes. |
| Admin creates assigned class | `app/dashboard/admin/class-actions.ts` | `sendTutorClassAssignedEmail` | Only fires when class is created with a specific Tutor, not open. |
| Tutor submits material request/report | `app/dashboard/tutor/document-feedback-actions.ts` | `sendAdminFeedbackReceivedEmail` | Sent to Admin recipients. |
| Admin resolves document feedback | `app/dashboard/admin/document-feedback-actions.ts` | `sendTutorFeedbackResolvedEmail` | Includes admin note/rejection reason when present. |
| Tutor saves progress report | `app/dashboard/tutor/reports/report-actions.ts` and `app/dashboard/tutor/classes/[classId]/report-actions.ts` | `sendAdminReportSubmittedEmail` | Sent to Admin recipients for review. |
| Admin confirms Tutor paid | `app/dashboard/admin/finance/finance-actions.ts` | `sendTutorPaymentNotificationEmail` | Sent after tutor payment status becomes `paid`. |

## Non-Blocking Error Policy

Every email trigger must use this pattern:

```ts
try {
  await sendSomeEmail(...)
} catch (emailError) {
  console.error('Failed to send ... email:', emailError)
}
```

Do not roll back business actions due to email delivery failure. Example: password changes and class approvals should remain successful even if Brevo rejects the email.

## Security Notes

- `BREVO_API_KEY` is server-only. Never expose it to browser code and never prefix it with `NEXT_PUBLIC_`.
- Password emails are intentionally enabled for this MVP because Admin requested convenience over invitation links.
- Generated password emails should be treated as sensitive. Future improvement: replace password email with Supabase invite/recovery links.
- Admin recipients are managed in the database, not code, to avoid redeploys for recipient changes.

## Current Non-Scope

The PRD/addendum says automatic parent report delivery is deferred. Therefore:

- No automatic email to parents when a progress report is saved.
- Parent-facing delivery remains manual/public-link based for now.
- Parent notifications can be added later when Parent records/workflows are reintroduced.

## Manual Test Plan

### Local

1. Add `BREVO_API_KEY` to `.env.local`.
2. Set `NEXT_PUBLIC_APP_URL=http://localhost:3000` or the deployed URL if testing logo rendering.
3. Restart `pnpm dev`.
4. Trigger any notification flow.
5. Check recipient inbox and Brevo Transactional logs.

### Production

1. Ensure Vercel Production env includes:
   - `BREVO_API_KEY`
   - `NEXT_PUBLIC_APP_URL=https://tpaeducation.io.vn`
2. Deploy production.
3. Open `/dashboard/admin/settings` and confirm Admin recipients.
4. Test:
   - Tutor password reset
   - Tutor request open class
   - Tutor document feedback
   - Tutor progress report save
5. Check Brevo Transactional logs for accepted/delivered/bounced status.

## Deployment Notes

The project now uses `pnpm-lock.yaml` as the canonical lockfile. Avoid committing `package-lock.json`; Vercel detects pnpm and uses `pnpm install`.
