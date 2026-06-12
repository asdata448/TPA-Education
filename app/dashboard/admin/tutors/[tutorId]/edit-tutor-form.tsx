'use client'

import { useState, useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateTutor, resetTutorPassword, deleteTutor, type UpdateTutorState, type DeleteTutorState } from '../../actions'
import type { AdminTutorDetail } from '../../data'
import { KeyRound, Check, Copy } from 'lucide-react'

export function EditTutorForm({ tutor }: { tutor: AdminTutorDetail }) {
  const [state, action, pending] = useActionState(updateTutor, {} as UpdateTutorState)
  const [deleteState, deleteAction, deleting] = useActionState(deleteTutor, {} as DeleteTutorState)
  const [resetting, setResetting] = useState(false)
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleResetPassword = async () => {
    if (!confirm('Reset this Tutor password? The current password will stop working.')) {
      return
    }
    setResetting(true)
    setResetError(null)
    setNewPassword(null)
    setCopied(false)
    try {
      const res = await resetTutorPassword(tutor.profileId)
      if (res.error) {
        setResetError(res.error)
      } else if (res.password) {
        setNewPassword(res.password)
      }
    } catch (e: any) {
      setResetError(e.message || 'Something went wrong.')
    } finally {
      setResetting(false)
    }
  }

  const handleCopy = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
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

        <div className="flex items-center justify-between pt-2 border-t">
          <Button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Save Tutor profile'}</Button>
        </div>
      </form>

      <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-900">Reset password</h4>
            <p className="text-xs leading-relaxed text-amber-700">
              Generate a new random password for this Tutor. The new password is shown once here and emailed to the Tutor.
            </p>
          </div>
        </div>

        {resetError && (
          <Alert variant="destructive">
            <AlertTitle>Password reset failed</AlertTitle>
            <AlertDescription>{resetError}</AlertDescription>
          </Alert>
        )}

        {newPassword && (
          <div className="space-y-3 rounded-lg border border-green-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-green-800">New password generated.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 select-all rounded border bg-neutral-100 px-3 py-1.5 font-mono text-sm tracking-wider">
                {newPassword}
              </code>
              <Button size="icon" variant="outline" className="h-9 w-9" onClick={handleCopy} type="button" aria-label="Copy new password">
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">The Tutor also receives this password by email.</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleResetPassword}
          disabled={resetting}
          className="border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          {resetting ? 'Resetting...' : 'Generate new password'}
        </Button>
      </div>

      <form action={deleteAction} className="space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <input type="hidden" name="tutorId" value={tutor.tutorId} />
        <input type="hidden" name="profileId" value={tutor.profileId} />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-destructive">Delete Tutor account</h4>
          <p className="text-sm text-muted-foreground">
            Permanently deletes this Tutor auth user and profile. Assigned classes will become unassigned where the database allows it.
          </p>
        </div>
        {deleteState.error && <Alert variant="destructive"><AlertTitle>Delete failed</AlertTitle><AlertDescription>{deleteState.error}</AlertDescription></Alert>}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input name="confirmText" placeholder="Type DELETE to confirm" autoComplete="off" />
          <Button type="submit" variant="destructive" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Tutor'}</Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name)
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}
