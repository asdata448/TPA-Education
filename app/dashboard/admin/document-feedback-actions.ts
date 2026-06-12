'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'
import { sendTutorFeedbackResolvedEmail } from '@/lib/email'

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
    const { data: feedback, error: loadError } = await admin.from('document_feedback').select('id,tutor_id,tutors(profile_id,profiles(full_name))').eq('id', feedbackId).single()
    if (loadError || !feedback) return { error: loadError?.message || 'Feedback item not found.' }

    const { error: updateError } = await admin.from('document_feedback').update({
      status: decision,
      admin_note: adminNote,
      reject_reason: decision === 'rejected' ? rejectReason : null,
      handled_by_profile_id: adminProfile.id,
      handled_at: new Date().toISOString(),
    }).eq('id', feedbackId)
    if (updateError) return { error: updateError.message }

    try {
      const tutor = Array.isArray((feedback as any).tutors) ? (feedback as any).tutors[0] : (feedback as any).tutors
      const profile = Array.isArray(tutor?.profiles) ? tutor?.profiles[0] : tutor?.profiles
      const { data: authData } = tutor?.profile_id ? await admin.auth.admin.getUserById(tutor.profile_id) : { data: null as any }
      if (authData?.user?.email) {
        await sendTutorFeedbackResolvedEmail({
          tutorEmail: authData.user.email,
          tutorName: profile?.full_name,
          status: decision as 'done' | 'rejected',
          adminNote,
          rejectReason: decision === 'rejected' ? rejectReason : null,
        })
      }
    } catch (emailError) {
      console.error('Failed to send tutor feedback resolved email:', emailError)
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/document-feedback')
    revalidatePath('/dashboard/tutor/document-feedback')
    revalidatePath('/dashboard/tutor/library')
    return { success: decision === 'rejected' ? 'Feedback rejected.' : 'Feedback marked done.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unable to resolve feedback.' }
  }
}
