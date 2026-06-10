'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, User, BookOpen, Trash2, Edit3, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { saveClassRecurringSchedule, updateClassSession, deleteClassSession } from './calendar-actions'


type ClassItem = {
  id: string
  studentName: string
  studentGrade: string
  status: string
  tutorId: string | null
  tutorName: string
  subjectName: string
}

type ScheduleItem = {
  id: string
  classId: string
  weekday: number
  startTime: string
  endTime: string
  notes: string | null
}

type SessionItem = {
  id: string
  classId: string
  sessionDate: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'attended' | 'absent' | 'cancelled'
  tutorComments: string
}

interface CalendarViewProps {
  classes: ClassItem[]
  initialSchedules: ScheduleItem[]
  initialSessions: SessionItem[]
  isTutorMode?: boolean
  currentTutorId?: string | null
}

const WEEKDAYS = [
  { value: 1, label: 'Thứ Hai' },
  { value: 2, label: 'Thứ Ba' },
  { value: 3, label: 'Thứ Tư' },
  { value: 4, label: 'Thứ Năm' },
  { value: 5, label: 'Thứ Sáu' },
  { value: 6, label: 'Thứ Bảy' },
  { value: 0, label: 'Chủ Nhật' },
]

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function CalendarView({
  classes,
  initialSchedules,
  initialSessions,
  isTutorMode = false,
  currentTutorId = null,
}: CalendarViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Filtering & View Modes
  const [viewMode, setViewMode] = useState<'recurring' | 'actual'>('actual')
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(
    classes.map((c) => c.id)
  )
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust to start on Monday
    const monday = new Date(today.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    return monday
  })

  // Dialog forms
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  
  // Schedule Form State (Admin only)
  const [activeClassId, setActiveClassId] = useState('')
  const [scheduleItems, setScheduleItems] = useState<{ weekday: number; startTime: string; endTime: string }[]>([])

  // Session Form State (Admin or Tutor)
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null)
  const [sessionDate, setSessionDate] = useState('')
  const [sessionStartTime, setSessionStartTime] = useState('')
  const [sessionEndTime, setSessionEndTime] = useState('')
  const [sessionStatus, setSessionStatus] = useState<'scheduled' | 'attended' | 'absent' | 'cancelled'>('scheduled')
  const [sessionComments, setSessionComments] = useState('')

  // Helper dates for current week
  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart)
      d.setDate(currentWeekStart.getDate() + i)
      dates.push(d)
    }
    return dates
  }
  const weekDates = getWeekDates()

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + (direction === 'prev' ? -7 : 7))
    setCurrentWeekStart(newDate)
  }

  // Positioning computations
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number)
    return h * 60 + m
  }

  const computeOverlappingLayout = (items: { id: string; startTime: string; endTime: string }[]) => {
    // Sort items by start time, then by end time
    const sorted = [...items].sort((a, b) => {
      const aStart = timeToMinutes(a.startTime)
      const bStart = timeToMinutes(b.startTime)
      if (aStart !== bStart) return aStart - bStart
      return timeToMinutes(a.endTime) - timeToMinutes(b.endTime)
    })

    // Group items into clusters of overlapping items
    const clusters: typeof sorted[] = []
    let currentCluster: typeof sorted = []
    let clusterEnd = 0

    for (const item of sorted) {
      const start = timeToMinutes(item.startTime)
      const end = timeToMinutes(item.endTime)
      if (currentCluster.length === 0 || start < clusterEnd) {
        currentCluster.push(item)
        clusterEnd = Math.max(clusterEnd, end)
      } else {
        clusters.push(currentCluster)
        currentCluster = [item]
        clusterEnd = end
      }
    }
    if (currentCluster.length > 0) {
      clusters.push(currentCluster)
    }

    const layouts: Record<string, { left: string; width: string }> = {}

    for (const cluster of clusters) {
      // Place items into columns
      const columns: typeof sorted[] = []
      for (const item of cluster) {
        let placed = false
        for (let c = 0; c < columns.length; c++) {
          const lastInCol = columns[c][columns[c].length - 1]
          if (timeToMinutes(item.startTime) >= timeToMinutes(lastInCol.endTime)) {
            columns[c].push(item)
            placed = true
            break
          }
        }
        if (!placed) {
          columns.push([item])
        }
      }

      const numCols = columns.length
      for (let c = 0; c < numCols; c++) {
        for (const item of columns[c]) {
          const width = `${100 / numCols}%`
          const left = `${(c / numCols) * 100}%`
          layouts[item.id] = { left, width }
        }
      }
    }

    return layouts
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 1. Determine which hours of the day (0..23) are empty across all columns.
  const getCollapsedHours = () => {
    const isHourBusy = Array(24).fill(false)

    const checkOverlap = (startTime: string, endTime: string) => {
      const startMins = timeToMinutes(startTime)
      const endMins = timeToMinutes(endTime)
      const startHour = Math.floor(startMins / 60)
      const endHour = Math.ceil(endMins / 60)
      for (let h = startHour; h < endHour; h++) {
        if (h >= 0 && h < 24) {
          isHourBusy[h] = true
        }
      }
    }

    if (viewMode === 'recurring') {
      initialSchedules.forEach((s) => {
        if (selectedClassIds.includes(s.classId)) {
          checkOverlap(s.startTime, s.endTime)
        }
      })
    } else {
      // Visible sessions in the current week
      initialSessions.forEach((s) => {
        if (selectedClassIds.includes(s.classId)) {
          const sessDate = new Date(s.sessionDate)
          const start = new Date(currentWeekStart)
          const end = new Date(currentWeekStart)
          end.setDate(end.getDate() + 7)
          if (sessDate >= start && sessDate < end) {
            checkOverlap(s.startTime, s.endTime)
          }
        }
      })
    }

    const collapsed = Array(24).fill(false)
    let emptyStreak: number[] = []

    for (let h = 0; h <= 24; h++) {
      if (h < 24 && !isHourBusy[h]) {
        emptyStreak.push(h)
      } else {
        if (emptyStreak.length >= 3) {
          emptyStreak.forEach((hour) => {
            collapsed[hour] = true
          })
        }
        emptyStreak = []
      }
    }

    return collapsed
  }

  const collapsedHours = getCollapsedHours()

  const getCollapsedLayout = (collapsedHoursList: boolean[]) => {
    const hourHeights: number[] = []
    const hourTops: number[] = []
    let currentTop = 0

    for (let h = 0; h < 24; h++) {
      hourTops.push(currentTop)
      const height = collapsedHoursList[h] ? 20 : 60
      hourHeights.push(height)
      currentTop += height
    }

    const totalHeight = currentTop

    const getTopAndHeight = (startTime: string, endTime: string) => {
      const startMins = timeToMinutes(startTime)
      const endMins = timeToMinutes(endTime)

      const startHour = Math.floor(startMins / 60)
      const startHourOffset = startMins % 60
      const startHourHeight = hourHeights[startHour] ?? 60
      const topPx = hourTops[startHour] + (startHourOffset / 60) * startHourHeight

      const endHour = Math.floor(endMins / 60)
      const endHourOffset = endMins % 60
      const endHourHeight = hourHeights[endHour] ?? 60
      const endPx = (hourTops[endHour] ?? currentTop) + (endHourOffset / 60) * endHourHeight

      const heightPx = endPx - topPx

      return {
        top: `${(topPx / totalHeight) * 100}%`,
        height: `${(heightPx / totalHeight) * 100}%`,
      }
    }

    return { totalHeight, hourHeights, hourTops, getTopAndHeight }
  }

  const { totalHeight, hourHeights, hourTops, getTopAndHeight } = getCollapsedLayout(collapsedHours)

  const getCardStyle = (startTime: string, endTime: string, layout?: { left: string; width: string }) => {
    const { top, height } = getTopAndHeight(startTime, endTime)
    return {
      top,
      height,
      left: layout ? `calc(${layout.left} + 2px)` : '4px',
      width: layout ? `calc(${layout.width} - 4px)` : 'calc(100% - 8px)',
    }
  }

  useEffect(() => {
    const firstActiveHour = collapsedHours.findIndex((collapsed) => !collapsed)
    if (firstActiveHour !== -1 && scrollContainerRef.current) {
      const topOffset = hourTops[firstActiveHour]
      scrollContainerRef.current.scrollTo({
        top: Math.max(0, topOffset - 40),
        behavior: 'smooth',
      })
    }
  }, [viewMode, currentWeekStart, selectedClassIds])

  // Class checklist helpers
  const handleToggleClass = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    )
  }

  const handleToggleAllClasses = () => {
    if (selectedClassIds.length === classes.length) {
      setSelectedClassIds([])
    } else {
      setSelectedClassIds(classes.map((c) => c.id))
    }
  }

  // Edit recurring schedule trigger (Admin only)
  const openScheduleManager = (classId: string) => {
    setActiveClassId(classId)
    const currentItems = initialSchedules.filter((s) => s.classId === classId)
    setScheduleItems(
      currentItems.map((s) => ({
        weekday: s.weekday,
        startTime: s.startTime.substring(0, 5),
        endTime: s.endTime.substring(0, 5),
      }))
    )
    setIsScheduleDialogOpen(true)
  }

  const handleAddScheduleRow = () => {
    setScheduleItems((prev) => [...prev, { weekday: 1, startTime: '18:00', endTime: '19:30' }])
  }

  const handleRemoveScheduleRow = (idx: number) => {
    setScheduleItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpdateScheduleRow = (idx: number, field: string, val: any) => {
    setScheduleItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    )
  }

  const handleSaveRecurringSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeClassId) return

    // Validation
    for (const item of scheduleItems) {
      if (timeToMinutes(item.endTime) <= timeToMinutes(item.startTime)) {
        toast.error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu.')
        return
      }
    }

    startTransition(async () => {
      const res = await saveClassRecurringSchedule(activeClassId, scheduleItems)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Lưu lịch cố định thành công!')
        setIsScheduleDialogOpen(false)
        router.refresh()
      }
    })
  }

  // Open single session detail dialog
  const openSessionDetail = (session: SessionItem) => {
    setSelectedSession(session)
    setSessionDate(session.sessionDate)
    setSessionStartTime(session.startTime.substring(0, 5))
    setSessionEndTime(session.endTime.substring(0, 5))
    setSessionStatus(session.status)
    setSessionComments(session.tutorComments)
    setIsSessionDialogOpen(true)
  }

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSession) return

    if (timeToMinutes(sessionEndTime) <= timeToMinutes(sessionStartTime)) {
      toast.error('Giờ kết thúc phải lớn hơn giờ bắt đầu.')
      return
    }

    startTransition(async () => {
      const res = await updateClassSession(selectedSession.id, {
        sessionDate,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        status: sessionStatus,
        tutorComments: sessionComments,
      })
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Cập nhật thành công!')
        setIsSessionDialogOpen(false)
        router.refresh()
      }
    })
  }

  const handleDeleteSession = async () => {
    if (!selectedSession || isTutorMode) return
    if (!confirm('Bạn có chắc chắn muốn xóa hẳn buổi học này?')) return

    startTransition(async () => {
      const res = await deleteClassSession(selectedSession.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Đã xóa buổi học.')
        setIsSessionDialogOpen(false)
        router.refresh()
      }
    })
  }

  // Rendering color tags per class
  const classColors = [
    'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
    'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
    'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
    'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
    'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100',
    'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
  ]

  const getClassColor = (classId: string) => {
    const idx = classes.findIndex((c) => c.id === classId)
    return classColors[idx % classColors.length]
  }

  const getSessionStatusText = (status: string) => {
    switch (status) {
      case 'attended':
        return 'Đã điểm danh'
      case 'absent':
        return 'Học sinh vắng'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Chờ học'
    }
  }

  const getSessionStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'attended':
        return 'bg-green-600 text-white border-0'
      case 'absent':
        return 'bg-amber-500 text-white border-0'
      case 'cancelled':
        return 'bg-neutral-400 text-white border-0'
      default:
        return 'bg-indigo-600 text-white border-0'
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDE: Sidebar filters & checklists */}
      <div className="w-full lg:w-[280px] space-y-6 shrink-0">
        
        {/* Toggle Mode */}
        <div className="bg-[#F8F5EC] p-1.5 rounded-xl border flex flex-col gap-1.5 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider px-2 pt-1">
            Chế độ hiển thị
          </span>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setViewMode('actual')}
              className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                viewMode === 'actual'
                  ? 'bg-[#0F2A44] text-white shadow-sm'
                  : 'text-[#0F2A44] hover:bg-neutral-100'
              }`}
            >
              Lịch thực tế
            </button>
            <button
              onClick={() => setViewMode('recurring')}
              className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                viewMode === 'recurring'
                  ? 'bg-[#0F2A44] text-white shadow-sm'
                  : 'text-[#0F2A44] hover:bg-neutral-100'
              }`}
            >
              Lịch lặp lại
            </button>
          </div>
        </div>

        {/* Date Navigator for Actual view */}
        {viewMode === 'actual' && (
          <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chọn Tuần học</h4>
            <div className="flex items-center justify-between gap-1 bg-[#F8F5EC]/50 border rounded-lg p-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-[11px] font-bold text-[#0F2A44]">
                {weekDates[0].toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })} - {weekDates[6].toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}
              </span>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs font-semibold" onClick={() => setCurrentWeekStart(new Date())}>
              Về Tuần hiện tại
            </Button>
          </div>
        )}

        {/* Class checklist */}
        <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2A44]">Danh sách Lớp học</h4>
            <button className="text-[10px] text-primary hover:underline font-bold" onClick={handleToggleAllClasses}>
              {selectedClassIds.length === classes.length ? 'Bỏ chọn hết' : 'Chọn hết'}
            </button>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {classes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Chưa có lớp học nào.</p>
            ) : (
              classes.map((c) => {
                const isChecked = selectedClassIds.includes(c.id)
                return (
                  <div key={c.id} className="flex items-start gap-2 text-xs">
                    <Checkbox
                      id={`class-chk-${c.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleToggleClass(c.id)}
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <label htmlFor={`class-chk-${c.id}`} className="font-semibold cursor-pointer truncate block text-[#0F2A44]">
                        {c.studentName} ({c.subjectName})
                      </label>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground gap-1">
                        <span className="truncate">{c.tutorName}</span>
                        {!isTutorMode && (
                          <button
                            onClick={() => openScheduleManager(c.id)}
                            className="text-primary font-semibold hover:underline shrink-0"
                          >
                            Cài đặt lịch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: Weekly Calendar Grid */}
      <div className="flex-1 min-w-0 bg-white border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[750px]">
        
        {/* Calendar Header Row */}
        <div className="grid grid-cols-8 border-b bg-[#0F2A44] text-white select-none text-center">
          {/* Time axis spacer */}
          <div className="py-3 text-[10px] uppercase font-bold text-white/50 border-r border-white/10 flex items-center justify-center">
            Giờ
          </div>
          {WEEKDAYS.map((day, idx) => {
            const correspondingDate = weekDates[idx]
            const isToday = viewMode === 'actual' && correspondingDate.toDateString() === new Date().toDateString()
            return (
              <div
                key={day.value}
                className={`py-2 border-r border-white/10 flex flex-col justify-center items-center ${
                  isToday ? 'bg-amber-400 text-[#0F2A44]' : ''
                }`}
              >
                <span className="text-xs font-bold">{day.label}</span>
                {viewMode === 'actual' && (
                  <span className="text-[10px] opacity-80 mt-0.5">
                    {correspondingDate.getDate()}/{correspondingDate.getMonth() + 1}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Scrollable grid area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative flex">
          
          {/* Time lines background grid */}
          <div className="w-full absolute top-0 left-0 pointer-events-none z-0" style={{ height: `${totalHeight}px` }}>
            {Array.from({ length: 24 }).map((_, hour) => (
              <div
                key={hour}
                className={`border-b border-neutral-100 flex items-start text-[10px] text-neutral-400 font-semibold pl-2 pt-1.5 ${
                  collapsedHours[hour] ? 'bg-neutral-50/50 justify-between items-center pr-3 pt-0 text-neutral-300' : ''
                }`}
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  top: `${hourTops[hour]}px`,
                  height: `${hourHeights[hour]}px`,
                }}
              >
                <span>{hour < 10 ? `0${hour}:00` : `${hour}:00`}</span>
                {collapsedHours[hour] && <span className="text-[9px] italic opacity-50">(Đã thu gọn)</span>}
              </div>
            ))}
          </div>

          {/* Core Grid Columns Container */}
          <div className="w-full grid grid-cols-8 relative z-10" style={{ height: `${totalHeight}px` }}>
            
            {/* Spacer column matching the 'Giờ' header column */}
            <div className="border-r border-neutral-100 h-full pointer-events-none col-span-1" />

            {/* Days columns */}
            {WEEKDAYS.map((day, dayIdx) => {
              const correspondingDate = weekDates[dayIdx]
              const dateStr = getLocalDateString(correspondingDate)

              // Filter schedules/sessions for this column
              const columnSchedules = viewMode === 'recurring'
                ? initialSchedules.filter((s) => s.weekday === day.value && selectedClassIds.includes(s.classId))
                : []

              const columnSessions = viewMode === 'actual'
                ? initialSessions.filter((s) => s.sessionDate === dateStr && selectedClassIds.includes(s.classId))
                : []

              const schedulesLayouts = computeOverlappingLayout(columnSchedules)
              const sessionsLayouts = computeOverlappingLayout(columnSessions)

              return (
                <div key={day.value} className="relative h-full border-r border-neutral-100 col-span-1">
                  
                  {/* Render schedules (Recurring mode) */}
                  {viewMode === 'recurring' &&
                    columnSchedules.map((s) => {
                      const c = classes.find((item) => item.id === s.classId)
                      if (!c) return null
                      const style = getCardStyle(s.startTime, s.endTime, schedulesLayouts[s.id])
                      return (
                        <div
                          key={s.id}
                          style={style}
                          onClick={() => !isTutorMode && openScheduleManager(s.classId)}
                          className={`absolute p-2 rounded-lg border shadow-sm flex flex-col justify-between cursor-pointer select-none transition-all hover:shadow-md ${getClassColor(
                            s.classId
                          )}`}
                        >
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold truncate">{c.studentName}</p>
                            <p className="text-[8px] font-semibold truncate leading-tight opacity-90">{c.subjectName} • Lớp {c.studentGrade}</p>
                          </div>
                          <div className="flex items-center gap-0.5 text-[8px] font-medium mt-1 shrink-0">
                            <Clock className="h-2 w-2" />
                            <span>{s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}</span>
                          </div>
                        </div>
                      )
                    })}

                  {/* Render sessions (Actual mode) */}
                  {viewMode === 'actual' &&
                    columnSessions.map((s) => {
                      const c = classes.find((item) => item.id === s.classId)
                      if (!c) return null
                      const style = getCardStyle(s.startTime, s.endTime, sessionsLayouts[s.id])
                      return (
                        <div
                          key={s.id}
                          style={style}
                          onClick={() => openSessionDetail(s)}
                          className={`absolute p-1.5 rounded-lg border shadow-sm flex flex-col justify-between cursor-pointer select-none transition-all hover:shadow-md overflow-hidden ${getClassColor(
                            s.classId
                          )}`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[9px] font-bold truncate leading-none">{c.studentName}</p>
                              <Badge className={`text-[7px] px-1 py-0 rounded shrink-0 scale-90 ${getSessionStatusBadgeColor(s.status)}`}>
                                {s.status === 'attended' && '✓'}
                                {s.status === 'absent' && 'Vắng'}
                                {s.status === 'cancelled' && 'Hủy'}
                                {s.status === 'scheduled' && 'Chờ'}
                              </Badge>
                            </div>
                            <p className="text-[8px] truncate leading-normal opacity-95">{c.subjectName}</p>
                          </div>
                          <div className="flex items-center justify-between text-[7.5px] font-semibold mt-1 shrink-0">
                            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5 shrink-0" /> {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )
            })}
          </div>

        </div>

      </div>

      {/* ADMIN: Weekly Recurring Schedule Editor Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cài đặt lịch lặp lại hàng tuần</DialogTitle>
            <DialogDescription>
              Thiết lập các buổi học cố định diễn ra hàng tuần cho lớp này.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveRecurringSchedule} className="space-y-4 py-2">
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {scheduleItems.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">Chưa có lịch tuần. Bấm nút dưới để thêm.</p>
              ) : (
                scheduleItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center border p-3 rounded-lg relative bg-[#F8F5EC]/10">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <Label className="text-[10px] font-bold">Thứ</Label>
                          <Select
                            value={String(item.weekday)}
                            onValueChange={(val) => handleUpdateScheduleRow(idx, 'weekday', Number(val))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {WEEKDAYS.map((day) => (
                                <SelectItem key={day.value} value={String(day.value)}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[10px] font-bold">Bắt đầu</Label>
                          <Input
                            type="time"
                            className="h-8 text-xs"
                            value={item.startTime}
                            onChange={(e) => handleUpdateScheduleRow(idx, 'startTime', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] font-bold">Kết thúc</Label>
                          <Input
                            type="time"
                            className="h-8 text-xs"
                            value={item.endTime}
                            onChange={(e) => handleUpdateScheduleRow(idx, 'endTime', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 self-end"
                      onClick={() => handleRemoveScheduleRow(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5"
              onClick={handleAddScheduleRow}
            >
              <Plus className="h-4 w-4" /> Thêm buổi học trong tuần
            </Button>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[90px]">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu lại'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADMIN/TUTOR: Single Session Rescheduling, Rescheduling and Attendance Dialog */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin buổi học chi tiết</DialogTitle>
            <DialogDescription>
              Điều chỉnh điểm danh, nhận xét hoặc dời giờ cho buổi học đơn lẻ này.
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <form onSubmit={handleSaveSession} className="space-y-4 py-2">
              
              {/* Class profile info */}
              <div className="bg-[#F8F5EC]/40 border rounded-lg p-3 text-xs grid grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Học sinh</span>
                  <span className="font-bold text-[#0F2A44]">
                    {classes.find((c) => c.id === selectedSession.classId)?.studentName}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Môn học</span>
                  <span className="font-bold text-[#0F2A44]">
                    {classes.find((c) => c.id === selectedSession.classId)?.subjectName}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Gia sư</span>
                  <span className="font-bold text-[#0F2A44] truncate block">
                    {classes.find((c) => c.id === selectedSession.classId)?.tutorName}
                  </span>
                </div>
              </div>

              {/* Attendance and Status */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Điểm danh / Trạng thái</Label>
                <Select
                  value={sessionStatus}
                  onValueChange={(val: any) => setSessionStatus(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Chờ học (Chưa diễn ra)</SelectItem>
                    <SelectItem value="attended">Đã học (Học sinh đi học đầy đủ)</SelectItem>
                    <SelectItem value="absent">Báo nghỉ (Học sinh xin nghỉ)</SelectItem>
                    <SelectItem value="cancelled">Hủy buổi (Nghỉ không học)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comments */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Nhận xét buổi học của Gia sư</Label>
                <Textarea
                  placeholder="Nhập nhận xét nhanh về buổi học của học sinh..."
                  rows={3}
                  value={sessionComments}
                  onChange={(e) => setSessionComments(e.target.value)}
                />
              </div>

              {/* Rescheduling fields (Session Date and Times) */}
              <div className="border border-amber-200 bg-amber-50/10 rounded-xl p-3.5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Dời lịch buổi học (Chỉ áp dụng buổi này)
                </h4>
                
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-amber-900">Ngày học cụ thể</Label>
                  <Input
                    type="date"
                    className="h-9 text-xs"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-amber-900">Giờ bắt đầu</Label>
                    <Input
                      type="time"
                      className="h-9 text-xs"
                      value={sessionStartTime}
                      onChange={(e) => setSessionStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-amber-900">Giờ kết thúc</Label>
                    <Input
                      type="time"
                      className="h-9 text-xs"
                      value={sessionEndTime}
                      onChange={(e) => setSessionEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2 sm:justify-between items-stretch sm:items-center">
                <div>
                  {!isTutorMode && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={handleDeleteSession}
                      disabled={isPending}
                    >
                      Xóa buổi học
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[90px]">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu lại'}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
