import { getTutorCalendarData } from '../../admin/calendar/calendar-actions'
import { CalendarView } from '../../admin/calendar/calendar-view'

export const revalidate = 0

export default async function TutorCalendarPage() {
  const data = await getTutorCalendarData()

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F2A44] dark:text-[#F8F5EC]">
          Thời khóa biểu dạy học
        </h1>
        <p className="text-muted-foreground">
          Xem lịch dạy học định kỳ, điểm danh và nhận xét từng buổi.
        </p>
      </div>

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
