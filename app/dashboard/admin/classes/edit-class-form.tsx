'use client'

import { useActionState, useState } from 'react'
import { updateClassAction, deleteClassAction, type UpdateClassState, type DeleteClassState } from './actions'
import type { SubjectOption, TutorOption } from '../classes-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'

type ClassDetail = {
  id: string
  studentName: string
  studentGrade: string | null
  subjectId: string | null
  parentName: string | null
  parentPhone: string | null
  parentEmail: string | null
  tutorId: string | null
  mode: string
  location: string | null
  startDate: string | null
  tuitionFee: number | null
  scheduleNotes: string | null
  requirements: string | null
  notes: string | null
  status: string
}

export function EditClassForm({
  classDetail,
  subjects,
  tutors,
}: {
  classDetail: ClassDetail
  subjects: SubjectOption[]
  tutors: TutorOption[]
}) {
  const [state, action, pending] = useActionState(updateClassAction, {} as UpdateClassState)
  const [deleteState, deleteAction, deleting] = useActionState(deleteClassAction, {} as DeleteClassState)
  const [dateVal, setDateVal] = useState<Date | undefined>(
    classDetail.startDate ? new Date(classDetail.startDate) : undefined
  )

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-5">
        <input type="hidden" name="classId" value={classDetail.id} />

        {state.error && <Alert variant="destructive"><AlertTitle>Cập nhật thất bại</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
        {state.success && <Alert><AlertTitle>Đã lưu</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tên học sinh" name="studentName" defaultValue={classDetail.studentName} required />
          <Field label="Khối/lớp" name="studentGrade" defaultValue={classDetail.studentGrade ?? ''} />
          <div className="space-y-2">
            <Label htmlFor="subjectId">Môn học</Label>
            <Select name="subjectId" defaultValue={classDetail.subjectId ?? ''}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tên phụ huynh" name="parentName" defaultValue={classDetail.parentName ?? ''} />
          <Field label="SĐT phụ huynh" name="parentPhone" defaultValue={classDetail.parentPhone ?? ''} />
          <Field label="Email phụ huynh" name="parentEmail" type="email" defaultValue={classDetail.parentEmail ?? ''} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="tutorId">Gia sư</Label>
            <Select name="tutorId" defaultValue={classDetail.tutorId ?? 'open'}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn gia sư" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Mở / Chưa phân công</SelectItem>
                {tutors.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mode">Hình thức học</Label>
            <Select name="mode" defaultValue={classDetail.mode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Field label="Học phí mỗi buổi" name="tuitionFee" type="number" defaultValue={classDetail.tuitionFee?.toString() ?? ''} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select name="status" defaultValue={classDetail.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Đang mở (Open)</SelectItem>
                <SelectItem value="assigned">Đã giao (Assigned)</SelectItem>
                <SelectItem value="paused">Tạm dừng (Paused)</SelectItem>
                <SelectItem value="completed">Hoàn thành (Completed)</SelectItem>
                <SelectItem value="cancelled">Đã hủy (Cancelled)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2 flex flex-col justify-end">
            <Label>Ngày bắt đầu</Label>
            <input type="hidden" name="startDate" value={dateVal ? dateVal.toISOString().split('T')[0] : ''} />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !dateVal && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateVal ? dateVal.toLocaleDateString('vi-VN') : <span>Chọn ngày bắt đầu</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateVal}
                  onSelect={setDateVal}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="md:col-span-2">
            <Field label="Địa điểm (nếu offline)" name="location" defaultValue={classDetail.location ?? ''} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <TextBox label="Ghi chú lịch học" name="scheduleNotes" defaultValue={classDetail.scheduleNotes ?? ''} />
          <TextBox label="Yêu cầu" name="requirements" defaultValue={classDetail.requirements ?? ''} />
          <TextBox label="Ghi chú nội bộ" name="notes" defaultValue={classDetail.notes ?? ''} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button type="submit" disabled={pending}>{pending ? 'Đang lưu...' : 'Lưu lớp học'}</Button>
        </div>
      </form>

      <form action={deleteAction} className="space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <input type="hidden" name="classId" value={classDetail.id} />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-destructive">Xóa lớp học</h4>
          <p className="text-sm text-muted-foreground">
            Hành động này sẽ xóa vĩnh viễn lớp học này cùng với toàn bộ lịch học và các buổi học đi kèm.
          </p>
        </div>
        {deleteState.error && <Alert variant="destructive"><AlertTitle>Xóa thất bại</AlertTitle><AlertDescription>{deleteState.error}</AlertDescription></Alert>}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input name="confirmText" placeholder="Nhập DELETE để xác nhận" autoComplete="off" />
          <Button type="submit" variant="destructive" disabled={deleting}>{deleting ? 'Đang xóa...' : 'Xóa lớp học'}</Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name)
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}

function TextBox({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} rows={3} defaultValue={defaultValue} /></div>
}
