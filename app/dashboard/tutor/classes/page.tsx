import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { listAssignedClasses } from '../classes-data'
import Link from 'next/link'

export default async function TutorClassesPage() {
  const classes = await listAssignedClasses()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lớp của tôi</CardTitle>
        <CardDescription>Các lớp đang được phân công.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {classes.length === 0 ? (
          <p className="text-muted-foreground">Chưa có lớp nào được phân công.</p>
        ) : (
          classes.map(c => (
            <Link key={c.id} href={`/dashboard/tutor/classes/${c.id}`} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold">{c.subjectName || 'Lớp'} - {c.studentName}</h3>
              <p className="text-sm text-muted-foreground">{c.scheduleNotes || 'Chưa có lịch'}</p>
              <p className="text-sm">{c.status} / {c.mode}</p>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
