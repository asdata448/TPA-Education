import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireActiveAdmin } from '../../data'
import { getAdminClassData } from '../../classes-data'
import { EditClassForm } from '../edit-class-form'

export default async function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  await requireActiveAdmin()
  const admin = createAdminClient()

  // Fetch target class data
  const { data: c, error } = await admin
    .from('classes')
    .select('id, student_name, student_grade, subject_id, parent_name, parent_phone, parent_email, tutor_id, mode, location, tuition_fee, schedule_notes, requirements, notes, status')
    .eq('id', classId)
    .single()

  if (error || !c) notFound()

  // Load subject/tutor options
  const classData = await getAdminClassData()

  const classDetail = {
    id: c.id,
    studentName: c.student_name,
    studentGrade: c.student_grade,
    subjectId: c.subject_id,
    parentName: c.parent_name,
    parentPhone: c.parent_phone,
    parentEmail: c.parent_email,
    tutorId: c.tutor_id,
    mode: c.mode,
    location: c.location,
    tuitionFee: c.tuition_fee ? Number(c.tuition_fee) : null,
    scheduleNotes: c.schedule_notes,
    requirements: c.requirements,
    notes: c.notes,
    status: c.status,
  }

  return (
    <main className="container mx-auto space-y-6 px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/admin" className="underline-offset-4 hover:underline">
              ← Quay lại Trang quản trị
            </Link>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Chi tiết lớp học</h1>
          <p className="text-muted-foreground">Học sinh: {c.student_name}</p>
        </div>
        <Badge variant={c.status === 'assigned' ? 'default' : c.status === 'open' ? 'secondary' : 'outline'}>
          {c.status === 'open' ? 'Đang mở' : c.status === 'assigned' ? 'Đã giao' : c.status === 'paused' ? 'Tạm dừng' : c.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
        </Badge>
      </div>

      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Chỉnh sửa thông tin lớp</CardTitle>
          <CardDescription>Cập nhật thông tin học phí, gia sư, phụ huynh hoặc trạng thái lớp.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditClassForm classDetail={classDetail} subjects={classData.subjects} tutors={classData.tutors} />
        </CardContent>
      </Card>
    </main>
  )
}
