import { requireActiveAdmin } from '../data'
import { getAllProgressReports } from './reports-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ChevronLeft, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminReportsPage() {
  await requireActiveAdmin()
  const reports = await getAllProgressReports()

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
          Xem và kiểm tra toàn bộ các phiếu báo cáo học tập và kết quả của học sinh do Gia sư gửi lên.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Phiếu Báo cáo</CardTitle>
          <CardDescription>
            Thống kê đánh giá học lực, chuyên cần, thái độ và nhận xét hàng tháng của từng học sinh.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh / Lớp</TableHead>
                  <TableHead>Tháng báo cáo</TableHead>
                  <TableHead>Gia sư</TableHead>
                  <TableHead>Đánh giá TB</TableHead>
                  <TableHead>Học phí</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead className="text-right">Xem chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      Chưa có phiếu báo cáo nào được gửi lên hệ thống.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((r) => {
                    const avgRating = (r.ratingComprehension + r.ratingHomework + r.ratingAttendance + r.ratingAttitude) / 4
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-semibold">{r.studentName}</div>
                          <div className="text-xs text-muted-foreground">{r.subjectName}</div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Badge variant="secondary" className="flex items-center w-fit gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {r.reportingMonth}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{r.tutorName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-bold">{avgRating.toFixed(1)}</span>
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.tuitionFee)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/reports/${r.id}`} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Mở phiếu
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
