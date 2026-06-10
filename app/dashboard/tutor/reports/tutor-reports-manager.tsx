'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Plus, Edit3, Copy, ExternalLink, Check } from 'lucide-react'
import { saveProgressReportFromDashboard, type ReportActionState } from './report-actions'
import { toast } from 'sonner'
import Link from 'next/link'

type AssignedClass = {
  id: string
  studentName: string
  subjectName: string | null
  tuitionFee: number | null
}

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
  studentName: string
  subjectName: string
}

export function TutorReportsManager({
  assignedClasses,
  reports,
}: {
  assignedClasses: AssignedClass[]
  reports: ReportData[]
}) {
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form states
  const [editId, setEditId] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useState('')
  const [reportingMonth, setReportingMonth] = useState('')
  const [lessonsCompleted, setLessonsCompleted] = useState(8)
  const [ratingComprehension, setRatingComprehension] = useState(5)
  const [ratingHomework, setRatingHomework] = useState(5)
  const [ratingAttendance, setRatingAttendance] = useState(5)
  const [ratingAttitude, setRatingAttitude] = useState(5)
  const [teacherComments, setTeacherComments] = useState('')
  const [nextMonthPlan, setNextMonthPlan] = useState('')
  const [tuitionFee, setTuitionFee] = useState(0)

  const openCreateModal = () => {
    const today = new Date()
    const currentMonth = today.toISOString().substring(0, 7)
    
    setEditId(null)
    setSelectedClassId(assignedClasses[0]?.id || '')
    setReportingMonth(currentMonth)
    setLessonsCompleted(8)
    setRatingComprehension(5)
    setRatingHomework(5)
    setRatingAttendance(5)
    setRatingAttitude(5)
    setTeacherComments('')
    setNextMonthPlan('')
    setTuitionFee(assignedClasses[0]?.tuitionFee || 0)
    setModalOpen(true)
  }

  const openEditModal = (r: ReportData) => {
    setEditId(r.id)
    setSelectedClassId(r.class_id)
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

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    const cls = assignedClasses.find(c => c.id === classId)
    if (cls) {
      setTuitionFee(cls.tuitionFee || 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClassId || !reportingMonth || !teacherComments) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.')
      return
    }

    const formData = new FormData()
    formData.append('classId', selectedClassId)
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
      const state = await saveProgressReportFromDashboard({} as ReportActionState, formData)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0F2A44]">Báo cáo tiến độ học tập</h2>
          <p className="text-sm text-muted-foreground">Viết và gửi các phiếu báo cáo học tập & thông tin đóng học phí hàng tháng cho phụ huynh.</p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#0F2A44] hover:bg-[#1a3a5c]">
          <Plus className="h-4 w-4 mr-1" /> Viết báo cáo mới
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh / Lớp</TableHead>
                  <TableHead>Tháng báo cáo</TableHead>
                  <TableHead>Số buổi dạy</TableHead>
                  <TableHead>Học phí ghi nhận</TableHead>
                  <TableHead>Đánh giá trung bình</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Bạn chưa tạo phiếu báo cáo nào. Hãy nhấn "Viết báo cáo mới" để bắt đầu.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((r) => {
                    const avgRating = (r.rating_comprehension + r.rating_homework + r.rating_attendance + r.rating_attitude) / 4
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-semibold">{r.studentName}</div>
                          <div className="text-xs text-muted-foreground">{r.subjectName}</div>
                        </TableCell>
                        <TableCell className="font-medium">{r.reporting_month}</TableCell>
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
            <DialogTitle>{editId ? 'Chỉnh sửa Phiếu báo cáo' : 'Tạo Phiếu báo cáo học tập'}</DialogTitle>
            <DialogDescription>
              Chọn lớp học và điền đánh giá kết quả học tập cùng với thông tin học phí.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="classSelect">Chọn lớp học</Label>
              <select
                id="classSelect"
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                disabled={!!editId}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Chọn lớp học --</option>
                {assignedClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.studentName} - {c.subjectName || 'Không có môn học'}
                  </option>
                ))}
              </select>
            </div>

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
                <Label htmlFor="lessonsCompleted">Số buổi đã dạy</Label>
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
                <Label htmlFor="teacherComments">Nhận xét chi tiết của Gia sư</Label>
                <Textarea
                  id="teacherComments"
                  required
                  placeholder="Gia sư viết nhận xét về điểm mạnh, điểm yếu và thái độ chung..."
                  rows={4}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="nextMonthPlan">Định hướng & Lộ trình tháng tới</Label>
                <Textarea
                  id="nextMonthPlan"
                  placeholder="Các nội dung, phương án bồi dưỡng kiến thức tiếp theo..."
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
