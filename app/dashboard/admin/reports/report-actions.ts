'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from '../data'

export type AdminReportActionState = { error?: string; success?: string }

export async function getAdminClasses() {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('classes')
      .select(`
        id,
        student_name,
        tuition_fee,
        subjects (name),
        tutors (
          profiles (full_name)
        )
      `)
      .order('student_name')

    if (error) throw new Error(error.message)

    return (data || []).map((c: any) => {
      const tutor = Array.isArray(c.tutors) ? c.tutors[0] : c.tutors
      const tutorName = tutor?.profiles?.full_name || 'Chưa phân công'
      const subjectName = (Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name) || ''
      return {
        id: c.id,
        studentName: c.student_name,
        tuitionFee: Number(c.tuition_fee || 0),
        tutorName,
        subjectName,
      }
    })
  } catch (error) {
    console.error('Error fetching admin classes:', error)
    return []
  }
}

export async function saveProgressReportFromAdmin(
  reportId: string | null,
  formData: FormData
): Promise<AdminReportActionState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

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
      return { error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Lớp học, Tháng báo cáo, Nhận xét).' }
    }

    const reportData = {
      class_id: classId,
      reporting_month: reportingMonth,
      lessons_completed: lessonsCompleted,
      rating_comprehension: ratingComprehension,
      rating_homework: ratingHomework,
      rating_attendance: ratingAttendance,
      rating_attitude: ratingAttitude,
      teacher_comments: teacherComments,
      next_month_plan: nextMonthPlan || null,
      tuition_fee: tuitionFee,
    }

    if (reportId) {
      const { error } = await admin
        .from('class_progress_reports')
        .update(reportData)
        .eq('id', reportId)

      if (error) throw new Error(error.message)
    } else {
      const { error } = await admin
        .from('class_progress_reports')
        .insert(reportData)

      if (error) throw new Error(error.message)
    }

    revalidatePath('/dashboard/admin/reports')
    return { success: 'Lưu báo cáo tiến độ thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Đã xảy ra lỗi khi lưu báo cáo.' }
  }
}

export async function deleteProgressReport(reportId: string): Promise<AdminReportActionState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    const { error } = await admin
      .from('class_progress_reports')
      .delete()
      .eq('id', reportId)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/admin/reports')
    return { success: 'Đã xóa báo cáo tiến độ thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Đã xảy ra lỗi khi xóa báo cáo.' }
  }
}
