import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'

export type AdminFeedbackItem = {
  id: string
  tutorName: string
  type: string
  message: string
  status: 'pending' | 'done' | 'rejected'
  classLabel: string | null
  libraryTitle: string | null
  rejectReason: string | null
  adminNote: string | null
  handledAt: string | null
  createdAt: string
}

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null
  return Array.isArray(value) ? value[0] ?? null : value
}

export async function getAdminFeedbackItems(): Promise<AdminFeedbackItem[]> {
  await requireActiveAdmin()
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('document_feedback')
    .select('id,type,message,status,reject_reason,admin_note,handled_at,created_at,tutors(id,profiles(full_name)),classes(student_name,student_grade),teaching_material_library_items(title)')
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Unable to load document feedback: ${error.message}`)

  return (data ?? []).map((row: any) => {
    const tutor = pickOne(row.tutors)
    const profile = pickOne(tutor?.profiles)
    const classRow = pickOne(row.classes)
    const libraryRow = pickOne(row.teaching_material_library_items)
    return {
      id: row.id,
      tutorName: profile?.full_name ?? 'Unknown tutor',
      type: row.type,
      message: row.message,
      status: row.status,
      classLabel: classRow ? `${classRow.student_name}${classRow.student_grade ? ` (${classRow.student_grade})` : ''}` : null,
      libraryTitle: libraryRow?.title ?? null,
      rejectReason: row.reject_reason,
      adminNote: row.admin_note,
      handledAt: row.handled_at,
      createdAt: row.created_at,
    }
  })
}
