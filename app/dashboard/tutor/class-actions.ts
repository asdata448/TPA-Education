'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireTutorId } from './classes-data'
export type RequestState={error?:string; success?:string}
export async function requestClass(_:RequestState,fd:FormData):Promise<RequestState>{const classId=String(fd.get('classId')??''); const message=String(fd.get('message')??'').trim()||null; try{const tutorId=await requireTutorId(); const admin=createAdminClient(); const {error}=await admin.from('class_requests').insert({class_id:classId,tutor_id:tutorId,message,status:'pending'}); if(error){return{error:error.code==='23505'?'You already have a pending request for this class.':error.message}} revalidatePath('/dashboard/tutor/open-classes'); return{success:'Request sent to Admin.'}}catch(e){return{error:e instanceof Error?e.message:'Unable to request class.'}}}
