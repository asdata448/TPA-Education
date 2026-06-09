import { getTutorFeedbackContext } from '../document-feedback-data'
import { TutorDocumentFeedback } from './tutor-document-feedback'

export default async function TutorDocumentFeedbackPage() {
  const context = await getTutorFeedbackContext()
  return <main className="container mx-auto min-h-screen space-y-6 p-6"><TutorDocumentFeedback context={context} /></main>
}
