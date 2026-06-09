import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTutorMaterialLibrary } from '../../admin/materials-data'
import { TutorMaterialLibrary } from '../tutor-material-library'

export default async function TutorLibraryPage() {
  const items = await getTutorMaterialLibrary()
  return <main className="container mx-auto space-y-6 p-6"><Card><CardHeader><CardTitle>Teaching material library</CardTitle><CardDescription>Center-approved materials stored in private Cloudflare R2.</CardDescription></CardHeader><CardContent>{items.length === 0 ? <p className="text-muted-foreground">No materials available.</p> : <TutorMaterialLibrary items={items} />}</CardContent></Card></main>
}
