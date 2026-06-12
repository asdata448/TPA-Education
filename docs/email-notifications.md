# Email Notifications

## Overview

TPA-Education uses Brevo Transactional Email for operational notifications. Email sending is server-only and is wrapped by `lib/email.tsx`, which renders maintainable React Email templates and sends the resulting HTML through the Brevo REST API.

Notifications are intentionally non-blocking: if Brevo is unavailable or an API key is missing, the primary product action still succeeds and the error is logged with `console.error` / `console.warn`.

## Provider and Sender

| Item | Value |
| --- | --- |
| Provider | Brevo Transactional Email API |
| REST endpoint | `https://api.brevo.com/v3/smtp/email` |
| Sender name | `TPA+` |
| Sender email | `no-reply@tpaeducation.io.vn` |
| Primary helper | `sendEmail({ to, subject, html })` |
| React Email templates | `lib/email.tsx` |
| Logo asset | `public/logoTPA.png` |
| Logo URL in email | `${NEXT_PUBLIC_APP_URL}/logoTPA.png` |

## Environment Variables

Required for actual sending:

```bash
BREVO_API_KEY=<brevo-transactional-api-key>
NEXT_PUBLIC_APP_URL=https://tpaeducation.io.vn
```

If `BREVO_API_KEY` is missing, `sendEmail()` logs a warning and skips sending. This is expected in local environments where email is not being tested.

## Admin Recipient Settings

Admin notification recipients are not hardcoded. They are stored in Supabase:

| Property | Value |
| --- | --- |
| Table | `public.email_settings` |
| Singleton row | `id = true` |
| Column | `admin_notification_emails text[]` |
| Admin UI | `/dashboard/admin/settings` |
| Migration | `supabase/migrations/20260612000001_create_email_settings.sql` |

Initial seed values:

```text
tameanhanh@gmail.com
phuchcm2006@gmail.com
```

Only active Admin users can read/update settings through RLS. Server-side notification sending reads this table using the service-role client because some notification triggers are executed by Tutor actions.

## Template Inventory

All templates live in `lib/email.tsx`. Each template renders a branded HTML email with:
- TPA+ gradient accent bar (navy → gold)
- Logo and brand line
- Status pill (success/info)
- Body content with CTA button
- Footer with no-reply notice

### Tutor-facing Emails

| Function | Trigger | Content |
| --- | --- | --- |
| `sendTutorWelcomeEmail` | Admin creates new Tutor | Welcome message + temporary password |
| `sendTutorPasswordResetEmail` | Admin resets Tutor password | New temporary password |
| `sendTutorPasswordChangedEmail` | Tutor changes own password | Security alert (no password content) |
| `sendTutorClassRequestApprovedEmail` | Admin approves class request | Class name + link to class detail |
| `sendTutorClassRequestRejectedEmail` | Admin rejects class request | Links to open classes |
| `sendTutorClassAssignedEmail` | Admin creates class with Tutor | Class name + link to class detail |
| `sendTutorFeedbackResolvedEmail` | Admin resolves document feedback | Status (done/rejected) + admin note |
| `sendTutorPaymentNotificationEmail` | Admin confirms Tutor payment | Amount (95% of tuition) + link to bank settings |

### Admin-facing Emails

| Function | Trigger | Content |
| --- | --- | --- |
| `sendAdminClassRequestEmail` | Tutor requests open class | Tutor name + class name + message |
| `sendAdminFeedbackReceivedEmail` | Tutor submits feedback | Feedback type + message |
| `sendAdminReportSubmittedEmail` | Tutor saves progress report | Class name + reporting month |

## Trigger Matrix

| Product Event | Action File | Email Function | Recipient |
| --- | --- | --- | --- |
| Admin creates Tutor | `app/dashboard/admin/actions.ts` | `sendTutorWelcomeEmail` | Tutor |
| Admin resets Tutor password | `app/dashboard/admin/actions.ts` | `sendTutorPasswordResetEmail` | Tutor |
| Tutor changes own password | `app/dashboard/tutor/change-password/actions.ts` | `sendTutorPasswordChangedEmail` | Tutor |
| Tutor requests open class | `app/dashboard/tutor/class-actions.ts` | `sendAdminClassRequestEmail` | Admin |
| Admin approves class request | `app/dashboard/admin/class-actions.ts` | `sendTutorClassRequestApprovedEmail` | Tutor |
| Admin rejects class request | `app/dashboard/admin/class-actions.ts` | `sendTutorClassRequestRejectedEmail` | Tutor |
| Admin creates assigned class | `app/dashboard/admin/class-actions.ts` | `sendTutorClassAssignedEmail` | Tutor |
| Tutor submits material request/report | `app/dashboard/tutor/document-feedback-actions.ts` | `sendAdminFeedbackReceivedEmail` | Admin |
| Admin resolves document feedback | `app/dashboard/admin/document-feedback-actions.ts` | `sendTutorFeedbackResolvedEmail` | Tutor |
| Tutor saves progress report | `app/dashboard/tutor/reports/report-actions.ts` | `sendAdminReportSubmittedEmail` | Admin |
| Tutor saves progress report (class detail) | `app/dashboard/tutor/classes/[classId]/report-actions.ts` | `sendAdminReportSubmittedEmail` | Admin |
| Admin confirms Tutor paid | `app/dashboard/admin/finance/finance-actions.ts` | `sendTutorPaymentNotificationEmail` | Tutor |

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

