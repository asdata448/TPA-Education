import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getEmailSettings } from './actions'
import { EmailSettingsForm } from './email-settings-form'

export default async function AdminSettingsPage() {
  const settings = await getEmailSettings()

  return (
    <main className="container mx-auto min-h-screen space-y-6 p-6">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link
          href="/dashboard/admin"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Admin Dashboard
        </Link>
      </div>

      <EmailSettingsForm settings={settings} />
    </main>
  )
}
