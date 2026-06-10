import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Star, FileText, Calendar, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DownloadButton } from './download-button'

export const revalidate = 0

type Params = Promise<{ reportId: string }>

async function getFullReportData(reportId: string) {
  try {
    const admin = createAdminClient()
    const { data: report, error: reportError } = await admin
      .from('class_progress_reports')
      .select(`
        *,
        classes (
          student_name,
          student_grade,
          subjects (name),
          tutors (
            profiles (full_name)
          )
        )
      `)
      .eq('id', reportId)
      .maybeSingle()

    if (reportError || !report) return null

    const c = report.classes
    const tutor = Array.isArray(c?.tutors) ? c.tutors[0] : c?.tutors
    const tutorName = tutor?.profiles?.full_name || 'Gia sư TPA+'
    const subjectName = (Array.isArray(c?.subjects) ? c.subjects[0]?.name : c?.subjects?.name) || 'Môn học'

    return {
      id: report.id,
      reportingMonth: report.reporting_month,
      lessonsCompleted: report.lessons_completed,
      ratingComprehension: report.rating_comprehension,
      ratingHomework: report.rating_homework,
      ratingAttendance: report.rating_attendance,
      ratingAttitude: report.rating_attitude,
      teacherComments: report.teacher_comments,
      nextMonthPlan: report.next_month_plan,
      tuitionFee: Number(report.tuition_fee),
      createdAt: report.created_at,
      studentName: c?.student_name || 'Học sinh',
      studentGrade: c?.student_grade || '',
      subjectName,
      tutorName,
    }
  } catch (e) {
    console.error('Error fetching full report data:', e)
    return null
  }
}

