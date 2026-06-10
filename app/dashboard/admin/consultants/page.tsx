import { requireActiveAdmin } from '../data'
import { getConsultantRequests } from './consultant-actions'
import { ConsultantsManager } from './consultants-manager'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminConsultantsPage() {
  await requireActiveAdmin()
  const requests = await getConsultantRequests()

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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-amber-600 bg-clip-text text-transparent">
          Quản lý Yêu cầu Tư vấn tuyển sinh
        </h1>
        <p className="text-muted-foreground">
          Xem thông tin liên hệ, lớp học, nhu cầu của học sinh và cập nhật ghi chú tư vấn tuyển sinh.
        </p>
      </div>

      <ConsultantsManager initialRequests={requests} />
    </main>
  )
}
