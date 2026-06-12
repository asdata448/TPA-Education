'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from '../data'

export type EmailSettings = {
  adminNotificationEmails: string[]
}

export type EmailSettingsState = {
  error?: string
  success?: string
}

export async function getEmailSettings(): Promise<EmailSettings> {
  await requireActiveAdmin()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('email_settings')
    .select('admin_notification_emails')
    .eq('id', true)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load email settings: ${error.message}`)
  }

  return {
    adminNotificationEmails: Array.isArray(data?.admin_notification_emails)
      ? data.admin_notification_emails
      : [],
  }
}

export async function updateEmailSettings(
  _previousState: EmailSettingsState,
  formData: FormData
): Promise<EmailSettingsState> {
  try {
    await requireActiveAdmin()
  } catch {
    return { error: 'Only active Admin users can update email settings.' }
  }

  const emails = parseEmailList(String(formData.get('adminNotificationEmails') ?? ''))

  if (emails.length === 0) {
    return { error: 'Enter at least one admin notification email.' }
  }

  const invalid = emails.find((email) => !/^\S+@\S+\.\S+$/.test(email))
  if (invalid) {
    return { error: `Invalid email address: ${invalid}` }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('email_settings')
    .upsert({ id: true, admin_notification_emails: emails }, { onConflict: 'id' })

  if (error) {
    return { error: 'Unable to save email settings.' }
  }

  revalidatePath('/dashboard/admin/settings')
  return { success: 'Email settings saved.' }
}

function parseEmailList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,;]/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    )
  )
}
