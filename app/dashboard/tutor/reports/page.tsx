import { listAssignedClasses } from '../classes-data'
import { getTutorReports } from './report-actions'
import { TutorReportsManager } from './tutor-reports-manager'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const revalidate = 0

export default async function TutorReportsPage() {
  const [classes, reports] = await Promise.all([
    listAssignedClasses(),
    getTutorReports(),
  ])

  return (
    <main className="container mx-auto min-h-screen space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/tutor"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <TutorReportsManager
        assignedClasses={classes.map((c) => ({
          id: c.id,
          studentName: c.studentName,
          subjectName: c.subjectName,
          tuitionFee: c.tuitionFee,
        }))}
        reports={reports}
      />
    </main>
  )
}
