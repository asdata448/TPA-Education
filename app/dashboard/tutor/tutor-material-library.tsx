'use client'

import { Flag, Search, BookOpen, FileDown, AlertTriangle, FileText, ChevronDown, CheckCircle2 } from 'lucide-react'
import { useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createDocumentFeedback, type FeedbackActionState } from './document-feedback-actions'
import type { AdminLibraryItem } from '../admin/materials-data'
import { useMemo, useState } from 'react'

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Math': { bg: 'bg-indigo-50/80', text: 'text-indigo-700', border: 'border-indigo-100' },
  'English': { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-100' },
  'Physics': { bg: 'bg-purple-50/80', text: 'text-purple-700', border: 'border-purple-100' },
  'Chemistry': { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-100' },
  'Programming': { bg: 'bg-cyan-50/80', text: 'text-cyan-700', border: 'border-cyan-100' },
}

const DEFAULT_COLOR = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100' }

export function TutorMaterialLibrary({ items }: { items: AdminLibraryItem[] }) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('all')

  const subjects = useMemo(() => 
    Array.from(new Set(items.map((item) => item.subjectName).filter(Boolean))).sort() as string[], 
    [items]
  )

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesSearch = !needle || [
        item.title, 
        item.subjectName, 
        item.gradeLevel, 
        item.description, 
        ...item.files.map((file) => file.fileName)
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))
      
      return matchesSearch && (subject === 'all' || item.subjectName === subject)
    })
  }, [items, query, subject])

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder="Tìm kiếm tài liệu, lớp, tên tệp..." 
            className="pl-9 bg-white"
          />
        </div>
        <div className="relative">
          <select 
            className="w-full sm:w-[200px] h-9 rounded-md border border-input bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer appearance-none pr-8 font-medium text-[#0F2A44]" 
            value={subject} 
            onChange={(event) => setSubject(event.target.value)}
          >
            <option value="all">Tất cả môn học</option>
            {subjects.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-white border rounded-xl">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
            Không tìm thấy tài liệu phù hợp.
          </div>
        ) : (
          filteredItems.map(item => {
            const colors = item.subjectName ? (SUBJECT_COLORS[item.subjectName] || DEFAULT_COLOR) : DEFAULT_COLOR
            return (
              <div 
                key={item.id} 
                className="group relative flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 hover:shadow-md hover:border-[#D8B76A]/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.subjectName && (
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-bold text-[10px] px-2 py-0.5 shadow-none rounded-md`}>
                            {item.subjectName}
                          </Badge>
                        )}
                        {item.gradeLevel && (
                          <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200 font-semibold text-[10px] px-2 py-0.5 rounded-md">
                            Lớp {item.gradeLevel}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-[#0F2A44] group-hover:text-[#D8B76A] transition-colors text-base line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                    <ReportMaterialButton itemId={item.id} itemTitle={item.title} />
                  </div>
                  
                  <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-2">
                    {item.description || 'Không có mô tả.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tệp đính kèm
                  </span>
                  <div className="grid gap-2">
                    {item.files.map(file => (
                      <a 
                        key={file.id} 
                        className="flex items-center justify-between text-xs font-semibold px-3 py-2 bg-[#F8F5EC]/50 hover:bg-[#F8F5EC] border border-transparent hover:border-[#D8B76A]/20 text-[#0F2A44] rounded-lg transition-all duration-200 group/file cursor-pointer" 
                        href={`/materials/${file.id}/download`} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <span className="flex items-center gap-2 truncate pr-2">
                          <FileText className="h-4 w-4 text-[#D8B76A] shrink-0" />
                          <span className="truncate group-hover/file:text-[#0F2A44] transition-colors">{file.fileName}</span>
                        </span>
                        <FileDown className="h-3.5 w-3.5 text-muted-foreground group-hover/file:text-[#0F2A44] shrink-0 transition-all group-hover/file:translate-y-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ReportMaterialButton({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(createDocumentFeedback, {} as FeedbackActionState)
  
  return (
    <div className="text-right">
      <button 
        type="button" 
        onClick={() => setOpen(true)} 
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 font-semibold transition-colors cursor-pointer bg-slate-50 hover:bg-red-50 px-2.5 py-1 rounded-md border border-transparent hover:border-red-100"
      >
        <Flag className="h-3.5 w-3.5" /> Báo lỗi
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full rounded-xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#0F2A44] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> Báo cáo sự cố tài liệu
            </DialogTitle>
            <DialogDescription className="text-xs">
              Bạn đang báo cáo sự cố hoặc đề xuất chỉnh sửa cho tài liệu: <strong className="text-[#0F2A44]">{itemTitle}</strong>
            </DialogDescription>
          </DialogHeader>

          <form action={action} className="space-y-4 pt-2">
            <input type="hidden" name="kind" value="material_report"/>
            <input type="hidden" name="libraryItemId" value={itemId}/>
            
            {state.error && (
              <Alert variant="destructive" className="py-2 px-3">
                <AlertDescription className="text-xs">{state.error}</AlertDescription>
              </Alert>
            )}
            {state.success && (
              <Alert className="py-2 px-3 border-emerald-200 bg-emerald-50 text-emerald-800">
                <AlertDescription className="text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  {state.success}
                </AlertDescription>
              </Alert>
            )}

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#0F2A44]" htmlFor={`report-${itemId}`}>
              Mô tả lỗi hoặc đề xuất cải tiến:
            </Label>
            <Textarea 
              id={`report-${itemId}`} 
              name="message" 
              rows={4} 
              required
              className="text-xs focus:ring-red-400 focus:border-red-400 bg-slate-50/50"
              placeholder="Ví dụ: Đề bị sai đáp án ở câu 3, tài liệu tải chậm..." 
            />
          </div>

          <DialogFooter className="flex gap-2 justify-end pt-3 border-t border-slate-100">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(false)} 
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              size="sm" 
              variant="destructive"
              className="text-xs h-9 px-4 bg-red-600 hover:bg-red-700 cursor-pointer"
              disabled={pending}
            >
              {pending ? 'Đang gửi...' : 'Gửi báo cáo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
  )
}
