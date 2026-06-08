export type TutorRow = {
  id: string
  profileId: string
  phone: string | null
  subjects: string | null
  specialties: string | null
  notes: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type TutorInsert = {
  profileId: string
  phone?: string | null
  subjects?: string | null
  specialties?: string | null
  notes?: string | null
  active?: boolean
}

export type TutorUpdate = Partial<TutorInsert>

export type TutorProfileJoin = TutorRow & {
  profile: {
    id: string
    role: 'tutor'
    fullName: string
    active: boolean
  }
}

export function mapTutorRow(row: {
  id: string
  profile_id: string
  phone: string | null
  subjects: string | null
  specialties: string | null
  notes: string | null
  active: boolean
  created_at: string
  updated_at: string
}): TutorRow {
  return {
    id: row.id,
    profileId: row.profile_id,
    phone: row.phone,
    subjects: row.subjects,
    specialties: row.specialties,
    notes: row.notes,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}