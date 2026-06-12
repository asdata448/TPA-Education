import { getTutorBankDetails } from './actions'
import { BankSettingsForm } from './bank-settings-form'

export const revalidate = 0

export default async function TutorBankSettingsPage() {
  const bankDetails = await getTutorBankDetails()

  return <BankSettingsForm initialData={bankDetails} />
}
