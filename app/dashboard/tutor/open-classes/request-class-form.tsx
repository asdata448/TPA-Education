'use client'

import { useActionState, useEffect } from 'react'
import { requestClass, type RequestState } from '../class-actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

export function RequestClassForm({ classId }: { classId: string }) {
  const [state, action, pending] = useActionState(requestClass, {} as RequestState)

  useEffect(() => {
    if (state.success) {
      toast.success(state.success)
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="classId" value={classId} />
      <Textarea 
        name="message" 
        placeholder="Lời nhắn gửi tới Admin khi nhận lớp (Ví dụ: Mình có kinh nghiệm ôn thi 11, học lực tốt...)" 
        rows={2}
        className="text-xs bg-slate-50/50 focus:ring-[#D8B76A] focus:border-[#D8B76A]"
      />
      <Button 
        type="submit"
        disabled={pending}
        className="bg-[#0F2A44] hover:bg-[#1a3a5c] cursor-pointer text-xs h-8 px-4 flex items-center gap-1.5"
      >
        <Send className="h-3.5 w-3.5" />
        {pending ? 'Đang đăng ký...' : 'Đăng ký nhận lớp'}
      </Button>
    </form>
  )
}
