import { getTutorBankDetails } from './actions'
import { BankSettingsForm } from './bank-settings-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const revalidate = 0

export default async function TutorBankSettingsPage() {
  const bankDetails = await getTutorBankDetails()

  return (
    <main className="container mx-auto min-h-screen space-y-6 p-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <Link
          href="/dashboard/tutor"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <BankSettingsForm initialData={bankDetails} />
    </main>
  )
}
