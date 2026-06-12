'use client'

import { useState, useActionState, useEffect } from 'react'
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

  const [values,setValues]=useState<Record<string,string>>({})
  const [scheduleRows, setScheduleRows] = useState<{ weekday: number; startTime: string; endTime: string }[]>([])

  useEffect(() => {
    if (state.success) {
      setValues({})
      setScheduleRows([])
    } else if (state.values) {
      setValues(state.values)
    }
  }, [state])

  const set=(name:string)=>(v:string)=>setValues(prev=>({...prev,[name]:v}))
  const fieldErr=(name:string)=>state.fieldErrors?.[name]

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
    // noValidate: let the server return per-field errors (shown inline below) instead of
    // the browser's built-in validation popup, which would also block the submit entirely.
    <form action={action} noValidate className="space-y-4">
      {state.error&&<Alert variant="destructive"><AlertTitle>Không thể tạo lớp</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
      {state.success&&<Alert><AlertTitle>Đã lưu</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}
      {(!!state.fieldErrors||!!state.scheduleErrors)&&<Alert variant="destructive"><AlertTitle>Vui lòng kiểm tra lại</AlertTitle><AlertDescription>Một số mục chưa hợp lệ — xem chi tiết bên dưới.</AlertDescription></Alert>}

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Tên học sinh" name="studentName" required value={values.studentName??''} onChange={e=>set('studentName')(e.target.value)} error={fieldErr('studentName')}/>
        <Field label="Khối/lớp" name="studentGrade" value={values.studentGrade??''} onChange={e=>set('studentGrade')(e.target.value)}/>
        <SelectField label="Môn học" name="subjectId" required value={values.subjectId} onValueChange={set('subjectId')} placeholder="Chọn môn học" error={fieldErr('subjectId')}>
          {subjects.map(s=><SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectField>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Tên phụ huynh" name="parentName" value={values.parentName??''} onChange={e=>set('parentName')(e.target.value)}/>
        <Field label="SĐT phụ huynh" name="parentPhone" value={values.parentPhone??''} onChange={e=>set('parentPhone')(e.target.value)}/>
        <Field label="Email phụ huynh" name="parentEmail" type="email" value={values.parentEmail??''} onChange={e=>set('parentEmail')(e.target.value)} error={fieldErr('parentEmail')}/>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SelectField label="Gia sư" name="tutorId" value={values.tutorId??'open'} onValueChange={set('tutorId')} placeholder="Mở / Chưa phân công">
          <SelectItem value="open">Mở / Chưa phân công</SelectItem>
          {tutors.map(t=><SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}
        </SelectField>
        <SelectField label="Hình thức" name="mode" value={values.mode??'online'} onValueChange={set('mode')} placeholder="Chọn hình thức">
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectField>
        <Field label="Học phí" name="tuitionFee" type="number" value={values.tuitionFee??''} onChange={e=>set('tuitionFee')(e.target.value)} error={fieldErr('tuitionFee')}/>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ngày bắt đầu (tuỳ chọn)" name="startDate" type="date" value={values.startDate??''} onChange={e=>set('startDate')(e.target.value)}/>
        <Field label="Địa điểm" name="location" value={values.location??''} onChange={e=>set('location')(e.target.value)}/>
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
              <div key={idx} className="flex flex-wrap items-center gap-3 bg-white p-2 border rounded-lg shadow-sm">

                {/* weekday selector */}
                <div className="flex-1 min-w-[140px]">
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
                    aria-invalid={!!state.scheduleErrors?.[idx]}
                    className="h-8 text-xs"
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
                    aria-invalid={!!state.scheduleErrors?.[idx]}
                    className="h-8 text-xs"
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

                {state.scheduleErrors?.[idx]&&<p className="w-full text-xs font-medium text-destructive">{state.scheduleErrors[idx]}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextBox label="Ghi chú lịch học" name="scheduleNotes" value={values.scheduleNotes??''} onChange={e=>set('scheduleNotes')(e.target.value)}/>
        <TextBox label="Yêu cầu" name="requirements" value={values.requirements??''} onChange={e=>set('requirements')(e.target.value)}/>
        <TextBox label="Ghi chú nội bộ" name="notes" value={values.notes??''} onChange={e=>set('notes')(e.target.value)}/>
      </div>

      <Button disabled={pending}>{pending?'Đang tạo...':'Tạo lớp học'}</Button>
    </form>
  )
}
export function RequestReviewForm({request}:{request:ClassRequest}){const [state,action,pending]=useActionState(reviewClassRequest,{} as ClassActionState); return <form action={action} className="flex flex-wrap items-center gap-2"><input type="hidden" name="requestId" value={request.id}/>{state.error&&<span className="text-sm text-destructive">{state.error}</span>}{state.success&&<span className="text-sm text-emerald-600">{state.success}</span>}<Button size="sm" name="decision" value="approve" disabled={pending}>Approve</Button><Button size="sm" variant="secondary" name="decision" value="reject" disabled={pending}>Reject</Button></form>}
function Field({label,className,error,required,...props}:React.ComponentProps<typeof Input>&{label:string;error?:string;required?:boolean}){const id=String(props.name);return <div className={`space-y-2 ${className??''}`}><Label htmlFor={id}>{label}{required&&<span className="text-destructive"> *</span>}</Label><Input id={id} aria-invalid={!!error}{...props}/>{error&&<p className="text-xs font-medium text-destructive">{error}</p>}</div>}
function TextBox({label,name,value,onChange,error}:{label:string;name:string;value?:string;onChange?:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void;error?:string}){return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} rows={3} value={value} onChange={onChange} aria-invalid={!!error}/>{error&&<p className="text-xs font-medium text-destructive">{error}</p>}</div>}
function SelectField({label,name,value,onValueChange,placeholder,required,error,children}:{label:string;name:string;value?:string;onValueChange:(v:string)=>void;placeholder?:string;required?:boolean;error?:string;children:React.ReactNode}){return <div className="space-y-2"><Label>{label}{required&&<span className="text-destructive"> *</span>}</Label><Select name={name} value={value} onValueChange={onValueChange}><SelectTrigger className="w-full"><SelectValue placeholder={placeholder}/></SelectTrigger><SelectContent>{children}</SelectContent></Select>{error&&<p className="text-xs font-medium text-destructive">{error}</p>}</div>}
