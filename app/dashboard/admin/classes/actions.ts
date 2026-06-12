'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from '../data'
import { checkTutorScheduleOverlap } from '@/lib/services/schedule-service'

export type UpdateClassState = {
  error?: string
  success?: string
}

export type DeleteClassState = {
  error?: string
  success?: string
}

export async function updateClassAction(_: UpdateClassState, formData: FormData): Promise<UpdateClassState> {
  const classId = String(formData.get('classId') ?? '').trim()
  const studentName = String(formData.get('studentName') ?? '').trim()
  const studentGrade = String(formData.get('studentGrade') ?? '').trim() || null
  const subjectId = String(formData.get('subjectId') ?? '').trim()
  const parentName = String(formData.get('parentName') ?? '').trim() || null
  const parentPhone = String(formData.get('parentPhone') ?? '').trim() || null
  const parentEmail = String(formData.get('parentEmail') ?? '').trim() || null
  const tutorIdRaw = String(formData.get('tutorId') ?? '').trim()
  const tutorId = tutorIdRaw === 'open' || !tutorIdRaw ? null : tutorIdRaw
  const mode = String(formData.get('mode') ?? 'online')
  const location = String(formData.get('location') ?? '').trim() || null
  const startDate = String(formData.get('startDate') ?? '').trim() || null
  const tuitionFeeRaw = String(formData.get('tuitionFee') ?? '').trim()
  const tuitionFee = tuitionFeeRaw ? Number(tuitionFeeRaw) : null
  const scheduleNotes = String(formData.get('scheduleNotes') ?? '').trim() || null
  const requirements = String(formData.get('requirements') ?? '').trim() || null
  const notes = String(formData.get('notes') ?? '').trim() || null
  const status = String(formData.get('status') ?? 'open')

  if (!classId) return { error: 'Không tìm thấy ID lớp học.' }
  if (!studentName) return { error: 'Tên học sinh không được để trống.' }
  if (!subjectId) return { error: 'Môn học không được để trống.' }
  if (parentPhone && !/^(0|\+84)[35789]\d{8}$/.test(parentPhone)) {
    return { error: 'Số điện thoại phụ huynh không hợp lệ (ví dụ: 0912345678).' }
  }
  if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    return { error: 'Email phụ huynh không hợp lệ.' }
  }
  if (tuitionFee !== null && (isNaN(tuitionFee) || tuitionFee < 0)) {
    return { error: 'Học phí phải là số không âm.' }
  }

  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    // Overlap validation
    if (tutorId) {
      // Get schedules for this class
      const { data: schedules } = await admin
        .from('class_schedules')
        .select('weekday, start_time, end_time')
        .eq('class_id', classId)

      if (schedules && schedules.length > 0) {
        const checkSchedules = schedules.map(s => ({
          weekday: s.weekday,
          startTime: s.start_time,
          endTime: s.end_time
        }))
        const overlapErr = await checkTutorScheduleOverlap(admin, tutorId, checkSchedules, classId)
        if (overlapErr) {
          return { error: `Gia sư bị trùng lịch dạy: ${overlapErr}` }
        }
      }
    }

    const { error } = await admin
      .from('classes')
      .update({
        student_name: studentName,
        student_grade: studentGrade,
        subject_id: subjectId,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_email: parentEmail,
        tutor_id: tutorId,
        mode,
        location,
        start_date: startDate,
        tuition_fee: tuitionFee,
        schedule_notes: scheduleNotes,
        requirements,
        notes,
        status: tutorId && status === 'open' ? 'assigned' : status,
      })
      .eq('id', classId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/classes')
    revalidatePath('/dashboard/admin/calendar')
    return { success: 'Đã cập nhật thông tin lớp học thành công!' }
  } catch (err: any) {
    return { error: err.message || 'Lỗi hệ thống.' }
  }
}

export async function deleteClassAction(_: DeleteClassState, formData: FormData): Promise<DeleteClassState> {
  const classId = String(formData.get('classId') ?? '').trim()
  const confirmText = String(formData.get('confirmText') ?? '').trim()

  if (!classId) return { error: 'Không tìm thấy ID lớp học.' }
  if (confirmText !== 'DELETE') {
    return { error: 'Vui lòng nhập "DELETE" để xác nhận xóa.' }
  }

  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    const { error } = await admin.from('classes').delete().eq('id', classId)
    if (error) return { error: error.message }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/classes')
    revalidatePath('/dashboard/admin/calendar')
  } catch (err: any) {
    return { error: err.message || 'Lỗi hệ thống.' }
  }
  redirect('/dashboard/admin')
}
