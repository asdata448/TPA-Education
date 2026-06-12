'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from '../../classes-data'
import { sendAdminReportSubmittedEmail } from '@/lib/email'

export type ReportActionState = { error?: string; success?: string; reportId?: string }

export async function getClassReports(classId: string) {
  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()

    // Verify tutor is assigned to this class
    const { data: classCheck, error: checkError } = await admin
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('tutor_id', tutorId)
      .maybeSingle()

    if (checkError || !classCheck) return []

    const { data, error } = await admin
      .from('class_progress_reports')
      .select('*')
      .eq('class_id', classId)
      .order('reporting_month', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  } catch (error) {
    console.error('Error in getClassReports:', error)
    return []
  }
}

export async function saveProgressReport(
  _: ReportActionState,
  formData: FormData
): Promise<ReportActionState> {
  const classId = String(formData.get('classId') ?? '')
  const reportingMonth = String(formData.get('reportingMonth') ?? '').trim()
  const lessonsCompleted = Number(formData.get('lessonsCompleted') ?? 0)
  const ratingComprehension = Number(formData.get('ratingComprehension') ?? 5)
  const ratingHomework = Number(formData.get('ratingHomework') ?? 5)
  const ratingAttendance = Number(formData.get('ratingAttendance') ?? 5)
  const ratingAttitude = Number(formData.get('ratingAttitude') ?? 5)
  const teacherComments = String(formData.get('teacherComments') ?? '').trim()
  const nextMonthPlan = String(formData.get('nextMonthPlan') ?? '').trim()
  const tuitionFee = Number(formData.get('tuitionFee') ?? 0)

  if (!classId || !reportingMonth || !teacherComments) {
    return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' }
  }

  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()

    // 1. Verify class assignment
    const { data: classData, error: classError } = await admin
      .from('classes')
      .select('id, tuition_fee, student_name, subjects(name)')
      .eq('id', classId)
      .eq('tutor_id', tutorId)
      .single()

    if (classError || !classData) {
      return { error: 'Bạn không có quyền quản lý lớp học này.' }
    }

    // Use either the manually inputted fee or default to class tuition fee
    const feeToSave = tuitionFee || Number(classData.tuition_fee || 0)

    // 2. Upsert progress report
    const { data: savedReport, error: upsertError } = await admin
      .from('class_progress_reports')
      .upsert({
        class_id: classId,
        reporting_month: reportingMonth,
        lessons_completed: lessonsCompleted,
        rating_comprehension: ratingComprehension,
        rating_homework: ratingHomework,
        rating_attendance: ratingAttendance,
        rating_attitude: ratingAttitude,
        teacher_comments: teacherComments,
        next_month_plan: nextMonthPlan || null,
        tuition_fee: feeToSave,
      }, {
        onConflict: 'class_id,reporting_month'
      })
      .select('id')
      .single()

    if (upsertError || !savedReport) {
      return { error: upsertError?.message || 'Không thể lưu phiếu báo cáo.' }
    }

    try {
      const { data: tutor } = await admin.from('tutors').select('profiles(full_name)').eq('id', tutorId).maybeSingle()
      const tutorProfile = Array.isArray(tutor?.profiles) ? tutor?.profiles[0] : tutor?.profiles
      const subject = Array.isArray(classData?.subjects) ? classData?.subjects[0]?.name : classData?.subjects?.name
      await sendAdminReportSubmittedEmail({
        tutorName: tutorProfile?.full_name,
        className: [subject, classData?.student_name].filter(Boolean).join(' - '),
        reportingMonth,
        reportId: savedReport.id,
      })
    } catch (emailError) {
      console.error('Failed to send admin report submitted email:', emailError)
    }

    revalidatePath(`/dashboard/tutor/classes/${classId}`)
    return {
      success: 'Lưu báo cáo tiến độ thành công!',
      reportId: savedReport.id,
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn.' }
  }
}
