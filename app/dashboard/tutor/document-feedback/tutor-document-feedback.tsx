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
  return <div className="space-y-6">
    <Card><CardHeader><CardTitle>Request material</CardTitle><CardDescription>Tell Admin what material you need. No class or subject selection required.</CardDescription></CardHeader><CardContent><form action={action} className="space-y-4">
      <input type="hidden" name="kind" value="material_request" />
      {state.error && <Alert variant="destructive"><AlertTitle>Send failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.success && <Alert><AlertTitle>Sent</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
      <div className="space-y-2"><Label htmlFor="message">What material do you need?</Label><Textarea id="message" name="message" rows={4} placeholder="Example: I need extra Grade 8 algebra worksheets for factoring." /></div>
      <Button disabled={pending}>{pending ? 'Sending...' : 'Send request'}</Button>
    </form></CardContent></Card>

    <Card><CardHeader><CardTitle>Feedback history</CardTitle><CardDescription>Admin results appear here after Done or Reject.</CardDescription></CardHeader><CardContent className="space-y-3">{context.feedback.length===0?<p className="text-sm text-muted-foreground">No feedback yet.</p>:context.feedback.map((item)=><div key={item.id} className="rounded-lg border p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{labelForKind(item.kind)}</strong><span className="rounded-full bg-secondary px-2 py-1 text-xs">{item.status}</span></div>{item.libraryTitle&&<p className="mt-1 text-muted-foreground">Material: {item.libraryTitle}</p>}<p className="mt-2 whitespace-pre-wrap">{item.message}</p>{item.status==='done'&&item.adminNote&&<p className="mt-2 text-muted-foreground">Admin: {item.adminNote}</p>}{item.status==='rejected'&&item.rejectReason&&<p className="mt-2 text-destructive">Reject reason: {item.rejectReason}</p>}</div>)}</CardContent></Card>
  </div>
}

function labelForKind(kind: string) { return kind === 'material_report' ? 'Material issue report' : 'Material request' }
