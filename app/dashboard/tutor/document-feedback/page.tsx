import { getTutorFeedbackContext } from '../document-feedback-data'
import { TutorDocumentFeedback } from './tutor-document-feedback'

export default async function TutorDocumentFeedbackPage() {
  const context = await getTutorFeedbackContext()
  return <TutorDocumentFeedback context={context} />
}
