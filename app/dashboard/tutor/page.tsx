import {
  requireTutorId,
  listAssignedClasses,
  getTutorTodaySessions,
  getPendingReportCount,
} from './classes-data'
import { getTutorFeedbackContext } from './document-feedback-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { BookOpen, CalendarDays, FileText, Bell, Clock, Home } from 'lucide-react'
import { TutorPageHeader } from './_components/tutor-page-header'

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
    <div className="space-y-4 md:space-y-6">
      {/* Page header */}
      <TutorPageHeader color="amber" icon={Home} title="Tổng quan" subtitle="Xin chào! Đây là trang tổng quan của bạn." />

      {/* Stat Cards — mobile: horizontal scroll strip, desktop: 4-col grid */}
      {/* Mobile: compact horizontal strip */}
      <div className="flex gap-3 overflow-x-auto pb-1 md:hidden -mx-1 px-1 snap-x snap-mandatory">
        <Link href="/dashboard/tutor/classes" className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 px-3 py-2.5 min-w-[130px] snap-start shrink-0">
          <div className="rounded-full bg-blue-500 p-1.5">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-none">{activeClasses.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Lớp đang dạy</p>
          </div>
        </Link>
        <Link href="/dashboard/tutor/calendar" className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900 px-3 py-2.5 min-w-[130px] snap-start shrink-0">
          <div className="rounded-full bg-emerald-500 p-1.5">
            <CalendarDays className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">{todaySessions.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Buổi hôm nay</p>
          </div>
        </Link>
        <Link href="/dashboard/tutor/reports" className="flex items-center gap-2.5 rounded-lg border border-violet-200 bg-violet-50/50 dark:bg-violet-950/20 dark:border-violet-900 px-3 py-2.5 min-w-[130px] snap-start shrink-0">
          <div className="rounded-full bg-violet-500 p-1.5">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-violet-600 dark:text-violet-400 leading-none">{pendingReports}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Chưa nộp</p>
          </div>
        </Link>
        <Link href="/dashboard/tutor/document-feedback" className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900 px-3 py-2.5 min-w-[130px] snap-start shrink-0">
          <div className="rounded-full bg-amber-500 p-1.5">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 leading-none">{resolvedFeedback.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Phản hồi</p>
          </div>
        </Link>
      </div>

      {/* Desktop: 4 cards grid */}
      <div className="hidden md:grid gap-4 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lớp đang dạy</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeClasses.length}</p>
              </div>
              <div className="rounded-full bg-blue-500 p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Buổi học hôm nay</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{todaySessions.length}</p>
              </div>
              <div className="rounded-full bg-emerald-500 p-2">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Báo cáo chưa nộp</p>
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{pendingReports}</p>
              </div>
              <div className="rounded-full bg-violet-500 p-2">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            {pendingReports > 0 && (
              <Link href="/dashboard/tutor/reports" className="mt-2 inline-block text-xs text-violet-500 hover:underline font-medium">
                Nộp báo cáo ngay →
              </Link>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Phản hồi mới</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{resolvedFeedback.length}</p>
              </div>
              <div className="rounded-full bg-amber-500 p-2">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Today's schedule + Recent notifications */}
      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 md:pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-sm md:text-base font-semibold">Lịch hôm nay</CardTitle>
            <Link href="/dashboard/tutor/calendar" className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            {todaySessions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">Hôm nay không có buổi học nào.</p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {todaySessions.map(s => (
                  <div key={s.id} className="flex items-center gap-2 md:gap-3 rounded-md border p-2 md:p-3">
                    <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-1 md:p-1.5">
                      <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium truncate">{s.className}</p>
                      <p className="text-[11px] md:text-xs text-muted-foreground">{s.startTime} - {s.endTime}</p>
                    </div>
                    <span className={`text-[10px] md:text-xs rounded-full px-1.5 md:px-2 py-0.5 whitespace-nowrap font-medium ${
                      s.status === 'attended'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : s.status === 'absent'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                          : s.status === 'cancelled'
                            ? 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {s.status === 'scheduled' ? 'Chờ DD' : s.status === 'attended' ? 'Đã DD' : s.status === 'absent' ? 'Nghỉ' : s.status === 'cancelled' ? 'Hủy' : s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 md:pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-sm md:text-base font-semibold">Thông báo gần đây</CardTitle>
            <Link href="/dashboard/tutor/document-feedback" className="text-xs md:text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            {recentFeedback.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center">Chưa có thông báo nào.</p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {recentFeedback.map(fb => (
                  <div key={fb.id} className="flex items-start gap-2 md:gap-3 rounded-md border p-2 md:p-3">
                    <div className={`mt-1 h-1.5 w-1.5 md:h-2 md:w-2 shrink-0 rounded-full ${
                      fb.status === 'pending' ? 'bg-amber-500' : fb.status === 'done' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm truncate">{fb.message.slice(0, 60)}{fb.message.length > 60 ? '...' : ''}</p>
                      <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                        {fb.kind === 'material_request' ? 'Yêu cầu TL' : 'Báo cáo TL'}
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
