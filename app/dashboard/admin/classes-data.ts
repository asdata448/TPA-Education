import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'

export type AdminClass = {
  id:string; subjectName:string|null; tutorName:string|null; studentName:string; studentGrade:string|null; parentName:string|null; parentPhone:string|null; mode:string; status:string; tuitionFee:number|null; scheduleNotes:string|null; requirements:string|null; notes:string|null
}
export type SubjectOption={id:string; name:string}
export type TutorOption={id:string; fullName:string}
export type ClassRequest={id:string; classId:string; classLabel:string; tutorId:string; tutorName:string; message:string|null; status:string; createdAt:string}

export async function getAdminClassData(){
 await requireActiveAdmin(); const admin=createAdminClient();
 const [{data:subjects,error:se},{data:tutors,error:te},{data:classes,error:ce},{data:requests,error:re}] = await Promise.all([
  admin.from('subjects').select('id,name').eq('active',true).order('name'),
  admin.from('tutors').select('id, profiles(full_name)').eq('active',true),
  admin.from('classes').select('id,student_name,student_grade,parent_name,parent_phone,mode,status,tuition_fee,schedule_notes,requirements,notes,subjects(name),tutors(profiles(full_name))').order('updated_at',{ascending:false}),
  admin.from('class_requests').select('id,status,message,created_at,class_id,tutor_id,classes(student_name,subjects(name)),tutors(profiles(full_name))').eq('status','pending').order('created_at',{ascending:true}),
 ])
 if(se||te||ce||re) throw new Error(se?.message||te?.message||ce?.message||re?.message||'Unable to load class data')
 return {
  subjects:(subjects??[]) as SubjectOption[],
  tutors:(tutors??[]).map((t:any)=>({id:t.id,fullName:(Array.isArray(t.profiles)?t.profiles[0]:t.profiles)?.full_name??'Unnamed Tutor'})) as TutorOption[],
  classes:(classes??[]).map((c:any)=>({id:c.id,subjectName:(Array.isArray(c.subjects)?c.subjects[0]:c.subjects)?.name??null,tutorName:(Array.isArray(c.tutors)?c.tutors[0]:c.tutors)?.profiles?.full_name??null,studentName:c.student_name,studentGrade:c.student_grade,parentName:c.parent_name,parentPhone:c.parent_phone,mode:c.mode,status:c.status,tuitionFee:c.tuition_fee,scheduleNotes:c.schedule_notes,requirements:c.requirements,notes:c.notes})) as AdminClass[],
  requests:(requests??[]).map((r:any)=>({id:r.id,classId:r.class_id,classLabel:`${(Array.isArray(r.classes?.subjects)?r.classes.subjects[0]:r.classes?.subjects)?.name??'Class'} - ${r.classes?.student_name??''}`,tutorId:r.tutor_id,tutorName:(Array.isArray(r.tutors)?r.tutors[0]:r.tutors)?.profiles?.full_name??'Tutor',message:r.message,status:r.status,createdAt:r.created_at})) as ClassRequest[],
 }
}
