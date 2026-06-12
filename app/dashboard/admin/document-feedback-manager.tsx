'use client'

import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { resolveDocumentFeedback, type ResolveFeedbackState } from './document-feedback-actions'
import type { AdminFeedbackItem } from './document-feedback-data'

export function DocumentFeedbackManager({ items }: { items: AdminFeedbackItem[] }) {
  return <div className="space-y-4">{items.length===0?<p className="text-sm text-muted-foreground">No document feedback yet.</p>:items.map((item)=><FeedbackCard key={item.id} item={item} />)}</div>
}

function FeedbackCard({ item }: { item: AdminFeedbackItem }) {
  const [state, action, pending] = useActionState(resolveDocumentFeedback, {} as ResolveFeedbackState)
  const resolved = item.status !== 'pending'
  return <Card className={item.status==='pending'?'border-primary/30':''}>
    <CardHeader><div className="flex flex-wrap items-center justify-between gap-2"><div><CardTitle className="text-base">{labelForKind(item.kind)} · {item.tutorName}</CardTitle><CardDescription>{item.libraryTitle||'General material request'} · {item.status}</CardDescription></div><span className="rounded-full bg-secondary px-2 py-1 text-xs">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span></div></CardHeader>
    <CardContent className="space-y-4 text-sm">
      <p className="whitespace-pre-wrap">{item.message}</p>
      {item.rejectReason&&<p className="text-destructive">Reject reason: {item.rejectReason}</p>}
      {item.adminNote&&<p className="text-muted-foreground">Admin note: {item.adminNote}</p>}
      {state.error&&<Alert variant="destructive"><AlertTitle>Update failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.success&&<Alert><AlertTitle>Updated</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
      {!resolved&&<form action={action} className="grid gap-3 md:grid-cols-2"><input type="hidden" name="feedbackId" value={item.id}/><div className="space-y-2"><Label htmlFor={`note-${item.id}`}>Done note (optional)</Label><Textarea id={`note-${item.id}`} name="adminNote" rows={3} placeholder="Optional note for Tutor" /></div><div className="space-y-2"><Label htmlFor={`reject-${item.id}`}>Reject reason</Label><Textarea id={`reject-${item.id}`} name="rejectReason" rows={3} placeholder="Required only when rejecting" /></div><div className="flex gap-2 md:col-span-2"><Button name="decision" value="done" disabled={pending}>Done</Button><Button name="decision" value="rejected" variant="destructive" disabled={pending}>Reject</Button></div></form>}
    </CardContent>
  </Card>
}

function labelForKind(kind: string) { return kind === 'material_report' ? 'Material issue report' : 'Material request' }
