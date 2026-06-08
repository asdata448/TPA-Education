'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'

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
