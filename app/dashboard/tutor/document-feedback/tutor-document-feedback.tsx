'use client'

import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createDocumentFeedback, type FeedbackActionState } from '../document-feedback-actions'
import type { TutorFeedbackContext } from '../document-feedback-data'

export function TutorDocumentFeedback({ context }: { context: TutorFeedbackContext }) {
  const [state, action, pending] = useActionState(createDocumentFeedback, {} as FeedbackActionState)
  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle>Send document feedback</CardTitle><CardDescription>Request materials or report wrong, missing, or broken documents.</CardDescription></CardHeader><CardContent><form action={action} className="space-y-4">
        {state.error && <Alert variant="destructive"><AlertTitle>Send failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
        {state.success && <Alert><AlertTitle>Sent</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
        <div className="grid gap-4 md:grid-cols-3"><FieldSelect name="type" label="Type" options={FEEDBACK_TYPES} /><FieldSelect name="classId" label="Class (optional)" options={[['','None'], ...context.classes.map((item) => [item.id, item.label] as [string,string])]} /><FieldSelect name="libraryItemId" label="Library item (optional)" options={[['','None'], ...context.libraryItems.map((item) => [item.id, item.title] as [string,string])]} /></div>
        <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={5} placeholder="Describe what you need or what is wrong." /></div>
        <Button disabled={pending}>{pending ? 'Sending...' : 'Send to Admin'}</Button>
      </form></CardContent></Card>

      <Card><CardHeader><CardTitle>My feedback history</CardTitle><CardDescription>Track pending, done, and rejected items.</CardDescription></CardHeader><CardContent className="space-y-3">{context.feedback.length===0?<p className="text-sm text-muted-foreground">No feedback yet.</p>:context.feedback.map((item)=><div key={item.id} className="rounded-lg border p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{labelForType(item.type)}</strong><span className="rounded-full bg-secondary px-2 py-1 text-xs">{item.status}</span></div><p className="mt-2 whitespace-pre-wrap">{item.message}</p><p className="mt-2 text-muted-foreground">{item.classLabel||item.libraryTitle||'No link'}{item.rejectReason?` · Reject: ${item.rejectReason}`:''}{item.adminNote?` · Admin: ${item.adminNote}`:''}</p></div>)}</CardContent></Card>

      <Card><CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Done/rejected results from Admin.</CardDescription></CardHeader><CardContent className="space-y-3">{context.notifications.length===0?<p className="text-sm text-muted-foreground">No notifications yet.</p>:context.notifications.map((item)=><div key={item.id} className="rounded-lg border p-4 text-sm"><div className="flex items-center justify-between gap-2"><strong>{item.title}</strong><span className="rounded-full bg-secondary px-2 py-1 text-xs">{item.type.replace('document_feedback_','')}</span></div><p className="mt-2">{item.message}</p></div>)}</CardContent></Card>
    </div>
  )
}

const FEEDBACK_TYPES: [string,string][] = [['request_material','Request material'],['wrong_material','Wrong material'],['missing_material','Missing material'],['broken_file','Broken file'],['other','Other']]
function labelForType(type: string) { return FEEDBACK_TYPES.find(([value]) => value === type)?.[1] ?? type }
function FieldSelect({ label, name, options }: { label: string; name: string; options: [string, string][] }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><select id={name} name={name} className="h-10 w-full rounded-md border bg-background px-3 text-sm">{options.map(([value, display]) => <option key={value || display} value={value}>{display}</option>)}</select></div> }
