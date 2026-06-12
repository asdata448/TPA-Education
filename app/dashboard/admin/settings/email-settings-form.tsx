'use client'

import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateEmailSettings, type EmailSettings, type EmailSettingsState } from './actions'

export function EmailSettingsForm({ settings }: { settings: EmailSettings }) {
  const [state, action, pending] = useActionState(updateEmailSettings, {} as EmailSettingsState)

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Email notifications</CardTitle>
        <CardDescription>
          Configure which Admin inboxes receive operational notification emails.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Save failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.success && (
            <Alert>
              <AlertTitle>Saved</AlertTitle>
              <AlertDescription>{state.success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="adminNotificationEmails">Admin notification recipients</Label>
            <Textarea
              id="adminNotificationEmails"
              name="adminNotificationEmails"
              rows={6}
              defaultValue={settings.adminNotificationEmails.join('\n')}
              placeholder="admin@example.com"
            />
            <p className="text-sm text-muted-foreground">
              Enter one email per line. Commas and semicolons are also accepted.
            </p>
          </div>

          <Button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Save email settings'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
