import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { listAssignedClasses } from '../classes-data'
import Link from 'next/link'
import { BookOpen, Calendar, DollarSign, User, Activity, MapPin } from 'lucide-react'

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Math': { bg: 'bg-indigo-50/80', text: 'text-indigo-700', border: 'border-indigo-100' },
  'English': { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-100' },
  'Physics': { bg: 'bg-purple-50/80', text: 'text-purple-700', border: 'border-purple-100' },
  'Chemistry': { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-100' },
  'Programming': { bg: 'bg-cyan-50/80', text: 'text-cyan-700', border: 'border-cyan-100' },
}
const DEFAULT_COLOR = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100' }

export default async function TutorClassesPage() {
  const classes = await listAssignedClasses()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-[#0F2A44] dark:text-[#F8F5EC]">Lớp của tôi</h2>
        <p className="text-sm text-muted-foreground">Danh sách các lớp học bạn đang đảm nhận giảng dạy.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {classes.length === 0 ? (
          <Card className="col-span-full py-12 text-center text-muted-foreground bg-white">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
            Bạn chưa được phân công lớp học nào.
          </Card>
        ) : (
          classes.map(c => {
            const colors = c.subjectName ? (SUBJECT_COLORS[c.subjectName] || DEFAULT_COLOR) : DEFAULT_COLOR
            const isOnline = c.mode === 'online'
            
            return (
              <Link 
                key={c.id} 
                href={`/dashboard/tutor/classes/${c.id}`} 
                className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 hover:shadow-md hover:border-[#D8B76A]/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  {/* Top tags and title */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {c.subjectName && (
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-bold text-[10px] px-2 py-0.5 shadow-none rounded-md`}>
                          {c.subjectName}
                        </Badge>
                      )}
                      {c.studentGrade && (
                        <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200 font-semibold text-[10px] px-2 py-0.5 rounded-md">
                          Lớp {c.studentGrade}
                        </Badge>
                      )}
                      <Badge className={`font-semibold text-[10px] px-2 py-0.5 shadow-none rounded-md ${
                        isOnline ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {c.mode === 'online' ? 'Online' : c.mode === 'offline' ? 'Offline' : 'Hybrid'}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-[#0F2A44] group-hover:text-[#D8B76A] transition-colors text-base">
                      {c.subjectName || 'Lớp'} - {c.studentName}
                    </h3>
                  </div>

                  {/* Class Info grid */}
                  <div className="grid gap-2 text-xs border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-2 text-[#4A5568]">
                      <Calendar className="h-4 w-4 text-[#D8B76A] shrink-0" />
                      <span className="font-medium text-slate-500 w-16 shrink-0">Lịch học:</span>
                      <span className="truncate font-semibold text-[#0F2A44]">{c.scheduleNotes || 'Chưa xếp lịch'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#4A5568]">
                      <DollarSign className="h-4 w-4 text-[#D8B76A] shrink-0" />
                      <span className="font-medium text-slate-500 w-16 shrink-0">Học phí:</span>
                      <span className="font-bold text-[#0F2A44]">
                        {c.tuitionFee ? `${new Intl.NumberFormat('vi-VN').format(c.tuitionFee)} đ` : 'Chưa cập nhật'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#4A5568]">
                      <Activity className="h-4 w-4 text-[#D8B76A] shrink-0" />
                      <span className="font-medium text-slate-500 w-16 shrink-0">Trạng thái:</span>
                      <span className="capitalize font-semibold text-emerald-600">
                        {c.status === 'assigned' ? 'Đang giảng dạy' : c.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
