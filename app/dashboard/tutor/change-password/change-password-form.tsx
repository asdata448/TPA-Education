'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changeTutorPassword, type ChangePasswordState } from './actions'

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changeTutorPassword, {} as ChangePasswordState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Update the login password for your Tutor account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-5">
          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Password not changed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.success && (
            <Alert>
              <AlertTitle>Saved</AlertTitle>
              <AlertDescription>{state.success}</AlertDescription>
            </Alert>
          )}

          <PasswordField label="Current password" name="currentPassword" autoComplete="current-password" />
          <PasswordField label="New password" name="newPassword" autoComplete="new-password" />
          <PasswordField label="Confirm new password" name="confirmPassword" autoComplete="new-password" />

          <Button type="submit" disabled={pending}>
            {pending ? 'Changing...' : 'Change password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function PasswordField({ label, name, autoComplete }: { label: string; name: string; autoComplete: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="password" autoComplete={autoComplete} required minLength={8} />
    </div>
  )
}
