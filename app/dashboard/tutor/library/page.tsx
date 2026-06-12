import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTutorMaterialLibrary } from '../../admin/materials-data'
import { TutorMaterialLibrary } from '../tutor-material-library'

export default async function TutorLibraryPage() {
  const items = await getTutorMaterialLibrary()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thư viện tài liệu</CardTitle>
        <CardDescription>Tài liệu được Trung tâm phê duyệt, lưu trữ trên Cloudflare R2.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Chưa có tài liệu.</p>
        ) : (
          <TutorMaterialLibrary items={items} />
        )}
      </CardContent>
    </Card>
  )
}
