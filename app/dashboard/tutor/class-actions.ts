'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from './classes-data'
import { checkTutorScheduleOverlap } from '@/lib/services/schedule-service'
import { sendAdminClassRequestEmail } from '@/lib/email'

export type RequestState={error?:string; success?:string}

export async function requestClass(_:RequestState, fd:FormData):Promise<RequestState>{
  const classId=String(fd.get('classId')??'');
  const message=String(fd.get('message')??'').trim()||null;
  try {
    const tutorId = await requireTutorId();
    const admin = createAdminClient();

    // Fetch schedules of the target class
    const { data: targetSchedules, error: targetSchedulesError } = await admin
      .from('class_schedules')
      .select('weekday, start_time, end_time')
      .eq('class_id', classId)

    if (targetSchedulesError) throw new Error(targetSchedulesError.message)

    if (targetSchedules && targetSchedules.length > 0) {
      const checkSchedules = targetSchedules.map((s: any) => ({
        weekday: s.weekday,
        startTime: s.start_time,
        endTime: s.end_time,
      }))
      const overlapErr = await checkTutorScheduleOverlap(admin, tutorId, checkSchedules, classId)
      if (overlapErr) {
        return { error: `Không thể đăng ký lớp: Lớp này trùng lịch dạy hiện tại của bạn. ${overlapErr}` }
      }
    }

    const { data: request, error } = await admin.from('class_requests').insert({
      class_id: classId,
      tutor_id: tutorId,
      message,
      status: 'pending'
    }).select('id').single();

    if (error) {
      return { error: error.code==='23505' ? 'You already have a pending request for this class.' : error.message }
    }

    revalidatePath('/dashboard/tutor/open-classes');
    return { success: 'Đã gửi yêu cầu nhận lớp thành công.' }
  } catch(e) {
    return { error: e instanceof Error ? e.message : 'Unable to request class.' }
  }
}
