import { listAssignedClasses } from '../classes-data'
import { getTutorReports } from './report-actions'
import { TutorReportsManager } from './tutor-reports-manager'

export const revalidate = 0

export default async function TutorReportsPage() {
  const [classes, reports] = await Promise.all([
    listAssignedClasses(),
    getTutorReports(),
  ])

  return (
    <TutorReportsManager
      assignedClasses={classes.map((c) => ({
        id: c.id,
        studentName: c.studentName,
        subjectName: c.subjectName,
        tuitionFee: c.tuitionFee,
      }))}
      reports={reports}
    />
  )
}
