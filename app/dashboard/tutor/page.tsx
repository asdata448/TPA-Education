import {
  requireTutorId,
  listAssignedClasses,
  getTutorTodaySessions,
  getPendingReportCount,
} from './classes-data'
import { getTutorFeedbackContext } from './document-feedback-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { BookOpen, CalendarDays, FileText, Bell, Clock } from 'lucide-react'

export const revalidate = 0

export default async function TutorDashboardPage() {
  const [tutorId, classes, todaySessions, pendingReports, feedbackCtx] = await Promise.all([
    requireTutorId(),
    listAssignedClasses(),
    getTutorTodaySessions(),
    getPendingReportCount(),
    getTutorFeedbackContext().catch(() => ({ feedback: [] })),
  ])

  const activeClasses = classes.filter(c => c.status !== 'cancelled')
  const resolvedFeedback = feedbackCtx.feedback.filter(f => f.status === 'done' || f.status === 'rejected')
  const recentFeedback = feedbackCtx.feedback.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F2A44] dark:text-[#F8F5EC]">
          Tổng quan
        </h1>
        <p className="text-muted-foreground">Xin chào! Đây là trang tổng quan của bạn.</p>
      </div>

      {/* 4 Stat Cards — each with unique color */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Classes — Blue */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lớp đang dạy</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeClasses.length}</p>
              </div>
              <div className="rounded-full bg-blue-50 dark:bg-blue-950/30 p-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today Sessions — Emerald */}
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Buổi học hôm nay</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{todaySessions.length}</p>
              </div>
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-2">
                <CalendarDays className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reports — Violet */}
        <Card className="border-l-4 border-l-violet-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Báo cáo chưa nộp</p>
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{pendingReports}</p>
              </div>
              <div className="rounded-full bg-violet-50 dark:bg-violet-950/30 p-2">
                <FileText className="h-6 w-6 text-violet-500" />
              </div>
            </div>
            {pendingReports > 0 && (
              <Link href="/dashboard/tutor/reports" className="mt-2 inline-block text-xs text-violet-500 hover:underline font-medium">
                Nộp báo cáo ngay →
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Notifications — Amber */}
        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Phản hồi mới</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{resolvedFeedback.length}</p>
              </div>
              <div className="rounded-full bg-amber-50 dark:bg-amber-950/30 p-2">
                <Bell className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Today's schedule + Recent notifications */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Lịch hôm nay</CardTitle>
            <Link href="/dashboard/tutor/calendar" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent>
            {todaySessions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Hôm nay không có buổi học nào.</p>
            ) : (
              <div className="space-y-3">
                {todaySessions.map(s => (
                  <div key={s.id} className="flex items-center gap-3 rounded-md border p-3">
                    <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.className}</p>
                      <p className="text-xs text-muted-foreground">{s.startTime} - {s.endTime}</p>
                    </div>
                    <span className={`text-xs rounded-full px-2 py-0.5 whitespace-nowrap font-medium ${
                      s.status === 'attended'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : s.status === 'absent'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                          : s.status === 'cancelled'
                            ? 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {s.status === 'scheduled' ? 'Chờ điểm danh' : s.status === 'attended' ? 'Đã điểm danh' : s.status === 'absent' ? 'Nghỉ' : s.status === 'cancelled' ? 'Đã hủy' : s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Thông báo gần đây</CardTitle>
            <Link href="/dashboard/tutor/document-feedback" className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent>
            {recentFeedback.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Chưa có thông báo nào.</p>
            ) : (
              <div className="space-y-3">
                {recentFeedback.map(fb => (
                  <div key={fb.id} className="flex items-start gap-3 rounded-md border p-3">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      fb.status === 'pending' ? 'bg-amber-500' : fb.status === 'done' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{fb.message.slice(0, 80)}{fb.message.length > 80 ? '...' : ''}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fb.kind === 'material_request' ? 'Yêu cầu tài liệu' : 'Báo cáo tài liệu'}
                        {' · '}
                        <span className={
                          fb.status === 'done' ? 'text-emerald-600 dark:text-emerald-400' :
                          fb.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                          'text-amber-600 dark:text-amber-400'
                        }>
                          {fb.status === 'done' ? 'Đã xử lý' : fb.status === 'rejected' ? 'Từ chối' : 'Đang chờ'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
