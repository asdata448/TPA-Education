'use client'

import { useActionState, useState } from 'react'
import { updateTutorBankSettings, type BankSettingsState } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { TutorPageHeader } from '../_components/tutor-page-header'
import { Check, UploadCloud, Image as ImageIcon, Wallet } from 'lucide-react'

type TutorBankDetails = {
  bankName: string
  bankAccountNo: string
  bankAccountName: string
  bankQrKey: string
  qrUrl: string | null
}

export function BankSettingsForm({ initialData }: { initialData: TutorBankDetails | null }) {
  const [state, action, pending] = useActionState(updateTutorBankSettings, {} as BankSettingsState)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.qrUrl || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <TutorPageHeader color="rose" icon={Wallet} title="Thông tin thanh toán" subtitle="Cập nhật thông tin nhận thanh toán học phí. Mã QR tĩnh sẽ được Admin chuyển khoản trực tiếp qua ngân hàng." />
      <Card className="border-[#E2E8F0] p-6 shadow-sm md:p-8">

        <form action={action} className="space-y-6">
          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Không thể cập nhật</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert className="border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <AlertTitle className="m-0 font-medium">Thành công</AlertTitle>
              </div>
              <AlertDescription className="mt-1">{state.success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Tên ngân hàng</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  required
                  placeholder="Ví dụ: Vietcombank, Techcombank"
                  defaultValue={initialData?.bankName || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNo">Số tài khoản</Label>
                <Input
                  id="bankAccountNo"
                  name="bankAccountNo"
                  required
                  placeholder="Nhập số tài khoản ngân hàng"
                  defaultValue={initialData?.bankAccountNo || ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountName">Tên chủ tài khoản</Label>
              <Input
                id="bankAccountName"
                name="bankAccountName"
                required
                placeholder="Nhập họ và tên chủ tài khoản (viết hoa không dấu)"
                defaultValue={initialData?.bankAccountName || ''}
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Mã QR ngân hàng tĩnh (Static QR Code)</Label>
              <div className="grid md:grid-cols-2 gap-4 items-center">
                {/* Upload Area */}
                <div className="relative border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition rounded-lg p-6 text-center cursor-pointer bg-muted/30">
                  <input
                    type="file"
                    id="qrFile"
                    name="qrFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">Tải mã QR mới lên</span>
                    <span className="text-xs text-muted-foreground">PNG, JPEG hoặc WEBP (Tối đa 5MB)</span>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="flex flex-col items-center justify-center border border-muted-foreground/10 rounded-lg p-4 bg-muted/30 h-40">
                  {previewUrl ? (
                    <div className="relative group w-full h-full flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Mã QR Ngân hàng"
                        className="max-h-full max-w-full rounded object-contain shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground text-xs space-y-1">
                      <ImageIcon className="h-8 w-8 opacity-55 mb-1" />
                      <span>Chưa tải ảnh QR lên</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={pending} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md transition-all">
            {pending ? 'Đang cập nhật...' : 'Cập nhật thông tin ngân hàng'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
