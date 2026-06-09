'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from './classes-data'

export type FeedbackActionState = { error?: string; success?: string }

export async function createDocumentFeedback(_: FeedbackActionState, formData: FormData): Promise<FeedbackActionState> {
  const kindInput = String(formData.get('kind') ?? 'material_request').trim()
  const kind = kindInput === 'material_report' ? 'material_report' : 'material_request'
  const message = String(formData.get('message') ?? '').trim()
  const libraryItemId = String(formData.get('libraryItemId') ?? '').trim() || null

  if (message.length < 5) return { error: kind === 'material_report' ? 'Please describe the document issue.' : 'Please describe the material you need.' }
  if (kind === 'material_report' && !libraryItemId) return { error: 'Material item not found.' }

  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()
    const { error } = await admin.from('document_feedback').insert({
      tutor_id: tutorId,
      library_item_id: kind === 'material_report' ? libraryItemId : null,
      kind,
      message,
      status: 'pending',
    })

    if (error) return { error: error.message }
    revalidatePath('/dashboard/tutor/document-feedback')
    revalidatePath('/dashboard/tutor/library')
    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/document-feedback')
    return { success: kind === 'material_report' ? 'Report sent to Admin.' : 'Request sent to Admin.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to send feedback.' }
  }
}
