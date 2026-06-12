import 'server-only'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type TutorClass={id:string; subjectName:string|null; studentName:string; studentGrade:string|null; parentName:string|null; parentPhone:string|null; mode:string; location:string|null; status:string; tuitionFee:number|null; scheduleNotes:string|null; requirements:string|null; notes:string|null}
export async function requireTutorId(){const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) throw new Error('Unauthorized'); const {data,error}=await supabase.from('tutors').select('id,active').eq('profile_id',user.id).single(); if(error||!data||!data.active) throw new Error('Unauthorized'); return data.id as string}
function mapClass(c:any):TutorClass{return {id:c.id,subjectName:(Array.isArray(c.subjects)?c.subjects[0]:c.subjects)?.name??null,studentName:c.student_name,studentGrade:c.student_grade,parentName:c.parent_name,parentPhone:c.parent_phone,mode:c.mode,location:c.location,status:c.status,tuitionFee:c.tuition_fee,scheduleNotes:c.schedule_notes,requirements:c.requirements,notes:c.notes}}
export async function listAssignedClasses(){const tutorId=await requireTutorId(); const admin=createAdminClient(); const {data,error}=await admin.from('classes').select('id,student_name,student_grade,parent_name,parent_phone,mode,location,status,tuition_fee,schedule_notes,requirements,notes,subjects(name)').eq('tutor_id',tutorId).order('updated_at',{ascending:false}); if(error) throw new Error(error.message); return (data??[]).map(mapClass)}
export async function listOpenClasses(){await requireTutorId(); const admin=createAdminClient(); const {data,error}=await admin.from('classes').select('id,student_name,student_grade,mode,location,status,tuition_fee,schedule_notes,requirements,notes,subjects(name)').eq('status','open').is('tutor_id',null).order('updated_at',{ascending:false}); if(error) throw new Error(error.message); return (data??[]).map((c:any)=>({...mapClass(c),parentName:null,parentPhone:null}))}
export async function getAssignedClass(classId:string){const tutorId=await requireTutorId(); const admin=createAdminClient(); const {data,error}=await admin.from('classes').select('id,student_name,student_grade,parent_name,parent_phone,mode,location,status,tuition_fee,schedule_notes,requirements,notes,subjects(name)').eq('id',classId).eq('tutor_id',tutorId).maybeSingle(); if(error) throw new Error(error.message); return data?mapClass(data):null}

export type TutorProfile = { tutorId: string; fullName: string }
export async function getTutorProfile(): Promise<TutorProfile> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data } = await supabase
    .from('tutors')
    .select('id, profiles!inner(full_name)')
    .eq('profile_id', user.id)
    .single()
  const profile = Array.isArray(data?.profiles) ? data?.profiles[0] : data?.profiles
  return { tutorId: data?.id ?? '', fullName: (profile as any)?.full_name || 'Gia sư' }
}

export type TodaySession = {
  id: string
  className: string
  startTime: string
  endTime: string
  status: string
}
export async function getTutorTodaySessions(): Promise<TodaySession[]> {
  const tutorId = await requireTutorId()
  const admin = createAdminClient()
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const { data: myClasses } = await admin.from('classes').select('id').eq('tutor_id', tutorId)
  if (!myClasses || myClasses.length === 0) return []
  const { data: sessions, error } = await admin
    .from('class_sessions')
    .select('id, class_id, start_time, end_time, status, classes(student_name, subjects(name))')
    .eq('session_date', dateStr)
    .in('class_id', myClasses.map(c => c.id))
    .order('start_time', { ascending: true })
  if (error || !sessions) return []
  return sessions.map((s: any) => ({
    id: s.id,
    className: `${(Array.isArray(s.classes?.subjects) ? s.classes.subjects[0]?.name : s.classes?.subjects?.name) || ''} - ${s.classes?.student_name || ''}`.replace(/^ - /, ''),
    startTime: s.start_time?.slice(0, 5) || '',
    endTime: s.end_time?.slice(0, 5) || '',
    status: s.status,
  }))
}

export async function getPendingReportCount(): Promise<number> {
  const tutorId = await requireTutorId()
  const admin = createAdminClient()
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const { data: classes } = await admin.from('classes').select('id').eq('tutor_id', tutorId)
  if (!classes || classes.length === 0) return 0
  const { data: reports } = await admin
    .from('class_progress_reports')
    .select('class_id')
    .eq('reporting_month', currentMonth)
    .in('class_id', classes.map(c => c.id))
  const reportedClassIds = new Set((reports ?? []).map((r: any) => r.class_id))
  return classes.filter(c => !reportedClassIds.has(c.id)).length
}
