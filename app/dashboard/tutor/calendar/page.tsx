import { getTutorCalendarData } from '../../admin/calendar/calendar-actions'
import { CalendarView } from '../../admin/calendar/calendar-view'
import { CalendarDays } from 'lucide-react'
import { TutorPageHeader } from '../_components/tutor-page-header'

export const revalidate = 0

export default async function TutorCalendarPage() {
  const data = await getTutorCalendarData()

  return (
    <div className="space-y-4">
      <TutorPageHeader color="emerald" icon={CalendarDays} title="Thời khóa biểu dạy học" subtitle="Xem lịch dạy học định kỳ, điểm danh và nhận xét từng buổi." />

      <CalendarView
        classes={data.classes}
        initialSchedules={data.schedules}
        initialSessions={data.sessions}
        isTutorMode={true}
        currentTutorId={data.tutorId}
      />
    </div>
  )
}
