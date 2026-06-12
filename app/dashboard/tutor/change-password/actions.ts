'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireTutorId } from '../classes-data'
import { sendTutorPasswordChangedEmail } from '@/lib/email'

export type ChangePasswordState = {
  error?: string
  success?: string
}

const MIN_PASSWORD_LENGTH = 8

export async function changeTutorPassword(
  _previousState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get('currentPassword') ?? '')
  const newPassword = String(formData.get('newPassword') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Please fill in all password fields.' }
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New password and confirmation do not match.' }
  }

  if (newPassword === currentPassword) {
    return { error: 'New password must be different from the current password.' }
  }

  try {
    await requireTutorId()

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user?.email) {
      return { error: 'Your session has expired. Please log in again.' }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      return { error: 'Current password is incorrect.' }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      return { error: updateError.message || 'Unable to update password.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    try {
      await sendTutorPasswordChangedEmail({
        tutorEmail: user.email,
        tutorName: profile?.full_name,
      })
    } catch (emailError) {
      console.error('Failed to send tutor password changed email:', emailError)
    }

    revalidatePath('/dashboard/tutor/change-password')
    return { success: 'Password changed successfully.' }
  } catch {
    return { error: 'Only active Tutor users can change their password.' }
  }
}
