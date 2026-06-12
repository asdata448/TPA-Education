import { requireTutorId } from '../classes-data'
import { ChangePasswordForm } from './change-password-form'

export default async function TutorChangePasswordPage() {
  await requireTutorId()

  return <ChangePasswordForm />
}
