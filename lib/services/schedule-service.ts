import { createAdminClient } from '@/lib/supabase/admin'

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Automatically generates class_sessions for the next 30 days based on the recurring class_schedules.
 */
export async function generateUpcomingSessions(classId: string) {
  const admin = createAdminClient()

  // 1. Fetch recurring schedules
  const { data: schedules, error: scheduleError } = await admin
    .from('class_schedules')
    .select('*')
    .eq('class_id', classId)

  if (scheduleError) {
    console.error('Error fetching schedules to generate sessions:', scheduleError)
    return
  }

  if (!schedules || schedules.length === 0) return

  // 2. Fetch existing sessions in the next 30 days to avoid duplicates
  const today = new Date()
  const endDate = new Date()
  endDate.setDate(today.getDate() + 30)

  const todayStr = getLocalDateString(today)
  const endStr = getLocalDateString(endDate)

  const { data: existingSessions, error: sessionError } = await admin
    .from('class_sessions')
    .select('session_date')
    .eq('class_id', classId)
    .gte('session_date', todayStr)
    .lte('session_date', endStr)

  if (sessionError) {
    console.error('Error checking existing sessions:', sessionError)
    return
  }

  const existingDates = new Set((existingSessions || []).map((s: any) => s.session_date))

  // 3. Generate sessions for the next 30 days
  const newSessions: any[] = []

  for (let i = 0; i <= 30; i++) {
    const checkDate = new Date()
    checkDate.setDate(today.getDate() + i)
    const checkDateStr = getLocalDateString(checkDate)

    // Sunday = 0, Monday = 1, ..., Saturday = 6
    const weekday = checkDate.getDay()

    // Find if we have a recurring schedule on this weekday
    const matches = schedules.filter((s: any) => s.weekday === weekday)

    for (const match of matches) {
      if (!existingDates.has(checkDateStr)) {
        newSessions.push({
          class_id: classId,
          session_date: checkDateStr,
          start_time: match.start_time,
          end_time: match.end_time,
          status: 'scheduled',
        })
      }
    }
  }

  if (newSessions.length > 0) {
    const { error: insertError } = await admin
      .from('class_sessions')
      .insert(newSessions)

    if (insertError) {
      console.error('Error inserting generated sessions:', insertError)
    }
  }
}

/**
 * Checks if a tutor has overlapping recurring schedules.
 * Returns the overlap error message if an overlap exists, otherwise null.
 */
export async function checkTutorScheduleOverlap(
  adminClient: any,
  tutorId: string,
  newSchedules: { weekday: number; startTime: string; endTime: string }[],
  excludeClassId?: string
): Promise<string | null> {
  if (!tutorId) return null

  // 1. Fetch all other classes of this tutor
  let query = adminClient
    .from('classes')
    .select('id, student_name')
    .eq('tutor_id', tutorId)

  if (excludeClassId) {
    query = query.neq('id', excludeClassId)
  }

  const { data: otherClasses, error: otherClassesError } = await query
  if (otherClassesError) {
    throw new Error(`Lỗi khi kiểm tra lịch gia sư: ${otherClassesError.message}`)
  }

  if (!otherClasses || otherClasses.length === 0) return null
  const otherClassIds = otherClasses.map((c: any) => c.id)

  // 2. Fetch recurring schedules for these classes
  const { data: otherSchedules, error: otherSchedulesError } = await adminClient
    .from('class_schedules')
    .select('weekday, start_time, end_time, class_id')
    .in('class_id', otherClassIds)

  if (otherSchedulesError) {
    throw new Error(`Lỗi khi kiểm tra lịch gia sư: ${otherSchedulesError.message}`)
  }

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const getDayName = (w: number) => {
    if (w === 0) return 'Chủ Nhật'
    return `Thứ ${w + 1}`
  }

  // 3. Compare
  for (const newItem of newSchedules) {
    const newStart = timeToMinutes(newItem.startTime)
    const newEnd = timeToMinutes(newItem.endTime)

    for (const ext of (otherSchedules || [])) {
      if (ext.weekday === newItem.weekday) {
        const extStart = timeToMinutes(ext.start_time)
        const extEnd = timeToMinutes(ext.end_time)

        if (newStart < extEnd && newEnd > extStart) {
          const otherClass = otherClasses.find((c: any) => c.id === ext.class_id)
          return `Trùng lịch dạy của Gia sư: Đã có lịch dạy lớp "${otherClass?.student_name || 'khác'}" vào ${getDayName(ext.weekday)} từ ${ext.start_time.substring(0, 5)} đến ${ext.end_time.substring(0, 5)}.`
        }
      }
    }
  }

  return null
}
