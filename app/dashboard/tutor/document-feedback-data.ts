import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from './classes-data'

export type TutorFeedbackItem = {
  id: string
  type: string
  message: string
  status: 'pending' | 'done' | 'rejected'
  adminNote: string | null
  rejectReason: string | null
  handledAt: string | null
  classLabel: string | null
  libraryTitle: string | null
  createdAt: string
}

export type TutorNotificationItem = {
  id: string
  type: 'document_feedback_done' | 'document_feedback_rejected'
  title: string
  message: string
  createdAt: string
}

export type TutorFeedbackContext = {
  classes: Array<{ id: string; label: string }>
  libraryItems: Array<{ id: string; title: string }>
  feedback: TutorFeedbackItem[]
  notifications: TutorNotificationItem[]
}

function mapFeedback(row: any): TutorFeedbackItem {
  const classRow = Array.isArray(row.classes) ? row.classes[0] : row.classes
  const libraryRow = Array.isArray(row.teaching_material_library_items) ? row.teaching_material_library_items[0] : row.teaching_material_library_items
  return {
    id: row.id,
    type: row.type,
    message: row.message,
    status: row.status,
    adminNote: row.admin_note,
    rejectReason: row.reject_reason,
    handledAt: row.handled_at,
    classLabel: classRow ? `${classRow.student_name}${classRow.student_grade ? ` (${classRow.student_grade})` : ''}` : null,
    libraryTitle: libraryRow?.title ?? null,
    createdAt: row.created_at,
  }
}

export async function getTutorFeedbackContext(): Promise<TutorFeedbackContext> {
  const tutorId = await requireTutorId()
  const admin = createAdminClient()

  const [classesResult, libraryResult, feedbackResult, notificationsResult] = await Promise.all([
    admin.from('classes').select('id,student_name,student_grade').eq('tutor_id', tutorId).order('updated_at', { ascending: false }),
    admin.from('teaching_material_library_items').select('id,title').eq('active', true).order('created_at', { ascending: false }),
    admin
      .from('document_feedback')
      .select('id,type,message,status,admin_note,reject_reason,handled_at,created_at,classes(student_name,student_grade),teaching_material_library_items(title)')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false }),
    admin
      .from('notifications')
      .select('id,type,title,message,created_at')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (classesResult.error || libraryResult.error || feedbackResult.error || notificationsResult.error) {
    throw new Error(classesResult.error?.message || libraryResult.error?.message || feedbackResult.error?.message || notificationsResult.error?.message || 'Unable to load document feedback data')
  }

  return {
    classes: (classesResult.data ?? []).map((row) => ({ id: row.id, label: `${row.student_name}${row.student_grade ? ` (${row.student_grade})` : ''}` })),
    libraryItems: (libraryResult.data ?? []).map((row) => ({ id: row.id, title: row.title })),
    feedback: (feedbackResult.data ?? []).map(mapFeedback),
    notifications: (notificationsResult.data ?? []).map((row) => ({ id: row.id, type: row.type, title: row.title, message: row.message, createdAt: row.created_at })),
  }
}
