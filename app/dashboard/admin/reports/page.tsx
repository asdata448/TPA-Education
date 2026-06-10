import { requireActiveAdmin } from '../data'
import { getAllProgressReports } from './reports-data'
import { getAdminClasses } from './report-actions'
import { ReportsManager } from './reports-manager'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminReportsPage() {
  await requireActiveAdmin()
  const reports = await getAllProgressReports()
  const classes = await getAdminClasses()

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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Quản lý Phiếu Báo cáo Tiến độ
        </h1>
        <p className="text-muted-foreground">
          Xem, chỉnh sửa, tạo mới hoặc xóa các phiếu báo cáo học tập và kết quả của học sinh.
        </p>
      </div>

      <ReportsManager initialReports={reports} classes={classes} />
    </main>
  )
}
