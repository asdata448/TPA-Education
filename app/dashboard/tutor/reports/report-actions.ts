'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from '../classes-data'

export type ReportActionState = { error?: string; success?: string; reportId?: string }

export async function getTutorReports() {
  try {
    const tutorId = await requireTutorId()
    const admin = createAdminClient()

    const { data, error } = await admin
      .from('class_progress_reports')
      .select(`
        *,
        classes!inner (
          id,
          student_name,
          student_grade,
          tuition_fee,
          tutor_id,
          subjects (name)
        )
      `)
      .eq('classes.tutor_id', tutorId)
      .order('reporting_month', { ascending: false })

    if (error) throw new Error(error.message)
    return (data || []).map((r: any) => {
      const c = r.classes
      const subjectName = (Array.isArray(c?.subjects) ? c.subjects[0]?.name : c?.subjects?.name) || ''
      return {
        id: r.id,
        class_id: r.class_id,
        reporting_month: r.reporting_month,
        lessons_completed: r.lessons_completed,
        rating_comprehension: r.rating_comprehension,
        rating_homework: r.rating_homework,
        rating_attendance: r.rating_attendance,
        rating_attitude: r.rating_attitude,
        teacher_comments: r.teacher_comments,
        next_month_plan: r.next_month_plan,
        tuition_fee: Number(r.tuition_fee),
        created_at: r.created_at,
        studentName: c?.student_name || 'Học sinh',
        subjectName,
      }
    })
  } catch (error) {
    console.error('Error in getTutorReports:', error)
    return []
  }
}

export async function saveProgressReportFromDashboard(
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

    // Verify tutor assignment
    const { data: classData, error: classError } = await admin
      .from('classes')
      .select('id, tuition_fee')
      .eq('id', classId)
      .eq('tutor_id', tutorId)
      .single()

    if (classError || !classData) {
      return { error: 'Bạn không có quyền quản lý lớp học này.' }
    }

    const feeToSave = tuitionFee || Number(classData.tuition_fee || 0)

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

    revalidatePath(`/dashboard/tutor/reports`)
    return {
      success: 'Lưu báo cáo tiến độ thành công!',
      reportId: savedReport.id,
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Đã xảy ra lỗi.' }
  }
}
