import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminFeedbackItems } from '../document-feedback-data'
import { DocumentFeedbackManager } from '../document-feedback-manager'

export default async function AdminDocumentFeedbackPage() {
  const items = await getAdminFeedbackItems()
  return <main className="container mx-auto min-h-screen space-y-6 p-6"><Card><CardHeader><CardTitle>Document feedback</CardTitle><CardDescription>Resolve Tutor document requests and issue reports.</CardDescription></CardHeader><CardContent><DocumentFeedbackManager items={items} /></CardContent></Card></main>
}
