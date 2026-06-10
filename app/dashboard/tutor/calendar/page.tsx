import { getTutorCalendarData } from '../../admin/calendar/calendar-actions'
import { CalendarView } from '../../admin/calendar/calendar-view'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function TutorCalendarPage() {
  const data = await getTutorCalendarData()

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/tutor"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại Dashboard
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-[#0F2A44] bg-clip-text text-transparent">
          Thời khóa biểu dạy học
        </h1>
        <p className="text-muted-foreground">
          Xem lịch dạy học định kỳ hàng tuần, thực hiện điểm danh và nhận xét từng buổi học cụ thể.
        </p>
      </div>

      <CalendarView
        classes={data.classes}
        initialSchedules={data.schedules}
        initialSessions={data.sessions}
        isTutorMode={true}
        currentTutorId={data.tutorId}
      />
    </main>
  )
}
