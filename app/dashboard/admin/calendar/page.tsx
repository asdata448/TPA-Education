import { getAdminCalendarData } from './calendar-actions'
import { CalendarView } from './calendar-view'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminCalendarPage() {
  const data = await getAdminCalendarData()

  return (
    <main className="container mx-auto space-y-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admin"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại Dashboard
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-[#0F2A44] bg-clip-text text-transparent">
          Lịch học tuyển sinh & Đặt lịch
        </h1>
        <p className="text-muted-foreground">
          Quản lý lịch lặp lại hàng tuần của từng học sinh và điểm danh, dời/báo nghỉ chi tiết từng buổi học cụ thể.
        </p>
      </div>

      <CalendarView
        classes={data.classes}
        initialSchedules={data.schedules}
        initialSessions={data.sessions}
      />
    </main>
  )
}
