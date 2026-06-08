'use client'

import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createMaterialItem, type MaterialActionState } from './material-actions'

export function CreateMaterialForm() {
  const [state, action, pending] = useActionState(createMaterialItem, {} as MaterialActionState)
  return (
    <form action={action} className="space-y-4">
      {state.error && <Alert variant="destructive"><AlertTitle>Upload failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.success && <Alert><AlertTitle>Uploaded</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Title" name="title" required />
        <Field label="Subject" name="subjectName" placeholder="Math, English" />
        <Field label="Grade" name="gradeLevel" />
      </div>
      <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} /></div>
      <div className="space-y-2"><Label htmlFor="files">Files</Label><Input id="files" name="files" type="file" multiple required /></div>
      <label className="flex items-center gap-2 text-sm"><input name="active" type="checkbox" defaultChecked /> Active for Tutors</label>
      <Button disabled={pending}>{pending ? 'Uploading...' : 'Upload material'}</Button>
    </form>
  )
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name)
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}
