'use client'
import { useActionState } from 'react'
import { createClass, reviewClassRequest, type ClassActionState } from './class-actions'
import type { ClassRequest, SubjectOption, TutorOption } from './classes-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CreateClassForm({subjects,tutors}:{subjects:SubjectOption[]; tutors:TutorOption[]}){
 const [state,action,pending]=useActionState(createClass,{} as ClassActionState)
 return <form action={action} className="space-y-4">
  {state.error&&<Alert variant="destructive"><AlertTitle>Class not created</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}{state.success&&<Alert><AlertTitle>Saved</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
  <div className="grid gap-4 md:grid-cols-3"><Field label="Student name" name="studentName" required/><Field label="Grade" name="studentGrade"/><div className="space-y-2"><Label>Subject</Label><Select name="subjectId" required><SelectTrigger className="w-full"><SelectValue placeholder="Select subject"/></SelectTrigger><SelectContent>{subjects.map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div></div>
  <div className="grid gap-4 md:grid-cols-3"><Field label="Parent name" name="parentName"/><Field label="Parent phone" name="parentPhone"/><Field label="Parent email" name="parentEmail" type="email"/></div>
  <div className="grid gap-4 md:grid-cols-3"><div className="space-y-2"><Label>Tutor</Label><Select name="tutorId" defaultValue="open"><SelectTrigger className="w-full"><SelectValue placeholder="Open/unassigned"/></SelectTrigger><SelectContent><SelectItem value="open">Open/unassigned</SelectItem>{tutors.map(t=><SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}</SelectContent></Select></div><Field label="Mode" name="mode" defaultValue="online"/><Field label="Tuition fee" name="tuitionFee" type="number"/></div>
  <div className="grid gap-4 md:grid-cols-2"><Field label="Start date (optional)" name="startDate" type="date"/><Field label="Location" name="location"/></div>
  <div className="grid gap-4 md:grid-cols-3"><TextBox label="Schedule notes" name="scheduleNotes"/><TextBox label="Requirements" name="requirements"/><TextBox label="Internal notes" name="notes"/></div>
  <Button disabled={pending}>{pending?'Creating...':'Create class'}</Button>
 </form>
}
export function RequestReviewForm({request}:{request:ClassRequest}){const [state,action,pending]=useActionState(reviewClassRequest,{} as ClassActionState); return <form action={action} className="flex flex-wrap items-center gap-2"><input type="hidden" name="requestId" value={request.id}/>{state.error&&<span className="text-sm text-destructive">{state.error}</span>}{state.success&&<span className="text-sm text-emerald-600">{state.success}</span>}<Button size="sm" name="decision" value="approve" disabled={pending}>Approve</Button><Button size="sm" variant="secondary" name="decision" value="reject" disabled={pending}>Reject</Button></form>}
function Field({label,className,...props}:React.ComponentProps<typeof Input>&{label:string}){const id=String(props.name);return <div className={`space-y-2 ${className??''}`}><Label htmlFor={id}>{label}</Label><Input id={id}{...props}/></div>}
function TextBox({label,name}:{label:string;name:string}){return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} rows={3}/></div>}
