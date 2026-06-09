'use client'

import { Flag } from 'lucide-react'
import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createDocumentFeedback, type FeedbackActionState } from './document-feedback-actions'
import type { AdminLibraryItem } from '../admin/materials-data'
import { useMemo, useState } from 'react'

export function TutorMaterialLibrary({ items }: { items: AdminLibraryItem[] }) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('all')
  const subjects = useMemo(() => Array.from(new Set(items.map((item) => item.subjectName).filter(Boolean))).sort() as string[], [items])
  const filteredItems = useMemo(() => { const needle = query.trim().toLowerCase(); return items.filter((item) => { const matchesSearch = !needle || [item.title, item.subjectName, item.gradeLevel, item.description, ...item.files.map((file) => file.fileName)].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle)); return matchesSearch && (subject === 'all' || item.subjectName === subject) }) }, [items, query, subject])

  return <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-[1fr_180px]"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search material, grade, file..." /><select className="h-9 rounded-md border bg-background px-3 text-sm" value={subject} onChange={(event) => setSubject(event.target.value)}><option value="all">All subjects</option>{subjects.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
    <div className="grid gap-4 md:grid-cols-2">{filteredItems.length === 0 ? <p className="text-muted-foreground">No matching materials.</p> : filteredItems.map(item => <div key={item.id} className="space-y-3 rounded-lg border p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.subjectName || 'General'} {item.gradeLevel ? `/ ${item.gradeLevel}` : ''}</p></div><ReportMaterialButton itemId={item.id} /></div><p className="text-sm">{item.description || 'No description.'}</p><div className="space-y-1">{item.files.map(file => <a key={file.id} className="block text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/materials/${file.id}/download`} target="_blank" rel="noreferrer">{file.fileName}</a>)}</div></div>)}</div>
  </div>
}

function ReportMaterialButton({ itemId }: { itemId: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createDocumentFeedback, {} as FeedbackActionState)
  return <div className="min-w-32 text-right"><button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><Flag className="h-3.5 w-3.5" /> Report</button>{open&&<form action={action} className="mt-2 space-y-2 rounded-md border bg-background p-3 text-left"><input type="hidden" name="kind" value="material_report"/><input type="hidden" name="libraryItemId" value={itemId}/>{state.error&&<Alert variant="destructive"><AlertTitle>Failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}{state.success&&<Alert><AlertTitle>Sent</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}<Label className="text-xs" htmlFor={`report-${itemId}`}>What is wrong?</Label><Textarea id={`report-${itemId}`} name="message" rows={3} placeholder="Describe the issue." /><Button size="sm" disabled={pending}>{pending?'Sending...':'Send report'}</Button></form>}</div>
}
