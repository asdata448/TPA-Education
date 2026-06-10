'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, ExternalLink, Calendar, Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { saveProgressReportFromAdmin, deleteProgressReport } from './report-actions'

type Report = {
  id: string
  reportingMonth: string
  lessonsCompleted: number
  ratingComprehension: number
  ratingHomework: number
  ratingAttendance: number
  ratingAttitude: number
  teacherComments: string
  nextMonthPlan: string | null
  tuitionFee: number
  createdAt: string
  studentName: string
  subjectName: string
  tutorName: string
  class_id?: string
}

type ClassItem = {
  id: string
  studentName: string
  tuitionFee: number
  tutorName: string
  subjectName: string
}

interface ReportsManagerProps {
  initialReports: Report[]
  classes: ClassItem[]
}

export function ReportsManager({ initialReports, classes }: ReportsManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  
  // Form state
  const [classId, setClassId] = useState('')
  const [reportingMonth, setReportingMonth] = useState('')
  const [lessonsCompleted, setLessonsCompleted] = useState(8)
  const [ratingComprehension, setRatingComprehension] = useState(5)
  const [ratingHomework, setRatingHomework] = useState(5)
  const [ratingAttendance, setRatingAttendance] = useState(5)
  const [ratingAttitude, setRatingAttitude] = useState(5)
  const [teacherComments, setTeacherComments] = useState('')
  const [nextMonthPlan, setNextMonthPlan] = useState('')
  const [tuitionFee, setTuitionFee] = useState(0)

  // Filtered reports
  const filteredReports = initialReports.filter((r) => {
    const search = searchTerm.toLowerCase()
    return (
      r.studentName.toLowerCase().includes(search) ||
      r.tutorName.toLowerCase().includes(search) ||
      r.subjectName.toLowerCase().includes(search) ||
      r.reportingMonth.includes(search)
    )
  })

  const handleClassChange = (selectedId: string) => {
    setClassId(selectedId)
    const c = classes.find((item) => item.id === selectedId)
    if (c) {
      setTuitionFee(c.tuitionFee)
    }
  }

  const openCreateDialog = () => {
    setSelectedReportId(null)
    setClassId('')
    setReportingMonth('')
    setLessonsCompleted(8)
    setRatingComprehension(5)
    setRatingHomework(5)
    setRatingAttendance(5)
    setRatingAttitude(5)
    setTeacherComments('')
    setNextMonthPlan('')
    setTuitionFee(0)
    setIsDialogOpen(true)
  }

  const openEditDialog = (r: Report) => {
    setSelectedReportId(r.id)
    setClassId(r.class_id || '')
    setReportingMonth(r.reportingMonth)
    setLessonsCompleted(r.lessonsCompleted)
    setRatingComprehension(r.ratingComprehension)
    setRatingHomework(r.ratingHomework)
    setRatingAttendance(r.ratingAttendance)
    setRatingAttitude(r.ratingAttitude)
    setTeacherComments(r.teacherComments)
    setNextMonthPlan(r.nextMonthPlan || '')
    setTuitionFee(r.tuitionFee)
    setIsDialogOpen(true)
  }

  const openDeleteConfirm = (id: string) => {
    setSelectedReportId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!classId || !reportingMonth || !teacherComments) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc.')
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
      const res = await saveProgressReportFromAdmin(selectedReportId, formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Lưu phiếu báo cáo thành công!')
        setIsDialogOpen(false)
        router.refresh()
      }
    })
  }

  const handleDeleteReport = async () => {
    if (!selectedReportId) return
    startTransition(async () => {
      const res = await deleteProgressReport(selectedReportId)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Đã xóa báo cáo thành công!')
        setIsDeleteDialogOpen(false)
        router.refresh()
      }
    })
  }

  const renderStarSelector = (value: number, setValue: (val: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-5 w-5 ${
                star <= value ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm học sinh, gia sư..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Viết Báo cáo Mới
        </Button>
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
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      Chưa tìm thấy phiếu báo cáo nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((r) => {
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
                        <TableCell className="text-right space-x-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEditDialog(r)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteConfirm(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/reports/${r.id}`} target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
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

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReportId ? 'Chỉnh sửa Phiếu Báo cáo' : 'Viết Phiếu Báo cáo mới'}</DialogTitle>
            <DialogDescription>
              Điền các đánh giá xếp hạng sao và nhận xét chi tiết cho học sinh.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveReport} className="space-y-4 py-2">
            
            {/* Lớp học selection */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Chọn Lớp học / Học sinh *</Label>
              <Select value={classId} onValueChange={handleClassChange} disabled={!!selectedReportId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp học..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.studentName} ({c.subjectName}) - Gia sư: {c.tutorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tháng báo cáo */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Tháng báo cáo (YYYY-MM) *</Label>
                <Input
                  type="month"
                  value={reportingMonth}
                  onChange={(e) => setReportingMonth(e.target.value)}
                  disabled={!!selectedReportId}
                />
              </div>

              {/* Số buổi học */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Số buổi hoàn thành</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={lessonsCompleted}
                  onChange={(e) => setLessonsCompleted(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Đánh giá sao */}
            <div className="bg-[#F8F5EC]/30 border rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Đánh giá kỹ năng (1-5 Sao)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">Tiếp thu bài</Label>
                  {renderStarSelector(ratingComprehension, setRatingComprehension)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">Tự giác</Label>
                  {renderStarSelector(ratingHomework, setRatingHomework)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">Chuyên cần</Label>
                  {renderStarSelector(ratingAttendance, setRatingAttendance)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">Thái độ học</Label>
                  {renderStarSelector(ratingAttitude, setRatingAttitude)}
                </div>
              </div>
            </div>

            {/* Nhận xét & Kế hoạch */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Nhận xét của Gia sư *</Label>
                <Textarea
                  placeholder="Nhận xét cụ thể về buổi học, sự tiến bộ, điểm cần khắc phục..."
                  rows={3}
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Kế hoạch / Nội dung tháng tới</Label>
                <Textarea
                  placeholder="Nhập định hướng bài học tiếp theo cho học sinh..."
                  rows={2}
                  value={nextMonthPlan}
                  onChange={(e) => setNextMonthPlan(e.target.value)}
                />
              </div>
            </div>

            {/* Học phí & Cú pháp */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Học phí cần thanh toán (VND)</Label>
              <Input
                type="number"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(Number(e.target.value))}
                placeholder="Ví dụ: 3000000"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu lại'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xóa Báo cáo Tiến độ?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Phiếu báo cáo và thông báo học phí này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button type="button" variant="destructive" disabled={isPending} onClick={handleDeleteReport}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xác nhận Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
