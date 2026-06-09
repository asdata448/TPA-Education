'use client'

import { useActionState, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { AdminLibraryItem } from './materials-data'
import { deleteMaterialFile, deleteMaterialItem, updateMaterialItem, type MaterialActionState } from './material-actions'

const emptyState = {} as MaterialActionState

export function MaterialLibraryManager({ items }: { items: AdminLibraryItem[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [subject, setSubject] = useState('all')
  const subjects = useMemo(() => Array.from(new Set(items.map((item) => item.subjectName).filter(Boolean))).sort() as string[], [items])
  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesSearch = !needle || [item.title, item.subjectName, item.gradeLevel, item.description, ...item.files.map((file) => file.fileName)].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))
      const matchesStatus = status === 'all' || (status === 'active' ? item.active : !item.active)
      const matchesSubject = subject === 'all' || item.subjectName === subject
      return matchesSearch && matchesStatus && matchesSubject
    })
  }, [items, query, status, subject])

  return <div className="space-y-4">
    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, subject, grade, file..." />
      <select className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
      </select>
      <select className="h-9 rounded-md border bg-background px-3 text-sm" value={subject} onChange={(event) => setSubject(event.target.value)}>
        <option value="all">All subjects</option>{subjects.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>
    <Table><TableHeader><TableRow><TableHead>Material</TableHead><TableHead>Status</TableHead><TableHead>Files</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>
      {filteredItems.length === 0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No matching materials.</TableCell></TableRow> : filteredItems.map((item) => <MaterialRow key={item.id} item={item} />)}
    </TableBody></Table>
  </div>
}

function MaterialRow({ item }: { item: AdminLibraryItem }) {
  const [editing, setEditing] = useState(false)
  const [updateState, updateAction, updating] = useActionState(updateMaterialItem, emptyState)
  const [deleteState, deleteAction, deleting] = useActionState(deleteMaterialItem, emptyState)

  if (editing) return <TableRow><TableCell colSpan={4}><form action={updateAction} className="space-y-3 rounded-lg border bg-muted/30 p-4">
    <input type="hidden" name="itemId" value={item.id} />
    {updateState.error && <p className="text-sm text-destructive">{updateState.error}</p>}{updateState.success && <p className="text-sm text-emerald-600">{updateState.success}</p>}
    <div className="grid gap-3 md:grid-cols-3"><Field label="Title" name="title" defaultValue={item.title} required /><Field label="Subject" name="subjectName" defaultValue={item.subjectName ?? ''} /><Field label="Grade" name="gradeLevel" defaultValue={item.gradeLevel ?? ''} /></div>
    <div className="space-y-2"><Label>Description</Label><Textarea name="description" defaultValue={item.description ?? ''} rows={3} /></div>
    <div className="space-y-2"><Label>Add files</Label><Input name="files" type="file" multiple /><p className="text-xs text-muted-foreground">PDF, Word, PowerPoint, image, text. Max 25MB/file.</p></div>
    <label className="flex items-center gap-2 text-sm"><input name="active" type="checkbox" defaultChecked={item.active} /> Active for Tutors</label>
    <div className="flex gap-2"><Button disabled={updating}>{updating ? 'Saving...' : 'Save'}</Button><Button type="button" variant="secondary" onClick={() => setEditing(false)}>Close</Button></div>
  </form></TableCell></TableRow>

  return <TableRow>
    <TableCell><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.subjectName || 'General'}{item.gradeLevel ? ` / ${item.gradeLevel}` : ''}</div>{item.description && <div className="mt-1 max-w-md text-sm text-muted-foreground">{item.description}</div>}</TableCell>
    <TableCell><InlineActiveToggle item={item} /><Badge className="mt-2" variant={item.active ? 'default' : 'secondary'}>{item.active ? 'Active' : 'Inactive'}</Badge></TableCell>
    <TableCell className="space-y-1">{item.files.length === 0 ? '-' : item.files.map((file) => <FileDeleteForm key={file.id} itemId={item.id} file={file} />)}</TableCell>
    <TableCell><div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit</Button><form action={deleteAction}>{deleteState.error && <p className="mb-1 text-xs text-destructive">{deleteState.error}</p>}<input type="hidden" name="itemId" value={item.id} /><Button size="sm" variant="destructive" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button></form></div></TableCell>
  </TableRow>
}

function InlineActiveToggle({ item }: { item: AdminLibraryItem }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [, action, pending] = useActionState(updateMaterialItem, emptyState)
  return <form ref={formRef} action={action} className="flex items-center gap-2"><input type="hidden" name="itemId" value={item.id} /><input type="hidden" name="title" value={item.title} /><input type="hidden" name="subjectName" value={item.subjectName ?? ''} /><input type="hidden" name="gradeLevel" value={item.gradeLevel ?? ''} /><input type="hidden" name="description" value={item.description ?? ''} /><input type="hidden" name="active" value={item.active ? '' : 'on'} /><Switch checked={item.active} disabled={pending} onCheckedChange={() => formRef.current?.requestSubmit()} /></form>
}

function FileDeleteForm({ itemId, file }: { itemId: string; file: AdminLibraryItem['files'][number] }) {
  const [state, action, pending] = useActionState(deleteMaterialFile, emptyState)
  const size = file.sizeBytes ? `${(file.sizeBytes / 1024 / 1024).toFixed(1)}MB` : 'unknown size'
  return <form action={action} className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-sm"><span>{file.fileName} <span className="text-muted-foreground">({size})</span></span>{state.error && <span className="text-xs text-destructive">{state.error}</span>}<input type="hidden" name="fileId" value={file.id} /><input type="hidden" name="itemId" value={itemId} /><Button size="sm" variant="ghost" disabled={pending}>{pending ? '...' : 'Delete file'}</Button></form>
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = `${String(props.name)}-${String(props.defaultValue ?? '')}`
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}
