import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { listOpenClasses } from '../classes-data'
import { RequestClassForm } from './request-class-form'

export default async function OpenClassesPage() {
  const classes = await listOpenClasses()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lớp mở</CardTitle>
        <CardDescription>Thông tin phụ huynh sẽ hiện sau khi Admin phân công.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {classes.length === 0 ? (
          <p className="text-muted-foreground">Hiện không có lớp mở.</p>
        ) : (
          classes.map((classItem) => (
            <div key={classItem.id} className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">{classItem.subjectName || 'Lớp'}</h3>
                <p className="text-sm text-muted-foreground">Khối: {classItem.studentGrade || 'Chưa xác định'}</p>
              </div>
              <dl className="grid gap-2 text-sm">
                <div><dt className="font-medium">Hình thức</dt><dd className="text-muted-foreground">{classItem.mode}</dd></div>
                <div><dt className="font-medium">Học phí</dt><dd className="text-muted-foreground">{classItem.tuitionFee ?? 'Chưa xác định'}</dd></div>
                <div><dt className="font-medium">Lịch học</dt><dd className="text-muted-foreground">{classItem.scheduleNotes || 'Chưa xác định'}</dd></div>
                <div><dt className="font-medium">Yêu cầu</dt><dd className="text-muted-foreground">{classItem.requirements || 'Chưa xác định'}</dd></div>
              </dl>
              <RequestClassForm classId={classItem.id} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
