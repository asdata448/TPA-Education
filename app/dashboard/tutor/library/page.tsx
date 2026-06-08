import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTutorMaterialLibrary } from '../../admin/materials-data'

export default async function TutorLibraryPage() {
  const items = await getTutorMaterialLibrary()
  return <main className="container mx-auto space-y-6 p-6"><Card><CardHeader><CardTitle>Teaching material library</CardTitle><CardDescription>Center-approved materials stored in private Cloudflare R2.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">{items.length===0?<p className="text-muted-foreground">No materials available.</p>:items.map(item=><div key={item.id} className="space-y-3 rounded-lg border p-4"><div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.subjectName||'General'} {item.gradeLevel?`/ ${item.gradeLevel}`:''}</p></div><p className="text-sm">{item.description||'No description.'}</p><div className="space-y-1">{item.files.map(file=><a key={file.id} className="block text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/materials/${file.id}/download`} target="_blank" rel="noreferrer">{file.fileName}</a>)}</div></div>)}</CardContent></Card></main>
}
