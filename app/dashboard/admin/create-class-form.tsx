'use client'

import { useState, useActionState } from 'react'
import { createClass, reviewClassRequest, type ClassActionState } from './class-actions'
import type { ClassRequest, SubjectOption, TutorOption } from './classes-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'

export function CreateClassForm({subjects,tutors}:{subjects:SubjectOption[]; tutors:TutorOption[]}){
  const [state,action,pending]=useActionState(createClass,{} as ClassActionState)
  const [scheduleRows, setScheduleRows] = useState<{ weekday: number; startTime: string; endTime: string }[]>([])

  const addRow = () => {
    setScheduleRows(prev => [...prev, { weekday: 1, startTime: '18:00', endTime: '19:30' }])
  }

  const removeRow = (idx: number) => {
    setScheduleRows(prev => prev.filter((_, i) => i !== idx))
  }

  const updateRow = (idx: number, field: string, value: any) => {
    setScheduleRows(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  return (
    <form action={action} className="space-y-4">
      {state.error&&<Alert variant="destructive"><AlertTitle>Class not created</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.success&&<Alert><AlertTitle>Saved</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
      
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Student name" name="studentName" required/>
        <Field label="Grade" name="studentGrade"/>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select name="subjectId" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subject"/>
            </SelectTrigger>
            <SelectContent>
              {subjects.map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Parent name" name="parentName"/>
        <Field label="Parent phone" name="parentPhone"/>
        <Field label="Parent email" name="parentEmail" type="email"/>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Tutor</Label>
          <Select name="tutorId" defaultValue="open">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Open/unassigned"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open/unassigned</SelectItem>
              {tutors.map(t=><SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Hình thức</Label>
          <Select name="mode" defaultValue="online">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn hình thức"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field label="Tuition fee" name="tuitionFee" type="number"/>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Start date (optional)" name="startDate" type="date"/>
        <Field label="Location" name="location"/>
      </div>

      {/* Lịch học hàng tuần lặp lại */}
      <div className="border border-teal-200 bg-teal-50/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-teal-800">Lịch học hàng tuần cố định</Label>
          <Button type="button" variant="outline" size="sm" onClick={addRow} className="h-8 text-xs border-teal-300 text-teal-800 hover:bg-teal-50">
            + Thêm buổi học
          </Button>
        </div>

        {scheduleRows.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Chưa cấu hình lịch học hàng tuần. Bạn có thể tự thêm buổi học để hệ thống tự động sinh lịch học thực tế.</p>
        ) : (
          <div className="space-y-2">
            {scheduleRows.map((row, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-2 border rounded-lg shadow-sm">
                
                {/* weekday selector */}
                <div className="flex-1">
                  <Select
                    value={String(row.weekday)}
                    onValueChange={(val) => updateRow(idx, 'weekday', Number(val))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Thứ Hai</SelectItem>
                      <SelectItem value="2">Thứ Ba</SelectItem>
                      <SelectItem value="3">Thứ Tư</SelectItem>
                      <SelectItem value="4">Thứ Năm</SelectItem>
                      <SelectItem value="5">Thứ Sáu</SelectItem>
                      <SelectItem value="6">Thứ Bảy</SelectItem>
                      <SelectItem value="0">Chủ Nhật</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="weekdays" value={row.weekday} />
                </div>

                {/* start time */}
                <div className="w-28">
                  <Input
                    type="time"
                    name="startTimes"
                    value={row.startTime}
                    onChange={(e) => updateRow(idx, 'startTime', e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                {/* spacer */}
                <span className="text-xs text-muted-foreground">đến</span>

                {/* end time */}
                <div className="w-28">
                  <Input
                    type="time"
                    name="endTimes"
                    value={row.endTime}
                    onChange={(e) => updateRow(idx, 'endTime', e.target.value)}
                    className="h-8 text-xs"
                    required
                  />
                </div>

                {/* delete button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 shrink-0"
                  onClick={() => removeRow(idx)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextBox label="Schedule notes" name="scheduleNotes"/>
        <TextBox label="Requirements" name="requirements"/>
        <TextBox label="Internal notes" name="notes"/>
      </div>

      <Button disabled={pending}>{pending?'Creating...':'Create class'}</Button>
    </form>
  )
}
export function RequestReviewForm({request}:{request:ClassRequest}){const [state,action,pending]=useActionState(reviewClassRequest,{} as ClassActionState); return <form action={action} className="flex flex-wrap items-center gap-2"><input type="hidden" name="requestId" value={request.id}/>{state.error&&<span className="text-sm text-destructive">{state.error}</span>}{state.success&&<span className="text-sm text-emerald-600">{state.success}</span>}<Button size="sm" name="decision" value="approve" disabled={pending}>Approve</Button><Button size="sm" variant="secondary" name="decision" value="reject" disabled={pending}>Reject</Button></form>}
function Field({label,className,...props}:React.ComponentProps<typeof Input>&{label:string}){const id=String(props.name);return <div className={`space-y-2 ${className??''}`}><Label htmlFor={id}>{label}</Label><Input id={id}{...props}/></div>}
function TextBox({label,name}:{label:string;name:string}){return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} rows={3}/></div>}
