'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Plus, Edit3, Copy, ExternalLink, FileSpreadsheet, Check } from 'lucide-react'
import { saveProgressReport, type ReportActionState } from './report-actions'
import { toast } from 'sonner'
import Link from 'next/link'

type ReportData = {
  id: string
  class_id: string
  reporting_month: string
  lessons_completed: number
  rating_comprehension: number
  rating_homework: number
  rating_attendance: number
  rating_attitude: number
  teacher_comments: string
  next_month_plan: string | null
  tuition_fee: number
  created_at: string
}

export function ReportManager({
  classId,
  defaultTuitionFee,
  reports,
}: {
  classId: string
  defaultTuitionFee: number
  reports: ReportData[]
}) {
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [reportingMonth, setReportingMonth] = useState('')
  const [lessonsCompleted, setLessonsCompleted] = useState(8)
  const [ratingComprehension, setRatingComprehension] = useState(5)
  const [ratingHomework, setRatingHomework] = useState(5)
  const [ratingAttendance, setRatingAttendance] = useState(5)
  const [ratingAttitude, setRatingAttitude] = useState(5)
  const [teacherComments, setTeacherComments] = useState('')
  const [nextMonthPlan, setNextMonthPlan] = useState('')
  const [tuitionFee, setTuitionFee] = useState(defaultTuitionFee)

  const openCreateModal = () => {
    const today = new Date()
    const currentMonth = today.toISOString().substring(0, 7)
    
    setEditId(null)
    setReportingMonth(currentMonth)
    setLessonsCompleted(8)
    setRatingComprehension(5)
    setRatingHomework(5)
    setRatingAttendance(5)
    setRatingAttitude(5)
    setTeacherComments('')
    setNextMonthPlan('')
    setTuitionFee(defaultTuitionFee)
    setModalOpen(true)
  }

  const openEditModal = (r: ReportData) => {
    setEditId(r.id)
    setReportingMonth(r.reporting_month)
    setLessonsCompleted(r.lessons_completed)
    setRatingComprehension(r.rating_comprehension)
    setRatingHomework(r.rating_homework)
    setRatingAttendance(r.rating_attendance)
    setRatingAttitude(r.rating_attitude)
    setTeacherComments(r.teacher_comments)
    setNextMonthPlan(r.next_month_plan || '')
    setTuitionFee(r.tuition_fee)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportingMonth || !teacherComments) {
      toast.error('Vui lòng nhập đầy đủ các thông tin bắt buộc.')
      return
    }

    const formData = new FormData()
    formData.append('classId', classId)
    formData.append('reportingMonth', reportingMonth)
    formData.append('lessonsCompleted', String(lessonsCompleted))
    formData.append('ratingComprehension', String(ratingComprehension))
    formData.append('ratingHomework', String(ratingHomework))
    formData.append('ratingAttendance', String(ratingAttendance))
    formData.append('ratingAttitude', String(ratingAttitude))
    formData.append('teacherComments', teacherComments)
    formData.append('nextMonthPlan', nextMonthPlan)
    formData.append('tuitionFee', String(tuitionFee))

    startTransition(async () => {
      const state = await saveProgressReport({} as ReportActionState, formData)
      if (state.error) {
        toast.error(state.error)
      } else {
        toast.success(state.success || 'Lưu phiếu báo cáo thành công!')
        setModalOpen(false)
      }
    })
  }

  const copyShareLink = (reportId: string) => {
    const shareUrl = `${window.location.origin}/reports/${reportId}`
    navigator.clipboard.writeText(shareUrl)
    setCopiedId(reportId)
    toast.success('Đã sao chép liên kết báo cáo!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const renderStars = (rating: number, setRating?: (val: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setRating && setRating(star)}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30 hover:text-amber-300'
            } ${setRating ? 'cursor-pointer transition-colors' : ''}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F2A44]">Báo cáo tiến độ & Học phí</h3>
          <p className="text-xs text-muted-foreground">Tạo và quản lý các phiếu báo cáo học tập định kỳ gửi phụ huynh.</p>
        </div>
        <Button onClick={openCreateModal} size="sm" className="bg-[#0F2A44] hover:bg-[#1a3a5c]">
          <Plus className="h-4 w-4 mr-1" /> Viết báo cáo mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tháng báo cáo</TableHead>
                  <TableHead>Số buổi học</TableHead>
                  <TableHead>Học phí ghi nhận</TableHead>
                  <TableHead>Đánh giá trung bình</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Chưa có phiếu báo cáo nào được tạo cho lớp này.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((r) => {
                    const avgRating = (r.rating_comprehension + r.rating_homework + r.rating_attendance + r.rating_attitude) / 4
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-semibold">{r.reporting_month}</TableCell>
                        <TableCell>{r.lessons_completed} buổi</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.tuition_fee)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm">{avgRating.toFixed(1)}</span>
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => copyShareLink(r.id)}>
                            {copiedId === r.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/reports/${r.id}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditModal(r)}>
                            <Edit3 className="h-4 w-4" />
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

      {/* CREATE/EDIT REPORT DIALOG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Chỉnh sửa Phiếu báo cáo' : 'Tạo Phiếu báo cáo tiến độ học tập'}</DialogTitle>
            <DialogDescription>
              Điền các đánh giá học lực của học sinh và ghi nhận số tiền học phí trong tháng báo cáo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="reportingMonth">Tháng báo cáo</Label>
                <Input
                  id="reportingMonth"
                  type="month"
                  required
                  value={reportingMonth}
                  onChange={(e) => setReportingMonth(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lessonsCompleted">Số buổi đã học</Label>
                <Input
                  id="lessonsCompleted"
                  type="number"
                  required
                  value={lessonsCompleted}
                  onChange={(e) => setLessonsCompleted(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="tuitionFee">Học phí tháng này (VND)</Label>
              <Input
                id="tuitionFee"
                type="number"
                required
                value={tuitionFee}
                onChange={(e) => setTuitionFee(Number(e.target.value))}
              />
            </div>

            {/* Ratings */}
            <div className="border-t border-border pt-3 space-y-3">
              <h4 className="font-semibold text-sm text-[#0F2A44]">Đánh giá học lực (1-5★)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Khả năng tiếp thu bài</Label>
                  {renderStars(ratingComprehension, setRatingComprehension)}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Tự giác làm bài tập</Label>
                  {renderStars(ratingHomework, setRatingHomework)}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Chuyên cần & Đúng giờ</Label>
                  {renderStars(ratingAttendance, setRatingAttendance)}
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Thái độ trong buổi học</Label>
                  {renderStars(ratingAttitude, setRatingAttitude)}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-3 border-t border-border pt-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="teacherComments">Nhận xét chi tiết của Gia sư (Tối đa 200 ký tự)</Label>
                  <span className="text-[10px] text-muted-foreground">{teacherComments.length}/200</span>
                </div>
                <Textarea
                  id="teacherComments"
                  required
                  maxLength={200}
                  placeholder="Gia sư viết đánh giá thế mạnh, các điểm cần khắc phục và tinh thần học tập chung..."
                  rows={4}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="nextMonthPlan">Định hướng & Lộ trình tiếp theo (Tối đa 200 ký tự)</Label>
                  <span className="text-[10px] text-muted-foreground">{nextMonthPlan.length}/200</span>
                </div>
                <Textarea
                  id="nextMonthPlan"
                  maxLength={200}
                  placeholder="Kiến thức sẽ tiếp tục học trong tháng tới..."
                  rows={3}
                  value={nextMonthPlan}
                  onChange={(e) => setNextMonthPlan(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="bg-[#0F2A44] hover:bg-[#1a3a5c]">
                {isPending ? 'Đang lưu...' : 'Lưu báo cáo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
