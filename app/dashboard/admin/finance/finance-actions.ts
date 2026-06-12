'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from '../data'
import { createTeachingMaterialDownloadUrl } from '@/lib/r2/client'
import { sendTutorPaymentNotificationEmail } from '@/lib/email'

export type FinanceActionState = { error?: string; success?: string }

export async function getFinanceData(billingMonth: string) {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    // 1. Get all assigned classes
    const { data: classes, error: classesError } = await admin
      .from('classes')
      .select(`
        id,
        student_name,
        student_grade,
        parent_name,
        parent_phone,
        tuition_fee,
        subjects(name),
        tutors(
          id,
          bank_name,
          bank_account_no,
          bank_account_name,
          bank_qr_key,
          profiles(full_name)
        )
      `)
      .eq('status', 'assigned')

    if (classesError) throw new Error(classesError.message)

    // 2. Get payment records for this month
    const { data: payments, error: paymentsError } = await admin
      .from('class_payments')
      .select('*')
      .eq('billing_month', billingMonth)

    if (paymentsError) throw new Error(paymentsError.message)

    // Match payments to classes and generate signed QR urls
    const paymentMap = new Map(payments?.map(p => [p.class_id, p]))
    const processedClasses = []

    for (const c of (classes ?? [])) {
      const payment = paymentMap.get(c.id)
      const tutor = Array.isArray(c.tutors) ? c.tutors[0] : c.tutors
      const tutorProfile = tutor?.profiles
      const tutorName = Array.isArray(tutorProfile) ? tutorProfile[0]?.full_name : tutorProfile?.full_name

      let qrUrl = null
      if (tutor?.bank_qr_key) {
        try {
          qrUrl = await createTeachingMaterialDownloadUrl(tutor.bank_qr_key, 600)
        } catch (e) {
          console.error(`Failed to pre-sign QR url for class ${c.id}:`, e)
        }
      }

      processedClasses.push({
        id: c.id,
        studentName: c.student_name,
        studentGrade: c.student_grade,
        parentName: c.parent_name,
        parentPhone: c.parent_phone,
        subjectName: (Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name) || '',
        defaultTuitionFee: Number(c.tuition_fee || 0),
        tutor: tutor ? {
          id: tutor.id,
          name: tutorName || 'Unnamed Tutor',
          bankName: tutor.bank_name || '',
          bankAccountNo: tutor.bank_account_no || '',
          bankAccountName: tutor.bank_account_name || '',
          qrUrl,
        } : null,
        payment: payment ? {
          tuitionFee: Number(payment.tuition_fee),
          tuitionStatus: payment.tuition_status,
          tuitionPaidAt: payment.tuition_paid_at,
          tutorPaymentStatus: payment.tutor_payment_status,
          tutorPaidAt: payment.tutor_paid_at,
        } : {
          tuitionFee: Number(c.tuition_fee || 0),
          tuitionStatus: 'unpaid',
          tuitionPaidAt: null,
          tutorPaymentStatus: 'unpaid',
          tutorPaidAt: null,
        }
      })
    }

    return processedClasses
  } catch (error) {
    console.error('Error fetching finance data:', error)
    return []
  }
}

export async function confirmTuitionPaid(classId: string, billingMonth: string, tuitionFee: number): Promise<FinanceActionState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    const { error } = await admin
      .from('class_payments')
      .upsert({
        class_id: classId,
        billing_month: billingMonth,
        tuition_fee: tuitionFee,
        tuition_status: 'paid',
        tuition_paid_at: new Date().toISOString(),
      }, {
        onConflict: 'class_id,billing_month'
      })

    if (error) throw new Error(error.message)

    revalidatePath(`/dashboard/admin/finance`)
    return { success: 'Xác nhận thu học phí thành công.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Lỗi khi xác nhận thu học phí.' }
  }
}

export async function confirmTutorPaid(classId: string, billingMonth: string): Promise<FinanceActionState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    const { error } = await admin
      .from('class_payments')
      .update({
        tutor_payment_status: 'paid',
        tutor_paid_at: new Date().toISOString(),
      })
      .eq('class_id', classId)
      .eq('billing_month', billingMonth)

    if (error) throw new Error(error.message)

    revalidatePath(`/dashboard/admin/finance`)
    return { success: 'Xác nhận chuyển lương gia sư thành công.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Lỗi khi xác nhận chuyển lương.' }
  }
}
