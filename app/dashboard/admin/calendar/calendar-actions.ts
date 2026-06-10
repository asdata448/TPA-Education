'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { requireActiveAdmin } from '../data'
import { generateUpcomingSessions, checkTutorScheduleOverlap } from '@/lib/services/schedule-service'

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export type CalendarActionState = { error?: string; success?: string }

// 1. Fetch all classes, schedules, and sessions for Admin
export async function getAdminCalendarData() {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    // Fetch classes
    const { data: classes, error: classesError } = await admin
      .from('classes')
      .select(`
        id,
        student_name,
        student_grade,
        status,
        tutor_id,
        subjects (name),
        tutors (
          profiles (full_name)
        )
      `)

    if (classesError) throw new Error(classesError.message)

    // Fetch recurring schedules
    const { data: schedules, error: schedulesError } = await admin
      .from('class_schedules')
      .select('*')

    if (schedulesError) throw new Error(schedulesError.message)

    // Fetch sessions in the range of 30 days past to 60 days future
    const minDate = new Date()
    minDate.setDate(minDate.getDate() - 30)
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 60)

    const { data: sessions, error: sessionsError } = await admin
      .from('class_sessions')
      .select('*')
      .gte('session_date', getLocalDateString(minDate))
      .lte('session_date', getLocalDateString(maxDate))

    if (sessionsError) throw new Error(sessionsError.message)

    return {
      classes: (classes || []).map((c: any) => {
        const tutor = Array.isArray(c.tutors) ? c.tutors[0] : c.tutors
        return {
          id: c.id,
          studentName: c.student_name,
          studentGrade: c.student_grade || '',
          status: c.status,
          tutorId: c.tutor_id,
          tutorName: tutor?.profiles?.full_name || 'Chưa phân công',
          subjectName: (Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name) || 'Môn học',
        }
      }),
      schedules: (schedules || []).map((s: any) => ({
        id: s.id,
        classId: s.class_id,
        weekday: s.weekday,
        startTime: s.start_time,
        endTime: s.end_time,
        notes: s.notes,
      })),
      sessions: (sessions || []).map((s: any) => ({
        id: s.id,
        classId: s.class_id,
        sessionDate: s.session_date,
        startTime: s.start_time,
        endTime: s.end_time,
        status: s.status,
        tutorComments: s.tutor_comments || '',
      })),
    }
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return { classes: [], schedules: [], sessions: [] }
  }
}

// 2. Save/Update class recurring schedules (Admin only)
export async function saveClassRecurringSchedule(
  classId: string,
  scheduleItems: { weekday: number; startTime: string; endTime: string; notes?: string }[]
): Promise<CalendarActionState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    // Check for tutor overlap
    const { data: targetClass, error: targetClassError } = await admin
      .from('classes')
      .select('tutor_id')
      .eq('id', classId)
      .single()

    if (targetClassError || !targetClass) throw new Error('Không tìm thấy lớp học này.')

    if (targetClass.tutor_id && scheduleItems.length > 0) {
      const overlapErr = await checkTutorScheduleOverlap(admin, targetClass.tutor_id, scheduleItems, classId)
      if (overlapErr) {
        return { error: overlapErr }
      }
    }

    // Delete existing schedules for this class
    const { error: deleteError } = await admin
      .from('class_schedules')
      .delete()
      .eq('class_id', classId)

    if (deleteError) throw new Error(deleteError.message)

    if (scheduleItems.length > 0) {
      // Insert new schedules
      const { error: insertError } = await admin
        .from('class_schedules')
        .insert(
          scheduleItems.map((item) => ({
            class_id: classId,
            weekday: item.weekday,
            start_time: item.startTime,
            end_time: item.endTime,
            notes: item.notes || null,
          }))
        )

      if (insertError) throw new Error(insertError.message)
    }

    // Auto generate the sessions based on the new recurring schedule
    await generateUpcomingSessions(classId)

    revalidatePath('/dashboard/admin/calendar')
    revalidatePath(`/dashboard/tutor/calendar`)
    return { success: 'Đã lưu lịch lặp lại hàng tuần thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Lỗi khi lưu lịch lặp lại.' }
  }
}

