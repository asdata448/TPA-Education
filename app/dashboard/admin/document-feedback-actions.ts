'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'

export type ResolveFeedbackState = { error?: string; success?: string }

export async function resolveDocumentFeedback(_: ResolveFeedbackState, formData: FormData): Promise<ResolveFeedbackState> {
  const feedbackId = String(formData.get('feedbackId') ?? '').trim()
  const decision = String(formData.get('decision') ?? '').trim()
  const adminNote = String(formData.get('adminNote') ?? '').trim() || null
  const rejectReason = String(formData.get('rejectReason') ?? '').trim()

  if (!feedbackId) return { error: 'Feedback item not found.' }
  if (!['done', 'rejected'].includes(decision)) return { error: 'Choose Done or Reject.' }
  if (decision === 'rejected' && !rejectReason) return { error: 'Rejection reason is required.' }

  try {
    const adminProfile = await requireActiveAdmin()
    const admin = createAdminClient()
    const { data: feedback, error: loadError } = await admin.from('document_feedback').select('id,tutor_id,status').eq('id', feedbackId).single()
    if (loadError || !feedback) return { error: loadError?.message || 'Feedback item not found.' }

    const patch = {
      status: decision,
      admin_note: adminNote,
      reject_reason: decision === 'rejected' ? rejectReason : null,
      handled_by_profile_id: adminProfile.id,
      handled_at: new Date().toISOString(),
    }
    const { error: updateError } = await admin.from('document_feedback').update(patch).eq('id', feedbackId)
    if (updateError) return { error: updateError.message }

    const isRejected = decision === 'rejected'
    const { error: notificationError } = await admin.from('notifications').insert({
      tutor_id: feedback.tutor_id,
      feedback_id: feedback.id,
      type: isRejected ? 'document_feedback_rejected' : 'document_feedback_done',
      title: isRejected ? 'Document feedback rejected' : 'Document feedback handled',
      message: isRejected ? `Rejected: ${rejectReason}` : adminNote || 'Admin marked your document feedback as done.',
    })
    if (notificationError) return { error: notificationError.message }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/tutor/document-feedback')
    return { success: isRejected ? 'Feedback rejected.' : 'Feedback marked done.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to resolve feedback.' }
  }
}
