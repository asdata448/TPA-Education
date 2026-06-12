'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Plus, Edit3, Copy, ExternalLink, Check, Calendar, BookOpen, CircleDollarSign, GraduationCap, ClipboardList } from 'lucide-react'
import { saveProgressReportFromDashboard, type ReportActionState } from './report-actions'
import { toast } from 'sonner'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

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

function getSubjectColors(subjectName: string | null) {
  if (!subjectName) return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
  const name = subjectName.toLowerCase()
  if (name.includes('math') || name.includes('toán')) {
    return { bg: 'bg-indigo-50/80 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-100 dark:border-indigo-900/50' }
  }
  if (name.includes('english') || name.includes('anh')) {
    return { bg: 'bg-emerald-50/80 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-100 dark:border-emerald-900/50' }
  }
  if (name.includes('physics') || name.includes('lý')) {
    return { bg: 'bg-purple-50/80 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-100 dark:border-purple-900/50' }
  }
  if (name.includes('chemistry') || name.includes('hóa')) {
    return { bg: 'bg-amber-50/80 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-100 dark:border-amber-900/50' }
  }
  if (name.includes('programming') || name.includes('tin') || name.includes('lập trình')) {
    return { bg: 'bg-cyan-50/80 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-100 dark:border-cyan-900/50' }
  }
  return { bg: 'bg-slate-50 dark:bg-slate-900/50', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800' }
}

function getEvaluationBadge(score: number) {
  if (score >= 4.5) {
    return { label: 'Xuất sắc', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50' }
  }
  if (score >= 4.0) {
    return { label: 'Tốt', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50' }
  }
  if (score >= 3.0) {
    return { label: 'Khá', className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/50' }
  }
  return { label: 'Yếu', className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50' }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#0F2A44] dark:text-[#F8F5EC] flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-[#D8B76A]" />
            Báo cáo tiến độ học tập
          </h2>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            Viết và gửi các phiếu báo cáo học tập & thông tin đóng học phí hàng tháng cho phụ huynh.
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-[#0F2A44] hover:bg-[#1a3a5c] text-white font-bold shadow-md hover:shadow-lg transition-all rounded-lg shrink-0">
          <Plus className="h-4 w-4 mr-1.5" /> Viết báo cáo mới
        </Button>
      </div>

      <Card className="border-[#E2E8F0] shadow-sm overflow-hidden bg-white dark:bg-slate-950 rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/75 dark:bg-slate-900/50">
                <TableRow className="border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="font-bold text-[#0F2A44] dark:text-slate-300 py-4">Học sinh / Lớp</TableHead>
                  <TableHead className="font-bold text-[#0F2A44] dark:text-slate-300 py-4">Tháng báo cáo</TableHead>
                  <TableHead className="font-bold text-[#0F2A44] dark:text-slate-300 py-4">Số buổi dạy</TableHead>
                  <TableHead className="font-bold text-[#0F2A44] dark:text-slate-300 py-4">Học phí ghi nhận</TableHead>
                  <TableHead className="font-bold text-[#0F2A44] dark:text-slate-300 py-4">Đánh giá trung bình</TableHead>
                  <TableHead className="font-bold text-[#0F2A44] dark:text-slate-300 py-4 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-slate-400">
                      <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                      Bạn chưa tạo phiếu báo cáo nào. Hãy nhấn "Viết báo cáo mới" để bắt đầu.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((r) => {
                    const avgRating = (r.rating_comprehension + r.rating_homework + r.rating_attendance + r.rating_attitude) / 4
                    const subjectStyle = getSubjectColors(r.subjectName)
                    const evalBadge = getEvaluationBadge(avgRating)
                    
                    return (
                      <TableRow key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors border-b border-slate-100 dark:border-slate-850">
                        <TableCell className="py-4 font-semibold">
                          <div className="text-slate-900 dark:text-slate-100 text-sm font-bold">{r.studentName}</div>
                          {r.subjectName && (
                            <Badge className={`${subjectStyle.bg} ${subjectStyle.text} ${subjectStyle.border} border text-[10px] px-2 py-0.5 mt-1.5 shadow-none rounded font-bold`}>
                              {r.subjectName}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded w-fit border border-slate-200/50">
                            <Calendar className="h-3.5 w-3.5 text-[#D8B76A]" />
                            {r.reporting_month}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                          {r.lessons_completed} buổi
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            <CircleDollarSign className="h-4 w-4 shrink-0 text-emerald-500" />
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.tuition_fee)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-200/60">
                              <span className="font-bold text-xs text-amber-700 dark:text-amber-400">{avgRating.toFixed(1)}</span>
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            </div>
                            <Badge variant="outline" className={`${evalBadge.className} border text-[10px] font-bold px-2 py-0.5 shadow-none rounded`}>
                              {evalBadge.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyShareLink(r.id)} 
                              className="h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-900 rounded-lg"
                              title="Sao chép link chia sẻ"
                            >
                              {copiedId === r.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-500" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild 
                              className="h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-900 rounded-lg"
                              title="Xem chi tiết báo cáo"
                            >
                              <Link href={`/reports/${r.id}`} target="_blank">
                                <ExternalLink className="h-4 w-4 text-slate-500" />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditModal(r)}
                              className="h-8 px-2.5 border-slate-200 text-slate-700 dark:text-slate-300 dark:border-slate-800 hover:bg-slate-50 rounded-lg flex items-center gap-1 text-xs"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Chỉnh sửa
                            </Button>
                          </div>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-slate-150 p-6">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-[#0F2A44] dark:text-[#F8F5EC] flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#D8B76A]" />
              {editId ? 'Chỉnh sửa Phiếu báo cáo' : 'Tạo Phiếu báo cáo học tập'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Chọn lớp học và điền đánh giá kết quả học tập cùng với thông tin học phí.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="classSelect" className="text-xs font-bold text-slate-700 dark:text-slate-350">Chọn lớp học</Label>
              <select
                id="classSelect"
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                disabled={!!editId}
                className="w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-[#0F2A44]"
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
              <div className="space-y-1.5">
                <Label htmlFor="reportingMonth" className="text-xs font-bold text-slate-700 dark:text-slate-350">Tháng báo cáo</Label>
                <Input
                  id="reportingMonth"
                  type="month"
                  required
                  value={reportingMonth}
                  onChange={(e) => setReportingMonth(e.target.value)}
                  className="rounded-lg border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lessonsCompleted" className="text-xs font-bold text-slate-700 dark:text-slate-350">Số buổi đã dạy</Label>
                <Input
                  id="lessonsCompleted"
                  type="number"
                  required
                  value={lessonsCompleted}
                  onChange={(e) => setLessonsCompleted(Number(e.target.value))}
                  className="rounded-lg border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tuitionFee" className="text-xs font-bold text-slate-700 dark:text-slate-350">Học phí tháng này (VND)</Label>
              <Input
                id="tuitionFee"
                type="number"
                required
                value={tuitionFee}
                onChange={(e) => setTuitionFee(Number(e.target.value))}
                className="rounded-lg border-slate-200"
              />
            </div>

            {/* Ratings */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-xs text-[#0F2A44] dark:text-slate-300 uppercase tracking-wider">Đánh giá học lực (1-5★)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-lg border border-slate-100">
                <div className="space-y-1">
                  <Label className="text-[11px] text-slate-500 font-semibold block">Khả năng tiếp thu bài</Label>
                  {renderStars(ratingComprehension, setRatingComprehension)}
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-slate-500 font-semibold block">Tự giác làm bài tập</Label>
                  {renderStars(ratingHomework, setRatingHomework)}
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-slate-500 font-semibold block">Chuyên cần & Đúng giờ</Label>
                  {renderStars(ratingAttendance, setRatingAttendance)}
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-slate-500 font-semibold block">Thái độ trong buổi học</Label>
                  {renderStars(ratingAttitude, setRatingAttitude)}
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="teacherComments" className="text-xs font-bold text-slate-700 dark:text-slate-350">Nhận xét chi tiết của Gia sư</Label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{teacherComments.length}/200</span>
                </div>
                <Textarea
                  id="teacherComments"
                  required
                  maxLength={200}
                  placeholder="Gia sư viết nhận xét về điểm mạnh, điểm yếu và thái độ chung..."
                  rows={3}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  className="rounded-lg border-slate-200 text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="nextMonthPlan" className="text-xs font-bold text-slate-700 dark:text-slate-350">Định hướng & Lộ trình tháng tới</Label>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{nextMonthPlan.length}/200</span>
                </div>
                <Textarea
                  id="nextMonthPlan"
                  maxLength={200}
                  placeholder="Các nội dung, phương án bồi dưỡng kiến thức tiếp theo..."
                  rows={2.5}
                  value={nextMonthPlan}
                  onChange={(e) => setNextMonthPlan(e.target.value)}
                  className="rounded-lg border-slate-200 text-sm resize-none"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-slate-100 pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="rounded-lg border-slate-200 text-slate-700 dark:text-slate-300">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="bg-[#0F2A44] hover:bg-[#1a3a5c] text-white font-bold rounded-lg shadow-md">
                {isPending ? 'Đang lưu...' : 'Lưu báo cáo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
