import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from './classes-data'

export type TutorFeedbackItem = {
  id: string
  kind: 'material_request' | 'material_report'
  message: string
  status: 'pending' | 'done' | 'rejected'
  adminNote: string | null
  rejectReason: string | null
  handledAt: string | null
  libraryTitle: string | null
  createdAt: string
}

export type TutorFeedbackContext = {
  feedback: TutorFeedbackItem[]
}

function mapFeedback(row: any): TutorFeedbackItem {
  const libraryRow = Array.isArray(row.teaching_material_library_items) ? row.teaching_material_library_items[0] : row.teaching_material_library_items
  return {
    id: row.id,
    kind: row.kind,
    message: row.message,
    status: row.status,
    adminNote: row.admin_note,
    rejectReason: row.reject_reason,
    handledAt: row.handled_at,
    libraryTitle: libraryRow?.title ?? null,
    createdAt: row.created_at,
  }
}

export async function getTutorFeedbackContext(): Promise<TutorFeedbackContext> {
  const tutorId = await requireTutorId()
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('document_feedback')
    .select('id,kind,message,status,admin_note,reject_reason,handled_at,created_at,teaching_material_library_items(title)')
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return { feedback: (data ?? []).map(mapFeedback) }
}
