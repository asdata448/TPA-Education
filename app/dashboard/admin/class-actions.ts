'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from './data'

export type ClassActionState={error?:string; success?:string}
export async function createClass(_:ClassActionState, fd:FormData):Promise<ClassActionState>{
 const studentName=String(fd.get('studentName')??'').trim(); const subjectId=String(fd.get('subjectId')??'').trim(); const tutorIdValue=String(fd.get('tutorId')??'open').trim(); const tutorIdRaw=tutorIdValue==='open'?'':tutorIdValue;
 if(!studentName||!subjectId) return {error:'Student name and subject are required.'}
 try{await requireActiveAdmin(); const admin=createAdminClient(); const status=tutorIdRaw?'assigned':'open'; const {error}=await admin.from('classes').insert({subject_id:subjectId,tutor_id:tutorIdRaw||null,student_name:studentName,student_grade:String(fd.get('studentGrade')??'').trim()||null,parent_name:String(fd.get('parentName')??'').trim()||null,parent_phone:String(fd.get('parentPhone')??'').trim()||null,parent_email:String(fd.get('parentEmail')??'').trim()||null,mode:String(fd.get('mode')??'online'),location:String(fd.get('location')??'').trim()||null,start_date:String(fd.get('startDate')??'').trim()||null,tuition_fee:Number(String(fd.get('tuitionFee')??''))||null,schedule_notes:String(fd.get('scheduleNotes')??'').trim()||null,requirements:String(fd.get('requirements')??'').trim()||null,notes:String(fd.get('notes')??'').trim()||null,status}); if(error) return {error:error.message}; revalidatePath('/dashboard/admin'); return {success:'Class created.'}}catch(e){return {error:e instanceof Error?e.message:'Unable to create class.'}}
}
export async function reviewClassRequest(_:ClassActionState, fd:FormData):Promise<ClassActionState>{
 const requestId=String(fd.get('requestId')??''); const decision=String(fd.get('decision')??'');
 try{await requireActiveAdmin(); const admin=createAdminClient(); const {data:req,error:loadErr}=await admin.from('class_requests').select('id,class_id,tutor_id').eq('id',requestId).single(); if(loadErr||!req) return {error:'Request not found.'}; if(decision==='approve'){const {error:e1}=await admin.from('classes').update({tutor_id:req.tutor_id,status:'assigned'}).eq('id',req.class_id); if(e1)return{error:e1.message}; await admin.from('class_requests').update({status:'rejected'}).eq('class_id',req.class_id).eq('status','pending').neq('id',req.id); await admin.from('class_requests').update({status:'approved'}).eq('id',req.id); } else {const {error}=await admin.from('class_requests').update({status:'rejected'}).eq('id',req.id); if(error)return{error:error.message}} revalidatePath('/dashboard/admin'); return {success: decision==='approve'?'Request approved.':'Request rejected.'}}catch(e){return{error:e instanceof Error?e.message:'Unable to review request.'}}
}
