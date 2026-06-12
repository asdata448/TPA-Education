import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { requireTutorId } from '../classes-data'
import { ChangePasswordForm } from './change-password-form'

export default async function TutorChangePasswordPage() {
  await requireTutorId()

  return (
    <main className="container mx-auto min-h-screen space-y-6 p-6">
      <div className="mx-auto flex max-w-xl items-center justify-between">
        <Link
          href="/dashboard/tutor"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <ChangePasswordForm />
    </main>
  )
}
