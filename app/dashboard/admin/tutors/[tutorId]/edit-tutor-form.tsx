'use client'

import { useState, useActionState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateTutor, resetTutorPassword, type UpdateTutorState } from '../../actions'
import type { AdminTutorDetail } from '../../data'
import { KeyRound, Check, Copy } from 'lucide-react'

export function EditTutorForm({ tutor }: { tutor: AdminTutorDetail }) {
  const [state, action, pending] = useActionState(updateTutor, {} as UpdateTutorState)
  const [resetting, setResetting] = useState(false)
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleResetPassword = async () => {
    if (!confirm('Bạn có chắc chắn muốn cấp lại mật khẩu cho gia sư này? Mật khẩu hiện tại sẽ bị ghi đè.')) {
      return
    }
    setResetting(true)
    setResetError(null)
    setNewPassword(null)
    setCopied(false)
    try {
      const res = await resetTutorPassword(tutor.profileId)
      if (res.error) {
        setResetError(res.error)
      } else if (res.password) {
        setNewPassword(res.password)
      }
    } catch (e: any) {
      setResetError(e.message || 'Đã xảy ra lỗi.')
    } finally {
      setResetting(false)
    }
  }

  const handleCopy = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-5">
        <input type="hidden" name="tutorId" value={tutor.tutorId} />
        <input type="hidden" name="profileId" value={tutor.profileId} />

        {state.error && <Alert variant="destructive"><AlertTitle>Update failed</AlertTitle><AlertDescription>{state.error}</AlertDescription></Alert>}
        {state.success && <Alert><AlertTitle>Saved</AlertTitle><AlertDescription>{state.success}</AlertDescription></Alert>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="fullName" defaultValue={tutor.fullName} required />
          <Field label="Email" name="email" defaultValue={tutor.email} disabled />
          <Field label="Phone" name="phone" defaultValue={tutor.phone ?? ''} />
          <Field label="Subjects" name="subjects" defaultValue={tutor.subjects ?? ''} />
          <Field label="Specialties" name="specialties" defaultValue={tutor.specialties ?? ''} className="sm:col-span-2" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={5} defaultValue={tutor.notes ?? ''} />
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Checkbox id="active" name="active" defaultChecked={tutor.profileActive && tutor.tutorActive} />
          <div className="space-y-1">
            <Label htmlFor="active">Tutor account active</Label>
            <p className="text-sm text-muted-foreground">Turning this off also blocks Tutor login and dashboard access.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Save Tutor profile'}</Button>
        </div>
      </form>

      {/* Reset Password Card Section */}
      <div className="border border-amber-200 bg-amber-50/30 rounded-lg p-5 space-y-4">
        <div className="flex items-start gap-3">
          <KeyRound className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-900 text-sm">Cấp lại Mật khẩu (Reset Password)</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Nếu gia sư quên mật khẩu đăng nhập, bạn có thể tạo một mật khẩu ngẫu nhiên mới tại đây. Mật khẩu mới sẽ hiển thị duy nhất một lần sau khi nhấn nút.
            </p>
          </div>
        </div>

        {resetError && (
          <Alert variant="destructive">
            <AlertTitle>Lỗi đặt lại mật khẩu</AlertTitle>
            <AlertDescription>{resetError}</AlertDescription>
          </Alert>
        )}

        {newPassword && (
          <div className="bg-white border border-green-200 rounded-lg p-4 space-y-3 shadow-sm">
            <p className="text-xs font-semibold text-green-800">Khởi tạo mật khẩu mới thành công!</p>
            <div className="flex items-center gap-2">
              <code className="bg-neutral-100 px-3 py-1.5 rounded text-sm font-mono tracking-wider flex-1 border select-all">
                {newPassword}
              </code>
              <Button size="icon" variant="outline" className="h-9 w-9" onClick={handleCopy} type="button">
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              * Vui lòng copy và gửi mật khẩu này cho gia sư. Mật khẩu này sẽ không hiển thị lại sau khi bạn tải lại trang.
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleResetPassword}
          disabled={resetting}
          className="border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          {resetting ? 'Đang cấp lại...' : 'Cấp mật khẩu ngẫu nhiên mới'}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, className, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  const id = String(props.name)
  return <div className={`space-y-2 ${className ?? ''}`}><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}
