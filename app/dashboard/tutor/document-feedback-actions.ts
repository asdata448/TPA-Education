'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from './classes-data'

export type FeedbackActionState = { error?: string; success?: string }
const ALLOWED_TYPES = new Set(['request_material', 'wrong_material', 'missing_material', 'broken_file', 'other'])

export async function createDocumentFeedback(_: FeedbackActionState, formData: FormData): Promise<FeedbackActionState> {
  const type = String(formData.get('type') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const classId = String(formData.get('classId') ?? '').trim() || null
  const libraryItemId = String(formData.get('libraryItemId') ?? '').trim() || null

  if (!ALLOWED_TYPES.has(type)) return { error: 'Choose a valid feedback type.' }
  if (message.length < 5) return { error: 'Please describe the request or issue.' }

  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()
    const { error } = await admin.from('document_feedback').insert({
      tutor_id: tutorId,
      class_id: classId,
      library_item_id: libraryItemId,
      type,
      message,
      status: 'pending',
    })

    if (error) return { error: error.message }
    revalidatePath('/dashboard/tutor/document-feedback')
    revalidatePath('/dashboard/admin')
    return { success: 'Feedback sent to Admin.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to send feedback.' }
  }
}
