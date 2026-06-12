'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'
import { sendTutorPasswordResetEmail, sendTutorWelcomeEmail } from '@/lib/email'

export type CreateTutorState = {
  error?: string
  password?: string
  email?: string
}

export type UpdateTutorState = {
  error?: string
  success?: string
}


function generatedPassword() {
  return `${randomBytes(9).toString('base64url')}aA7!`
}

export async function createTutor(
  _previousState: CreateTutorState,
  formData: FormData
): Promise<CreateTutorState> {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const phone = String(formData.get('phone') ?? '').trim() || null
  const subjects = String(formData.get('subjects') ?? '').trim() || null
  const specialties = String(formData.get('specialties') ?? '').trim() || null
  const notes = String(formData.get('notes') ?? '').trim() || null

  if (!fullName || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: 'Enter a valid name and email address.' }
  }

  try {
    await requireActiveAdmin()
  } catch {
    return { error: 'Only active Admin users can create Tutor accounts.' }
  }

  try {
    const admin = createAdminClient()
    const password = generatedPassword()
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      const duplicate = authError?.message.toLowerCase().includes('already')
      return { error: duplicate ? 'A Tutor account with this email already exists.' : 'Unable to create Tutor account.' }
    }

    const profileId = authData.user.id
    const { error: profileError } = await admin.from('profiles').insert({
      id: profileId,
      role: 'tutor',
      full_name: fullName,
      active: true,
    })

    const { error: tutorError } = profileError
      ? { error: null }
      : await admin.from('tutors').insert({
          profile_id: profileId,
          phone,
          subjects,
          specialties,
          notes,
          active: true,
        })

    if (profileError || tutorError) {
      await admin.auth.admin.deleteUser(profileId)
      return { error: 'Unable to save Tutor profile. No account was created.' }
    }

    try {
      await sendTutorWelcomeEmail({ tutorEmail: email, tutorName: fullName, newPassword: password })
    } catch (emailError) {
      console.error('Failed to send tutor welcome email:', emailError)
    }

    revalidatePath('/dashboard/admin')
    return { password, email }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unexpected Tutor creation error.' }
  }
}

export async function updateTutor(
  _previousState: UpdateTutorState,
  formData: FormData
): Promise<UpdateTutorState> {
  const tutorId = String(formData.get('tutorId') ?? '').trim()
  const profileId = String(formData.get('profileId') ?? '').trim()
  const fullName = String(formData.get('fullName') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim() || null
  const subjects = String(formData.get('subjects') ?? '').trim() || null
  const specialties = String(formData.get('specialties') ?? '').trim() || null
  const notes = String(formData.get('notes') ?? '').trim() || null
  const active = formData.get('active') === 'on'

  if (!tutorId || !profileId || !fullName) {
    return { error: 'Full name is required.' }
  }

  try {
    await requireActiveAdmin()
  } catch {
    return { error: 'Only active Admin users can update Tutor accounts.' }
  }

  const admin = createAdminClient()
  const { error: profileError } = await admin
    .from('profiles')
    .update({ full_name: fullName, active })
    .eq('id', profileId)
    .eq('role', 'tutor')

  const { error: tutorError } = profileError
    ? { error: null }
    : await admin
        .from('tutors')
        .update({ phone, subjects, specialties, notes, active })
        .eq('id', tutorId)
        .eq('profile_id', profileId)

  if (profileError || tutorError) {
    return { error: 'Unable to update Tutor profile.' }
  }

  revalidatePath('/dashboard/admin')
  revalidatePath(`/dashboard/admin/tutors/${tutorId}`)
  return { success: 'Tutor profile updated.' }
}

export type ResetTutorPasswordState = {
  error?: string
  password?: string
  success?: string
}

export async function resetTutorPassword(
  profileId: string
): Promise<ResetTutorPasswordState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()
    const newPassword = generatedPassword()

    const { data: authData, error: loadUserError } = await admin.auth.admin.getUserById(profileId)
    if (loadUserError || !authData.user?.email) {
      throw new Error(loadUserError?.message || 'Unable to load Tutor email.')
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('full_name')
      .eq('id', profileId)
      .eq('role', 'tutor')
      .maybeSingle()

    const { error } = await admin.auth.admin.updateUserById(profileId, {
      password: newPassword,
    })

    if (error) throw new Error(error.message)

    try {
      await sendTutorPasswordResetEmail({
        tutorEmail: authData.user.email,
        tutorName: profile?.full_name,
        newPassword,
      })
    } catch (emailError) {
      console.error('Failed to send tutor password reset email:', emailError)
    }

    return {
      success: 'Mật khẩu mới đã được khởi tạo thành công!',
      password: newPassword,
    }
  } catch (error: any) {
    return { error: error.message || 'Không thể đặt lại mật khẩu.' }
  }
}


export type DeleteTutorState = {
  error?: string
}

export async function deleteTutor(
  _previousState: DeleteTutorState,
  formData: FormData
): Promise<DeleteTutorState> {
  const tutorId = String(formData.get('tutorId') ?? '').trim()
  const profileId = String(formData.get('profileId') ?? '').trim()
  const confirmText = String(formData.get('confirmText') ?? '').trim()

  if (!tutorId || !profileId) {
    return { error: 'Missing Tutor identity.' }
  }

  if (confirmText !== 'DELETE') {
    return { error: 'Type DELETE to confirm permanent deletion.' }
  }

  try {
    await requireActiveAdmin()
  } catch {
    return { error: 'Only active Admin users can delete Tutor accounts.' }
  }

  const admin = createAdminClient()
  const { data: tutor, error: tutorError } = await admin
    .from('tutors')
    .select('id, profile_id')
    .eq('id', tutorId)
    .eq('profile_id', profileId)
    .maybeSingle()

  if (tutorError || !tutor) {
    return { error: 'Tutor account not found.' }
  }

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', profileId)
    .maybeSingle()

  if (profileError || profile?.role !== 'tutor') {
    return { error: 'Only Tutor accounts can be deleted from this screen.' }
  }

  const { error: unassignError } = await admin
    .from('classes')
    .update({ tutor_id: null, status: 'open' })
    .eq('tutor_id', tutorId)

  if (unassignError) {
    return { error: `Unable to unassign Tutor classes before deletion: ${unassignError.message}` }
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(profileId)
  if (deleteError) {
    console.error('Failed to delete Tutor auth user:', deleteError)
    return { error: deleteError.message || 'Unable to delete Tutor account.' }
  }

  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/admin/tutors')
  redirect('/dashboard/admin/tutors')
}
