import { Card, CardContent } from '@/components/ui/card'
import { getTutorMaterialLibrary } from '../../admin/materials-data'
import { TutorMaterialLibrary } from '../tutor-material-library'
import { TutorPageHeader } from '../_components/tutor-page-header'
import { FolderArchive } from 'lucide-react'

export default async function TutorLibraryPage() {
  const items = await getTutorMaterialLibrary()
  return (
    <div className="space-y-6">
      <TutorPageHeader
        color="orange"
        icon={FolderArchive}
        title="Thư viện tài liệu"
        subtitle="Tài liệu được Trung tâm phê duyệt, lưu trữ trên Cloudflare R2."
      />
      <Card>
        <CardContent className="pt-6">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Chưa có tài liệu.</p>
          ) : (
            <TutorMaterialLibrary items={items} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
