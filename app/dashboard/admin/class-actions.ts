'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'

import { generateUpcomingSessions, checkTutorScheduleOverlap } from '@/lib/services/schedule-service'

export type ClassActionState={error?:string; success?:string}
export async function createClass(_:ClassActionState, fd:FormData):Promise<ClassActionState>{
  const studentName=String(fd.get('studentName')??'').trim(); const subjectId=String(fd.get('subjectId')??'').trim(); const tutorIdValue=String(fd.get('tutorId')??'open').trim(); const tutorIdRaw=tutorIdValue==='open'?'':tutorIdValue;
  if(!studentName||!subjectId) return {error:'Student name and subject are required.'}
  
  // Parse recurring schedules
  const weekdays = fd.getAll('weekdays').map(Number)
  const startTimes = fd.getAll('startTimes').map(String)
  const endTimes = fd.getAll('endTimes').map(String)

  const schedules = weekdays.map((w, idx) => ({
    weekday: w,
    startTime: startTimes[idx],
    endTime: endTimes[idx]
  })).filter(item => !isNaN(item.weekday) && item.startTime && item.endTime)

  try {
    await requireActiveAdmin(); 
    const admin=createAdminClient(); 

    // Overlap validation
    if (tutorIdRaw && schedules.length > 0) {
      const overlapErr = await checkTutorScheduleOverlap(admin, tutorIdRaw, schedules)
      if (overlapErr) {
        return { error: overlapErr }
      }
    }

    const status=tutorIdRaw?'assigned':'open'; 
    const { data: newClass, error } = await admin
      .from('classes')
      .insert({
        subject_id:subjectId,
        tutor_id:tutorIdRaw||null,
        student_name:studentName,
        student_grade:String(fd.get('studentGrade')??'').trim()||null,
        parent_name:String(fd.get('parentName')??'').trim()||null,
        parent_phone:String(fd.get('parentPhone')??'').trim()||null,
        parent_email:String(fd.get('parentEmail')??'').trim()||null,
        mode:String(fd.get('mode')??'online'),
        location:String(fd.get('location')??'').trim()||null,
        start_date:String(fd.get('startDate')??'').trim()||null,
        tuition_fee:Number(String(fd.get('tuitionFee')??''))||null,
        schedule_notes:String(fd.get('scheduleNotes')??'').trim()||null,
        requirements:String(fd.get('requirements')??'').trim()||null,
        notes:String(fd.get('notes')??'').trim()||null,
        status
      })
      .select('id')
      .single()

    if (error || !newClass) return { error: error?.message || 'Failed to create class.' }

    // Insert recurring schedule items if they exist
    if (schedules.length > 0) {
      const { error: insertSchedError } = await admin
        .from('class_schedules')
        .insert(
          schedules.map(s => ({
            class_id: newClass.id,
            weekday: s.weekday,
            start_time: s.startTime,
            end_time: s.endTime
          }))
        )

      if (insertSchedError) throw new Error(`Lớp đã được tạo nhưng lỗi cài đặt lịch: ${insertSchedError.message}`)

      // Auto generate upcoming sessions
      await generateUpcomingSessions(newClass.id)
    }

    revalidatePath('/dashboard/admin')
    revalidatePath('/dashboard/admin/calendar')
    return { success: 'Đã tạo lớp học và cấu hình lịch học thành công!' }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unable to create class.' }
  }
}
export async function reviewClassRequest(_:ClassActionState, fd:FormData):Promise<ClassActionState>{
  const requestId=String(fd.get('requestId')??'');
  const decision=String(fd.get('decision')??'');
  try {
    await requireActiveAdmin();
    const admin=createAdminClient();
    const {data:req,error:loadErr}=await admin.from('class_requests').select('id,class_id,tutor_id').eq('id',requestId).single();
    if(loadErr||!req) return {error:'Request not found.'};

    if(decision==='approve'){
      // 1. Fetch schedules of the class being assigned
      const { data: targetSchedules, error: targetSchedulesError } = await admin
        .from('class_schedules')
        .select('weekday, start_time, end_time')
        .eq('class_id', req.class_id)

      if (targetSchedulesError) throw new Error(targetSchedulesError.message)

      // 2. Validate tutor overlap
      if (targetSchedules && targetSchedules.length > 0) {
        const checkSchedules = targetSchedules.map((s: any) => ({
          weekday: s.weekday,
          startTime: s.start_time,
          endTime: s.end_time,
        }))
        const overlapErr = await checkTutorScheduleOverlap(admin, req.tutor_id, checkSchedules, req.class_id)
        if (overlapErr) {
          return { error: `Không thể giao lớp: Gia sư bị trùng lịch. ${overlapErr}` }
        }
      }

      const {error:e1}=await admin.from('classes').update({tutor_id:req.tutor_id,status:'assigned'}).eq('id',req.class_id);
      if(e1)return{error:e1.message};

      await admin.from('class_requests').update({status:'rejected'}).eq('class_id',req.class_id).eq('status','pending').neq('id',req.id);
      await admin.from('class_requests').update({status:'approved'}).eq('id',req.id);
    } else {
      const {error}=await admin.from('class_requests').update({status:'rejected'}).eq('id',req.id);
      if(error)return{error:error.message}
    }

    revalidatePath('/dashboard/admin');
    return {success: decision==='approve'?'Request approved.':'Request rejected.'}
  } catch(e) {
    return {error:e instanceof Error?e.message:'Unable to review request.'}
  }
}