// 3. Edit/Reschedule/Cancel a single session (Admin or Tutor)
export async function updateClassSession(
  sessionId: string,
  data: {
    sessionDate?: string
    startTime?: string
    endTime?: string
    status?: 'scheduled' | 'attended' | 'absent' | 'cancelled'
    tutorComments?: string
  }
): Promise<CalendarActionState> {
  try {
    const admin = createAdminClient()
    const supabase = await createClient()

    // Fetch the session details to verify authorization
    const { data: sessionData, error: sessionFetchError } = await admin
      .from('class_sessions')
      .select('id, class_id')
      .eq('id', sessionId)
      .single()

    if (sessionFetchError || !sessionData) {
      return { error: 'Không tìm thấy buổi học này.' }
    }

    // Check auth roles: Active Admin OR assigned Active Tutor
    let isAuthorized = false
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Is admin?
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, active')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin' && profile?.active) {
        isAuthorized = true
      } else {
        // Is assigned tutor?
        const { data: tutor } = await supabase
          .from('tutors')
          .select('id, active')
          .eq('profile_id', user.id)
          .single()

        if (tutor?.active) {
          const { data: classData } = await admin
            .from('classes')
            .select('tutor_id')
            .eq('id', sessionData.class_id)
            .single()

          if (classData?.tutor_id === tutor.id) {
            isAuthorized = true
          }
        }
      }
    }

    if (!isAuthorized) {
      return { error: 'Bạn không có quyền thực hiện thao tác trên buổi học này.' }
    }

    // Prepare update fields
    const updateObj: any = {}
    if (data.sessionDate) updateObj.session_date = data.sessionDate
    if (data.startTime) updateObj.start_time = data.startTime
    if (data.endTime) updateObj.end_time = data.endTime
    if (data.status) {
      updateObj.status = data.status
      if (data.status === 'attended' || data.status === 'absent') {
        updateObj.attendance_checked_at = new Date().toISOString()
      }
    }
    if (data.tutorComments !== undefined) updateObj.tutor_comments = data.tutorComments

    const { error: updateError } = await admin
      .from('class_sessions')
      .update(updateObj)
      .eq('id', sessionId)

    if (updateError) throw new Error(updateError.message)

    revalidatePath('/dashboard/admin/calendar')
    revalidatePath(`/dashboard/tutor/calendar`)
    revalidatePath(`/dashboard/tutor/classes`)
    return { success: 'Cập nhật buổi học thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Lỗi khi cập nhật buổi học.' }
  }
}

// 4. Delete a single session (Admin only)
export async function deleteClassSession(sessionId: string): Promise<CalendarActionState> {
  try {
    await requireActiveAdmin()
    const admin = createAdminClient()

    const { error } = await admin
      .from('class_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/admin/calendar')
    revalidatePath(`/dashboard/tutor/calendar`)
    return { success: 'Đã xóa buổi học thành công!' }
  } catch (error: any) {
    return { error: error.message || 'Lỗi khi xóa buổi học.' }
  }
}

// 5. Fetch classes, schedules, and sessions for Tutor
export async function getTutorCalendarData() {
  try {
    const admin = createAdminClient()
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: tutor, error: tutorError } = await supabase
      .from('tutors')
      .select('id, active')
      .eq('profile_id', user.id)
      .single()

    if (tutorError || !tutor || !tutor.active) {
      throw new Error('Unauthorized')
    }

    const tutorId = tutor.id

    // Fetch tutor's classes
    const { data: classes, error: classesError } = await admin
      .from('classes')
      .select(`
        id,
        student_name,
        student_grade,
        status,
        tutor_id,
        subjects (name),
        tutors (
          profiles (full_name)
        )
      `)
      .eq('tutor_id', tutorId)

    if (classesError) throw new Error(classesError.message)

    const classIds = (classes || []).map((c: any) => c.id)

    if (classIds.length === 0) {
      return { classes: [], schedules: [], sessions: [], tutorId }
    }

    // Fetch recurring schedules for these classes
    const { data: schedules, error: schedulesError } = await admin
      .from('class_schedules')
      .select('*')
      .in('class_id', classIds)

    if (schedulesError) throw new Error(schedulesError.message)

    // Fetch sessions in range
    const minDate = new Date()
    minDate.setDate(minDate.getDate() - 30)
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 60)

    const { data: sessions, error: sessionsError } = await admin
      .from('class_sessions')
      .select('*')
      .in('class_id', classIds)
      .gte('session_date', getLocalDateString(minDate))
      .lte('session_date', getLocalDateString(maxDate))

    if (sessionsError) throw new Error(sessionsError.message)

    return {
      tutorId,
      classes: (classes || []).map((c: any) => {
        const tutor = Array.isArray(c.tutors) ? c.tutors[0] : c.tutors
        return {
          id: c.id,
          studentName: c.student_name,
          studentGrade: c.student_grade || '',
          status: c.status,
          tutorId: c.tutor_id,
          tutorName: tutor?.profiles?.full_name || 'Chưa phân công',
          subjectName: (Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name) || 'Môn học',
        }
      }),
      schedules: (schedules || []).map((s: any) => ({
        id: s.id,
        classId: s.class_id,
        weekday: s.weekday,
        startTime: s.start_time,
        endTime: s.end_time,
        notes: s.notes,
      })),
      sessions: (sessions || []).map((s: any) => ({
        id: s.id,
        classId: s.class_id,
        sessionDate: s.session_date,
        startTime: s.start_time,
        endTime: s.end_time,
        status: s.status,
        tutorComments: s.tutor_comments || '',
      })),
    }
  } catch (error) {
    console.error('Error fetching tutor calendar data:', error)
    return { classes: [], schedules: [], sessions: [], tutorId: null }
  }
}

