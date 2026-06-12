import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAssignedClass } from '../../classes-data'

export const revalidate = 0

type Params = Promise<{ classId: string }>

export default async function TutorClassDetailPage({ params }: { params: Params }) {
  const { classId } = await params
  const c = await getAssignedClass(classId)
  if (!c) notFound()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {c.subjectName || 'Lớp'} - {c.studentName}
        </CardTitle>
        <CardDescription>
          {c.status} / {c.mode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>
          <b>Học sinh:</b> {c.studentName}
          {c.studentGrade ? ` (${c.studentGrade})` : ''}
        </p>
        <p>
          <b>Phụ huynh:</b> {c.parentName || '-'} {c.parentPhone ? `/ ${c.parentPhone}` : ''}
        </p>
        <p>
          <b>Học phí:</b> {c.tuitionFee ?? '-'}
        </p>
        <p>
          <b>Lịch học:</b> {c.scheduleNotes || '-'}
        </p>
        <p>
          <b>Yêu cầu:</b> {c.requirements || '-'}
        </p>
        <p>
          <b>Ghi chú:</b> {c.notes || '-'}
        </p>
      </CardContent>
    </Card>
  )
}
