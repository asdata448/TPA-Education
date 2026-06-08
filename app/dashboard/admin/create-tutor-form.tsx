'use client'

import { useActionState } from 'react'
import { createTutor, type CreateTutorState } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function CreateTutorForm() {
  const [state, action, pending] = useActionState(createTutor, {} as CreateTutorState)

  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert variant="destructive"><AlertTitle>Account not created</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.password && (
        <Alert className="border-emerald-500 bg-emerald-50">
          <AlertTitle>Tutor account created</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Copy this initial password now. It will not be shown again.</p>
            <code className="block select-all rounded bg-white p-3 text-base font-semibold">{state.password}</code>
            <p className="text-xs">Account: {state.email}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" />
        <Field label="Subjects" name="subjects" placeholder="Math, English" />
        <Field label="Specialties" name="specialties" className="sm:col-span-2" />
      </div>
      <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" rows={4} /></div>
      <Button type="submit" disabled={pending}>{pending ? 'Creating Tutor...' : 'Create Tutor account'}</Button>
    </form>
  )
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name)
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}
