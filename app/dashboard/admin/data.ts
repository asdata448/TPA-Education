import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type AdminProfile = {
  id: string
  role: 'admin'
  active: boolean
}

type JoinedProfile = {
  id: string
  full_name: string
  active: boolean
} | null

export type AdminTutorListItem = {
  tutorId: string
  profileId: string
  fullName: string
  profileActive: boolean
  tutorActive: boolean
  phone: string | null
  subjects: string | null
  specialties: string | null
  updatedAt: string
}

export type AdminTutorDetail = AdminTutorListItem & {
  email: string
  notes: string | null
}

export async function requireActiveAdmin(): Promise<AdminProfile> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role, active')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'admin' || !profile.active) {
    throw new Error('Unauthorized')
  }

  return profile as AdminProfile
}

function toJoinedProfile(value: unknown): JoinedProfile {
  if (!value) return null
  if (Array.isArray(value)) return (value[0] as JoinedProfile) ?? null
  return value as JoinedProfile
}

export async function listTutors(): Promise<AdminTutorListItem[]> {
  await requireActiveAdmin()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tutors')
    .select(
      `
        id,
        profile_id,
        phone,
        subjects,
        specialties,
        active,
        updated_at,
        profiles(id, full_name, active)
      `
    )
    .order('updated_at', { ascending: false })
    .order('id', { ascending: true })

  if (error || !data) {
    throw new Error(`Unable to load tutors: ${error?.message ?? 'Unknown database error'}`)
  }


  return data.map((row) => {
    const profile = toJoinedProfile(row.profiles)

    return {
      tutorId: row.id,
      profileId: row.profile_id,
      fullName: profile?.full_name ?? 'Missing profile',
      profileActive: profile?.active ?? false,
      tutorActive: row.active,
      phone: row.phone,
      subjects: row.subjects,
      specialties: row.specialties,
      updatedAt: row.updated_at,
    }
  })
}

export async function getTutorDetail(tutorId: string): Promise<AdminTutorDetail | null> {
  await requireActiveAdmin()

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tutors')
    .select(
      `
        id,
        profile_id,
        phone,
        subjects,
        specialties,
        notes,
        active,
        updated_at,
        profiles(id, full_name, active)
      `
    )
    .eq('id', tutorId)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load tutor detail: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const { data: authData, error: authError } = await admin.auth.admin.getUserById(data.profile_id)
  if (authError) {
    throw new Error(`Unable to load tutor auth user: ${authError.message}`)
  }

  const profile = toJoinedProfile(data.profiles)

  return {
    tutorId: data.id,
    profileId: data.profile_id,
    fullName: profile?.full_name ?? 'Missing profile',
    email: authData.user?.email ?? 'Missing auth user',
    profileActive: profile?.active ?? false,
    tutorActive: data.active,
    phone: data.phone,
    subjects: data.subjects,
    specialties: data.specialties,
    notes: data.notes,
    updatedAt: data.updated_at,
  }
}


