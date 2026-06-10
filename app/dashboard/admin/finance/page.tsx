import { getFinanceData } from './finance-actions'
import { FinanceManager } from './finance-manager'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const revalidate = 0

type SearchParams = Promise<{ month?: string }>

export default async function AdminFinancePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  // Default to current calendar month in format 'YYYY-MM'
  const today = new Date()
  const currentMonth = today.toISOString().substring(0, 7)
  const selectedMonth = params.month || currentMonth

  const classes = await getFinanceData(selectedMonth)

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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
          Quản lý Tài chính & Thanh toán
        </h1>
        <p className="text-muted-foreground">
          Theo dõi trạng thái đóng học phí của Phụ huynh và tự động tính toán, chuyển lương cho Gia sư.
        </p>
      </div>

      <FinanceManager initialClasses={classes} currentMonth={selectedMonth} />
    </main>
  )
}
