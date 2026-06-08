'use client'

import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateTutor, type UpdateTutorState } from '../../actions'
import type { AdminTutorDetail } from '../../data'

export function EditTutorForm({ tutor }: { tutor: AdminTutorDetail }) {
  const [state, action, pending] = useActionState(updateTutor, {} as UpdateTutorState)

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="tutorId" value={tutor.tutorId} />
      <input type="hidden" name="profileId" value={tutor.profileId} />

      {state.error && <Alert variant="destructive"><AlertTitle>Update failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.success && <Alert><AlertTitle>Saved</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" defaultValue={tutor.fullName} required />
        <Field label="Email" name="email" defaultValue={tutor.email} disabled />
        <Field label="Phone" name="phone" defaultValue={tutor.phone ?? ''} />
        <Field label="Subjects" name="subjects" defaultValue={tutor.subjects ?? ''} />
        <Field label="Specialties" name="specialties" defaultValue={tutor.specialties ?? ''} className="sm:col-span-2" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={5} defaultValue={tutor.notes ?? ''} />
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Checkbox id="active" name="active" defaultChecked={tutor.profileActive && tutor.tutorActive} />
        <div className="space-y-1">
          <Label htmlFor="active">Tutor account active</Label>
          <p className="text-sm text-muted-foreground">Turning this off also blocks Tutor login and dashboard access.</p>
        </div>
      </div>

      <Button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Save Tutor profile'}</Button>
    </form>
  )
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name)
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}
