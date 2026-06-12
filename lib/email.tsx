import 'server-only'

import * as React from 'react'
import { render } from '@react-email/render'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

const DEFAULT_APP_URL = 'https://tpaeducation.io.vn'
const SENDER_EMAIL = 'no-reply@tpaeducation.io.vn'
const SENDER_NAME = 'TPA+'

type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
}

export async function getAdminNotificationEmails(): Promise<string[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('email_settings')
      .select('admin_notification_emails')
      .eq('id', true)
      .maybeSingle()
    if (Array.isArray(data?.admin_notification_emails) && data.admin_notification_emails.length > 0) {
      return data.admin_notification_emails
    }
  } catch (e) {
    console.error('Failed to load admin notification emails:', e)
  }
  return []
}

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey) {
    console.warn('BREVO_API_KEY is not configured; skipping email:', subject)
    return
  }

  const recipients = Array.isArray(to) ? to : [to]
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: recipients.map((email) => ({ email })),
      subject,
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Brevo email failed (${response.status}): ${detail}`)
  }
}

export async function sendTutorPasswordChangedEmail(input: { tutorEmail: string; tutorName?: string | null }) {
  await sendEmail({
    to: input.tutorEmail,
    subject: 'Your TPA+ password was changed',
    html: await render(
      <BaseEmail preview="Your TPA+ password was changed" eyebrow="Security alert">
        <StatusPill tone="success">Password updated</StatusPill>
        <Heading style={heading}>Your password was changed</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>
          The password for your TPA+ Tutor account was changed successfully. If you made this change, no further action is needed.
        </Text>
        <NoticeBox tone="warning">
          If this was not you, please contact TPA+ Admin immediately so we can secure your account.
        </NoticeBox>
        <PrimaryButton href={`${appUrl()}/login`}>Open TPA+ Dashboard</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendTutorPasswordResetEmail(input: {
  tutorEmail: string
  tutorName?: string | null
  newPassword: string
}) {
  await sendEmail({
    to: input.tutorEmail,
    subject: 'Your TPA+ password was reset',
    html: await render(
      <BaseEmail preview="Your TPA+ password was reset" eyebrow="Account recovery">
        <StatusPill tone="info">Admin reset</StatusPill>
        <Heading style={heading}>Your password was reset</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>TPA+ Admin has reset your Tutor account password. Use the temporary password below to log in.</Text>
        <Section style={passwordBox}>
          <Text style={passwordLabel}>Temporary password</Text>
          <Text style={passwordValue}>{input.newPassword}</Text>
        </Section>
        <NoticeBox tone="neutral">For security, please change this password after you log in.</NoticeBox>
        <PrimaryButton href={`${appUrl()}/login`}>Log in to TPA+</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendAdminNotificationEmail(input: { subject: string; html: string }) {
  const emails = await getAdminNotificationEmails()
  if (emails.length === 0) {
    console.warn('No admin notification emails configured; skipping notification:', input.subject)
    return
  }
  await sendEmail({ to: emails, subject: input.subject, html: input.html })
}


export async function sendTutorWelcomeEmail(input: { tutorEmail: string; tutorName?: string | null; newPassword: string }) {
  await sendEmail({
    to: input.tutorEmail,
    subject: 'Welcome to TPA+ ? Your Tutor account is ready',
    html: await render(
      <BaseEmail preview="Your TPA+ Tutor account is ready" eyebrow="New account">
        <StatusPill tone="success">Account created</StatusPill>
        <Heading style={heading}>Welcome to TPA+, {input.tutorName || 'Tutor'}!</Heading>
        <Text style={text}>An Admin has created a Tutor account for you. Use the temporary password below to log in for the first time.</Text>
        <Section style={passwordBox}>
          <Text style={passwordLabel}>Temporary password</Text>
          <Text style={passwordValue}>{input.newPassword}</Text>
        </Section>
        <NoticeBox tone="neutral">For security, please change this password after you log in.</NoticeBox>
        <PrimaryButton href={`${appUrl()}/login`}>Log in to TPA+</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendAdminFeedbackReceivedEmail(input: { tutorName?: string | null; kind: string; message: string }) {
  const kindLabel = input.kind === 'material_report' ? 'Library issue report' : 'Material request'
  await sendAdminNotificationEmail({
    subject: `[TPA+] ${kindLabel} from ${input.tutorName || 'Tutor'}`,
    html: await render(
      <BaseEmail preview="New feedback from a Tutor" eyebrow="Action needed">
        <StatusPill tone="info">{kindLabel}</StatusPill>
        <Heading style={heading}>{input.tutorName || 'A Tutor'} submitted feedback</Heading>
        <Text style={text}>Review and resolve this item in the Admin dashboard.</Text>
        <Section style={paperBox}>
          <Text style={paperLabel}>Message</Text>
          <Text style={paperText}>{input.message}</Text>
        </Section>
        <PrimaryButton href={`${appUrl()}/dashboard/admin/document-feedback`}>Open admin queue</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendTutorFeedbackResolvedEmail(input: { tutorEmail: string; tutorName?: string | null; status: 'done' | 'rejected'; adminNote?: string | null; rejectReason?: string | null }) {
  const outcome = input.status === 'done' ? 'completed' : 'rejected'
  await sendEmail({
    to: input.tutorEmail,
    subject: `TPA+ Feedback ${outcome}`,
    html: await render(
      <BaseEmail preview={`Your feedback was ${outcome}`} eyebrow="Feedback update">
        <StatusPill tone={input.status === 'done' ? 'success' : 'info'}>{input.status === 'done' ? 'Completed' : 'Rejected'}</StatusPill>
        <Heading style={heading}>Your feedback was {outcome}</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>
          Admin has reviewed your document feedback.
          {input.status === 'done' ? ' It was marked as completed.' : ' It was not approved.'}
        </Text>
        {input.adminNote && <NoticeBox tone="neutral"><strong>Admin note:</strong> {input.adminNote}</NoticeBox>}
        {input.rejectReason && <NoticeBox tone="warning"><strong>Reason:</strong> {input.rejectReason}</NoticeBox>}
        <PrimaryButton href={`${appUrl()}/dashboard/tutor/document-feedback`}>View feedback</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendAdminClassRequestEmail(input: { tutorName?: string | null; className?: string | null; message?: string | null; requestId: string }) {
  await sendAdminNotificationEmail({
    subject: `[TPA+] Class request from ${input.tutorName || 'Tutor'}`,
    html: await render(
      <BaseEmail preview="New class request from a Tutor" eyebrow="Action needed">
        <StatusPill tone="info">New class request</StatusPill>
        <Heading style={heading}>{input.tutorName || 'A Tutor'} wants to take a class</Heading>
        {input.className && <Text style={text}>Class: <strong>{input.className}</strong></Text>}
        {input.message && <Section style={paperBox}><Text style={paperLabel}>Tutor message</Text><Text style={paperText}>{input.message}</Text></Section>}
        <PrimaryButton href={`${appUrl()}/dashboard/admin`}>Open admin dashboard</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendTutorClassRequestApprovedEmail(input: { tutorEmail: string; tutorName?: string | null; className?: string | null; classId: string }) {
  await sendEmail({
    to: input.tutorEmail,
    subject: `Class request approved ? ${input.className || 'New class'}`,
    html: await render(
      <BaseEmail preview="Your class request was approved" eyebrow="Good news">
        <StatusPill tone="success">Approved</StatusPill>
        <Heading style={heading}>Your class request was approved!</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>
          Admin has approved your request to take <strong>{input.className || 'the class'}</strong>.
          You can now view class details and schedule from your Tutor dashboard.
        </Text>
        <PrimaryButton href={`${appUrl()}/dashboard/tutor/classes/${input.classId}`}>View class</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendTutorClassRequestRejectedEmail(input: { tutorEmail: string; tutorName?: string | null; className?: string | null }) {
  await sendEmail({
    to: input.tutorEmail,
    subject: `Class request update ? ${input.className || 'Class'}`,
    html: await render(
      <BaseEmail preview="Your class request was not approved" eyebrow="Update">
        <StatusPill tone="info">Not approved</StatusPill>
        <Heading style={heading}>Class request update</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>
          Admin did not approve your request for <strong>{input.className || 'the class'}</strong>.
          Other open classes may still be available.
        </Text>
        <PrimaryButton href={`${appUrl()}/dashboard/tutor/open-classes`}>Browse open classes</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendTutorPaymentNotificationEmail(input: { tutorEmail: string; tutorName?: string | null; className?: string | null; amount: number | null }) {
  const formatted = input.amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(input.amount * 0.95) : ''
  await sendEmail({
    to: input.tutorEmail,
    subject: `${formatted ? formatted + ' ? ' : ''}TPA+ payment confirmed`,
    html: await render(
      <BaseEmail preview="Payment confirmed" eyebrow="Finance">
        <StatusPill tone="success">Payment confirmed</StatusPill>
        <Heading style={heading}>Payment received</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>
          Admin has confirmed payment for {input.className ? <strong>{input.className}</strong> : 'one of your classes'}.
          {formatted && <> Amount: <strong>{formatted}</strong> (95% of tuition fee).</>}
        </Text>
        <Text style={text}>You can check payment history in your dashboard.</Text>
        <PrimaryButton href={`${appUrl()}/dashboard/tutor/bank-settings`}>View payment info</PrimaryButton>
      </BaseEmail>
    ),
  })
}


export async function sendTutorClassAssignedEmail(input: { tutorEmail: string; tutorName?: string | null; className?: string | null; classId: string }) {
  await sendEmail({
    to: input.tutorEmail,
    subject: `New class assigned ? ${input.className || 'Class'}`,
    html: await render(
      <BaseEmail preview="A new class was assigned to you" eyebrow="New assignment">
        <StatusPill tone="success">Assigned</StatusPill>
        <Heading style={heading}>You have a new class</Heading>
        <Text style={text}>Hi {input.tutorName || 'Tutor'},</Text>
        <Text style={text}>Admin has assigned you to <strong>{input.className || 'a new class'}</strong>. Please review the class details and schedule.</Text>
        <PrimaryButton href={`${appUrl()}/dashboard/tutor/classes/${input.classId}`}>View class</PrimaryButton>
      </BaseEmail>
    ),
  })
}

export async function sendAdminReportSubmittedEmail(input: { tutorName?: string | null; className?: string | null; reportingMonth: string; reportId: string }) {
  await sendAdminNotificationEmail({
    subject: `[TPA+] Progress report submitted ? ${input.className || input.reportingMonth}`,
    html: await render(
      <BaseEmail preview="A Tutor submitted a progress report" eyebrow="Report submitted">
        <StatusPill tone="info">Monthly report</StatusPill>
        <Heading style={heading}>{input.tutorName || 'A Tutor'} submitted a report</Heading>
        <Text style={text}>A monthly progress report is ready for Admin review.</Text>
        <Section style={paperBox}>
          <Text style={paperLabel}>Report</Text>
          <Text style={paperText}>{input.className || 'Class'} ? {input.reportingMonth}</Text>
        </Section>
        <PrimaryButton href={`${appUrl()}/dashboard/admin/reports`}>Open reports</PrimaryButton>
      </BaseEmail>
    ),
  })
}

function BaseEmail({ preview, eyebrow, children }: { preview: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={topAccent} />
          <Section style={hero}>
            <Img src={`${appUrl()}/logoTPA.png`} alt="TPA+" width="132" style={logo} />
            <Text style={brandLine}>Premium tutoring operations</Text>
          </Section>
          <Section style={content}>
            {eyebrow && <Text style={eyebrowStyle}>{eyebrow}</Text>}
            {children}
          </Section>
          <Section style={footerBar}>
            <Hr style={hr} />
            <Text style={footerTitle}>TPA+ Education</Text>
            <Text style={footerText}>This is an automated notification from TPA+. Please do not reply to this email.</Text>
            <Text style={footerMeta}>no-reply@tpaeducation.io.vn</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button href={href} style={button}>
      {children}
    </Button>
  )
}

function StatusPill({ children, tone }: { children: React.ReactNode; tone: 'success' | 'info' }) {
  return <Text style={{ ...pill, ...(tone === 'success' ? pillSuccess : pillInfo) }}>{children}</Text>
}

function NoticeBox({ children, tone }: { children: React.ReactNode; tone: 'warning' | 'neutral' }) {
  return <Section style={{ ...noticeBox, ...(tone === 'warning' ? noticeWarning : noticeNeutral) }}><Text style={noticeText}>{children}</Text></Section>
}

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_APP_URL
}

const body = {
  margin: 0,
  backgroundColor: '#f3efe6',
  fontFamily: 'Arial, Helvetica, sans-serif',
}

const container = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 16px',
}

const topAccent = {
  height: '8px',
  background: 'linear-gradient(90deg, #0f2a44 0%, #d8b76a 55%, #f4df9c 100%)',
  borderRadius: '24px 24px 0 0',
}

const hero = {
  backgroundColor: '#0f2a44',
  padding: '30px 28px 24px',
  textAlign: 'center' as const,
}

const logo = {
  display: 'block',
  margin: '0 auto 14px',
  borderRadius: '14px',
}

const brandLine = {
  color: '#f8f5ec',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  margin: 0,
  textTransform: 'uppercase' as const,
}

const content = {
  backgroundColor: '#ffffff',
  borderLeft: '1px solid #eadfca',
  borderRight: '1px solid #eadfca',
  padding: '30px 30px 24px',
}

const eyebrowStyle = {
  color: '#b58b2b',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.12em',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
}

const heading = {
  margin: '10px 0 16px',
  color: '#0f2a44',
  fontSize: '28px',
  fontWeight: 800,
  lineHeight: '36px',
}

const text = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 14px',
}

const pill = {
  borderRadius: '999px',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.04em',
  margin: '0 0 4px',
  padding: '7px 12px',
  textTransform: 'uppercase' as const,
}

const pillSuccess = {
  backgroundColor: '#dcfce7',
  color: '#166534',
}

const pillInfo = {
  backgroundColor: '#e0f2fe',
  color: '#075985',
}

const button = {
  backgroundColor: '#d8b76a',
  color: '#0f2a44',
  borderRadius: '999px',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 800,
  marginTop: '12px',
  padding: '13px 22px',
  textDecoration: 'none',
}

const noticeBox = {
  borderRadius: '16px',
  margin: '18px 0',
  padding: '14px 16px',
}

const noticeWarning = {
  backgroundColor: '#fff7ed',
  border: '1px solid #fed7aa',
}

const noticeNeutral = {
  backgroundColor: '#f8f5ec',
  border: '1px solid #eadfca',
}

const noticeText = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '22px',
  margin: 0,
}

const passwordBox = {
  backgroundColor: '#0f2a44',
  borderRadius: '18px',
  margin: '20px 0',
  padding: '20px',
}

const passwordLabel = {
  color: '#f4df9c',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.12em',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
}

const passwordValue = {
  color: '#ffffff',
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '22px',
  fontWeight: 800,
  letterSpacing: '0.06em',
  margin: 0,
}


const paperBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  margin: '18px 0',
  padding: '16px',
}

const paperLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
}

const paperText = {
  color: '#0f172a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
}

const footerBar = {
  backgroundColor: '#ffffff',
  border: '1px solid #eadfca',
  borderTop: 'none',
  borderRadius: '0 0 24px 24px',
  padding: '0 30px 26px',
}

const hr = {
  borderColor: '#eadfca',
  margin: '0 0 20px',
}

const footerTitle = {
  color: '#0f2a44',
  fontSize: '14px',
  fontWeight: 800,
  margin: '0 0 6px',
}

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 6px',
}

const footerMeta = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: 0,
}