export default async function PublicReportPage({ params }: { params: Params }) {
  const { reportId } = await params
  const report = await getFullReportData(reportId)

  if (!report) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'fill-[#D8B76A] text-[#D8B76A]' : 'text-neutral-200'
            }`}
          />
        ))}
      </div>
    )
  }

  const avgScore = (report.ratingComprehension + report.ratingHomework + report.ratingAttendance + report.ratingAttitude) / 4

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return ''
    const parts = monthStr.split('-')
    if (parts.length === 2) {
      return `${parts[1]}/${parts[0]}`
    }
    return monthStr
  }

  const formattedMonth = formatMonth(report.reportingMonth)

  return (
    <main className="min-h-screen bg-[#F8F5EC] py-12 px-4 flex flex-col items-center justify-center print:bg-white print:p-0">
      
      {/* Actions bar (hidden in print) */}
      <div className="w-full max-w-[800px] flex justify-end mb-4 print:hidden">
        <DownloadButton studentName={report.studentName} month={report.reportingMonth} />
      </div>

      {/* 16:9 Landscape Poster Card - Light Theme */}
      <div
        id="report-card"
        className="w-full max-w-[800px] aspect-[16/9] bg-white text-[#0F2A44] rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] relative flex print:border-0 print:rounded-none print:shadow-none print:w-[800px] print:h-[450px]"
      >
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8B76A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0F2A44]/5 rounded-full blur-2xl pointer-events-none" />

        {/* LEFT SIDE (50% Width) - Report Details */}
        <div className="w-[50%] p-6 flex flex-col justify-between border-r border-[#E5E7EB] relative z-10 bg-white">
          
          {/* Header & Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logoTPA.png"
                alt="TPA+ Logo"
                className="h-8 w-auto object-contain"
              />
              <Badge className="bg-[#0F2A44]/10 text-[#0F2A44] border border-[#0F2A44]/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                Kỳ: {formattedMonth}
              </Badge>
            </div>
            
            <div className="space-y-0.5">
              <h1 className="text-sm font-black tracking-wider text-[#0F2A44] uppercase">
                PHIẾU ĐÁNH GIÁ TIẾN ĐỘ
              </h1>
              <p className="text-muted-foreground text-[9px] uppercase tracking-widest font-semibold">Gia sư chất lượng cao TPA+</p>
            </div>
          </div>

          {/* Student Profile Block */}
          <div className="grid grid-cols-2 gap-3 bg-[#F8F5EC]/40 border border-[#E5E7EB] rounded-lg p-3 text-[11px] mt-1">
            <div className="space-y-1">
              <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider block">Học sinh</span>
              <p className="font-bold text-[#0F2A44] truncate">{report.studentName}</p>
              <p className="text-muted-foreground">{report.studentGrade ? `Lớp ${report.studentGrade}` : ''}</p>
            </div>
            <div className="space-y-1 border-l border-[#E5E7EB] pl-3">
              <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider block">Gia sư & Lớp học</span>
              <p className="font-semibold text-[#0F2A44] truncate">{report.tutorName}</p>
              <p className="text-muted-foreground truncate">{report.subjectName} • {report.lessonsCompleted} buổi</p>
            </div>
          </div>

          {/* Evaluation Indicators */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between border-b border-border pb-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#0F2A44] font-bold">Kết quả học tập</span>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="font-black text-[#0F2A44]">{avgScore.toFixed(1)}</span>
                <span className="text-muted-foreground">/ 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#F8F5EC]/20 px-2 py-1.5 rounded border border-border flex items-center justify-between">
                <span className="font-medium">Tiếp thu bài</span>
                {renderStars(report.ratingComprehension)}
              </div>
              <div className="bg-[#F8F5EC]/20 px-2 py-1.5 rounded border border-border flex items-center justify-between">
                <span className="font-medium">Tự giác</span>
                {renderStars(report.ratingHomework)}
              </div>
              <div className="bg-[#F8F5EC]/20 px-2 py-1.5 rounded border border-border flex items-center justify-between">
                <span className="font-medium">Chuyên cần</span>
                {renderStars(report.ratingAttendance)}
              </div>
              <div className="bg-[#F8F5EC]/20 px-2 py-1.5 rounded border border-border flex items-center justify-between">
                <span className="font-medium">Thái độ học</span>
                {renderStars(report.ratingAttitude)}
              </div>
            </div>
          </div>

          {/* Footer Branding (Left) */}
          <div className="text-[8px] text-muted-foreground/75 pt-2 border-t border-border mt-1">
            Gia sư {report.tutorName}
          </div>
        </div>

        {/* RIGHT SIDE (50% Width) - Payments & QR Code */}
        <div className="w-[50%] p-6 flex flex-col justify-between bg-[#F8F5EC]/30 relative z-10">
          
          {/* Tutor Comments */}
          <div className="space-y-1">
            <p className="text-[#0F2A44] text-[9px] uppercase font-extrabold tracking-wider flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-[#D8B76A]" /> Nhận xét của Gia sư
            </p>
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5 min-h-[75px] max-h-[95px] overflow-y-auto">
              <p className="text-[#4A5568] text-[11.5px] leading-relaxed whitespace-pre-line">
                {report.teacherComments}
              </p>
            </div>
          </div>

          {/* Large Payment & QR Section */}
          <div className="space-y-3 mt-2">
            <div className="bg-white border border-[#D8B76A]/40 rounded-xl p-3.5 flex items-center justify-between gap-4 shadow-md">
              <div className="space-y-2.5 flex-1 min-w-[120px]">
                <span className="text-[9px] uppercase font-bold text-muted-foreground block">Thanh toán học phí</span>
                <span className="text-xl font-black text-[#0F2A44] block leading-none">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    report.tuitionFee
                  )}
                </span>
                <span className="text-[9px] text-[#4A5568] block leading-normal">
                  <strong>Cú pháp CK:</strong><br />
                  <span className="bg-[#0F2A44]/10 text-[#0F2A44] font-bold px-1.5 py-0.5 rounded select-all block mt-0.5 text-center text-[9.5px]">
                    {report.studentName} + {formattedMonth}
                  </span>
                </span>
              </div>

              {/* Giant QR Image Container (takes up a large portion of right side) */}
              <div className="bg-white p-1 rounded-xl shrink-0 flex items-center justify-center shadow-md border border-[#E5E7EB] w-[140px] h-[140px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qrtrungtam.png"
                  alt="QR Transfer"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Contact Hotline */}
          <div className="text-center text-[9px] text-[#0F2A44] border-t border-border pt-3 mt-1 font-bold">
            Hotline Hỗ Trợ: 0899 736 669
          </div>
        </div>

      </div>
    </main>
  )
}