---

## Testing Guide

### Prerequisites

1. **Brevo account** with a verified sender domain (`tpaeducation.io.vn`)
2. **Brevo API key** (Transactional section → SMTP & API → API Keys)
3. **Admin email recipients** configured at `/dashboard/admin/settings`

### Step-by-Step: Configure Admin Recipients

1. Login as Admin at `https://tpaeducation.io.vn/login`
2. Navigate to **Settings** (`/dashboard/admin/settings`)
3. In the **Admin Notification Emails** textarea, enter one email per line:
   ```
   admin1@gmail.com
   admin2@gmail.com
   ```
4. Click **Save email settings**
5. Confirm the green success message appears

### Step-by-Step: Test Each Notification

#### Test 1: Tutor Welcome Email
1. Login as Admin → `/dashboard/admin`
2. Click **Create Tutor**
3. Fill in Tutor name, email, phone
4. Submit → The Tutor receives a welcome email with temporary password

#### Test 2: Tutor Password Reset Email
1. Login as Admin → `/dashboard/admin`
2. Find an existing Tutor → Click to open detail page
3. Click **Reset Password**
4. Confirm → The Tutor receives an email with the new temporary password

#### Test 3: Tutor Password Changed Email
1. Login as Tutor → `/dashboard/tutor`
2. Navigate to **Change Password** (`/dashboard/tutor/change-password`)
3. Enter current password, new password, confirm
4. Submit → The Tutor receives a security alert email

#### Test 4: Admin Class Request Email
1. Login as Tutor → `/dashboard/tutor`
2. Navigate to **Open Classes** (`/dashboard/tutor/open-classes`)
3. Click **Request** on an open class
4. Optionally add a message → Submit
5. Check Admin recipient inbox for `[TPA+] Class request from ...`

#### Test 5: Admin Feedback Received Email
1. Login as Tutor → `/dashboard/tutor`
2. Navigate to **Document Feedback** (`/dashboard/tutor/document-feedback`)
3. Submit a new material request or library issue report
4. Check Admin recipient inbox for `[TPA+] Material request from ...` or `[TPA+] Library issue report from ...`

#### Test 6: Admin Report Submitted Email
1. Login as Tutor → `/dashboard/tutor`
2. Navigate to **Reports** (`/dashboard/tutor/reports`)
3. Create or edit a monthly progress report
4. Save → Check Admin recipient inbox for `[TPA+] Progress report submitted ...`

#### Test 7: Tutor Feedback Resolved Email
1. Login as Admin → `/dashboard/admin/document-feedback`
2. Find a pending feedback item
3. Mark as **Done** or **Rejected** (with optional note)
4. Submit → The Tutor receives a feedback update email

#### Test 8: Tutor Payment Notification Email
1. Login as Admin → `/dashboard/admin/finance`
2. Find a Tutor with unpaid status
3. Mark payment as **Paid**
4. Submit → The Tutor receives a payment confirmation email with amount

### Verifying Delivery

1. **Brevo Dashboard**: Login at https://app.brevo.com → Transactional → Logs
   - Filter by date range and email address
   - Status: `delivered`, `sent`, `bounced`, `error`
2. **Vercel Logs**: `vercel logs --environment production --level error`
   - Look for `Failed to send ... email:` messages
3. **Recipient Inbox**: Check spam/junk folder if not in inbox

### Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| No email sent, no error log | `BREVO_API_KEY` missing | Add to Vercel env / `.env.local` |
| `401 Unauthorized` from Brevo | Invalid API key | Regenerate key in Brevo dashboard |
| `550 Sender rejected` | Domain not verified in Brevo | Setup DNS records for `tpaeducation.io.vn` |
| Email sent but not received | Spam filter | Check Brevo logs for `bounced`; check spam folder |
| Admin not getting notifications | No recipients configured | Visit `/dashboard/admin/settings` and save |
| Wrong amount in payment email | `amount` is null | Check `class_payments` record has non-null `tuition_fee` |

---

## Deployment Notes

The project uses `pnpm-lock.yaml` as the canonical lockfile. Avoid committing `package-lock.json`; Vercel detects pnpm and uses `pnpm install`.

**Important pnpm strict mode:** All packages that are directly imported in source code must be listed as direct dependencies in `package.json`. pnpm does not hoist transitive dependencies. For example, `@react-email/render` is used by `lib/email.tsx` and must be a direct dependency even though it is also a sub-dependency of `react-email`.
