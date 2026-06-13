'use client'

import { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Send, 
  MessageSquare, 
  History, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileQuestion,
  AlertTriangle
} from 'lucide-react'
import { createDocumentFeedback, type FeedbackActionState } from '../document-feedback-actions'
import type { TutorFeedbackContext } from '../document-feedback-data'
import { TutorPageHeader } from '../_components/tutor-page-header'

export function TutorDocumentFeedback({ context }: { context: TutorFeedbackContext }) {
  const [state, action, pending] = useActionState(createDocumentFeedback, {} as FeedbackActionState)

  // Trigger toasts on action status changes
  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="space-y-6">
      <TutorPageHeader color="pink" icon={MessageSquare} title="Yêu cầu & Phản hồi" subtitle="Gửi yêu cầu tài liệu và xem phản hồi từ Ban chuyên môn TPA+." />

      {/* Request Form Card */}
      <Card className="border-[#E2E8F0] shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-[#F8F5EC]/30">
          <CardTitle className="text-base font-bold text-[#0F2A44] flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-[#D8B76A]" /> Yêu cầu tài liệu mới
          </CardTitle>
          <CardDescription className="text-xs">
            Gửi yêu cầu tài liệu học tập, đề thi hoặc phiếu bài tập bổ sung cho Ban chuyên môn TPA+.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={action} className="space-y-4">
            <input type="hidden" name="kind" value="material_request" />

            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs font-bold text-[#0F2A44]">
                Mô tả chi tiết tài liệu bạn cần (Ví dụ: Chuyên đề Phân tích đa thức lớp 8 nâng cao, Đề kiểm tra Toán giữa kỳ 2 Trường THCS Dĩ An...):
              </Label>
              <Textarea 
                id="message" 
                name="message" 
                rows={4} 
                required
                className="text-xs focus:ring-[#D8B76A] focus:border-[#D8B76A] bg-slate-50/50"
                placeholder="Vui lòng nêu rõ môn học, khối lớp, dạng bài tập hoặc đề thi cụ thể để hỗ trợ nhanh nhất..." 
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={pending}
              className="bg-[#0F2A44] hover:bg-[#1a3a5c] cursor-pointer text-xs h-9 px-4 flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              {pending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Request History Card */}
      <Card className="border-[#E2E8F0] shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 bg-[#F8F5EC]/30">
          <CardTitle className="text-base font-bold text-[#0F2A44] flex items-center gap-2">
            <History className="h-5 w-5 text-[#D8B76A]" /> Lịch sử yêu cầu & phản hồi
          </CardTitle>
          <CardDescription className="text-xs">
            Theo dõi trạng thái phê duyệt và nhận phản hồi, ghi chú từ Ban chuyên môn.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {context.feedback.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/20 mb-2" />
                Chưa có yêu cầu hoặc phản hồi nào được ghi nhận.
              </div>
            ) : (
              context.feedback.map((item) => {
                const statusConfig = getStatusConfig(item.status)
                const isReport = item.kind === 'material_report'
                
                // Color cards differently based on type (Request: Blue/Indigo vs Report: Rose/Red)
                const cardStyles = isReport
                  ? 'bg-rose-50/30 border-rose-100 hover:border-rose-300'
                  : 'bg-blue-50/30 border-blue-100 hover:border-blue-300'

                return (
                  <div 
                    key={item.id} 
                    className={`rounded-xl border p-4 text-xs transition-all duration-200 ${cardStyles}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100/60 pb-2 mb-2">
                      <span className={`font-bold flex items-center gap-1.5 ${isReport ? 'text-rose-900' : 'text-blue-900'}`}>
                        {isReport ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-blue-500" />
                        )}
                        {labelForKind(item.kind)}
                      </span>
                      <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border shadow-none font-bold text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1`}>
                        <statusConfig.icon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {item.libraryTitle && (
                      <p className="mb-2 text-[#4A5568] bg-white/85 border border-slate-100 rounded-md p-2">
                        <strong className="text-[#0F2A44]">Tài liệu liên quan:</strong> {item.libraryTitle}
                      </p>
                    )}

                    <p className="text-[#4A5568] leading-relaxed whitespace-pre-wrap pl-1">
                      {item.message}
                    </p>

                    {item.status === 'done' && item.adminNote && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-50/65 border border-emerald-100 text-emerald-800">
                        <strong className="font-bold block mb-1">✓ Phản hồi từ Admin:</strong>
                        <p className="leading-relaxed">{item.adminNote}</p>
                      </div>
                    )}

                    {item.status === 'rejected' && item.rejectReason && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50/65 border border-red-100 text-red-800">
                        <strong className="font-bold block mb-1">✗ Lý do từ chối:</strong>
                        <p className="leading-relaxed">{item.rejectReason}</p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function labelForKind(kind: string) { 
  return kind === 'material_report' ? 'Báo cáo sự cố tài liệu' : 'Yêu cầu tài liệu mới' 
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return {
        label: 'Đang xử lý',
        bg: 'bg-amber-50/80',
        text: 'text-amber-700',
        border: 'border-amber-100',
        icon: Clock
      }
    case 'done':
      return {
        label: 'Hoàn thành',
        bg: 'bg-emerald-50/80',
        text: 'text-emerald-700',
        border: 'border-emerald-100',
        icon: CheckCircle2
      }
    case 'rejected':
      return {
        label: 'Từ chối',
        bg: 'bg-red-50/80',
        text: 'text-red-700',
        border: 'border-red-100',
        icon: XCircle
      }
    default:
      return {
        label: status,
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-100',
        icon: Clock
      }
  }
}
