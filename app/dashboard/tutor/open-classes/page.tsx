import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { listOpenClasses } from '../classes-data'
import { RequestClassForm } from './request-class-form'

export default async function OpenClassesPage() {
  const classes = await listOpenClasses()

  return (
    <main className="container mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Open classes</CardTitle>
          <CardDescription>Parent contact details are hidden until Admin assigns you to the class.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {classes.length === 0 ? (
            <p className="text-muted-foreground">No open classes.</p>
          ) : (
            classes.map((classItem) => (
              <div key={classItem.id} className="space-y-4 rounded-lg border p-4">
                <div>
                  <h3 className="font-semibold">{classItem.subjectName || 'Class'}</h3>
                  <p className="text-sm text-muted-foreground">Student grade: {classItem.studentGrade || 'Not specified'}</p>
                </div>
                <dl className="grid gap-2 text-sm">
                  <div><dt className="font-medium">Mode</dt><dd className="text-muted-foreground">{classItem.mode}</dd></div>
                  <div><dt className="font-medium">Tuition fee</dt><dd className="text-muted-foreground">{classItem.tuitionFee ?? 'Not specified'}</dd></div>
                  <div><dt className="font-medium">Schedule</dt><dd className="text-muted-foreground">{classItem.scheduleNotes || 'Not specified'}</dd></div>
                  <div><dt className="font-medium">Requirements</dt><dd className="text-muted-foreground">{classItem.requirements || 'Not specified'}</dd></div>
                </dl>
                <RequestClassForm classId={classItem.id} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
