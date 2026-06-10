'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { confirmTuitionPaid, confirmTutorPaid } from './finance-actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, CheckCircle2, AlertCircle, QrCode, CreditCard, Banknote, User } from 'lucide-react'
import { toast } from 'sonner'

type TutorData = {
  id: string
  name: string
  bankName: string
  bankAccountNo: string
  bankAccountName: string
  qrUrl: string | null
}

type ClassPaymentData = {
  id: string
  studentName: string
  studentGrade: string | null
  parentName: string | null
  parentPhone: string | null
  subjectName: string
  defaultTuitionFee: number
  tutor: TutorData | null
  payment: {
    tuitionFee: number
    tuitionStatus: string
    tuitionPaidAt: string | null
    tutorPaymentStatus: string
    tutorPaidAt: string | null
  }
}

export function FinanceManager({
  initialClasses,
  currentMonth,
}: {
  initialClasses: ClassPaymentData[]
  currentMonth: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [activeTab, setActiveTab] = useState('tuition')
  
  // Payment Modal States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassPaymentData | null>(null)
  const [customFee, setCustomFee] = useState('')

  // Tutor Payment Modal States
  const [tutorModalOpen, setTutorModalOpen] = useState(false)
  const [selectedTutorClass, setSelectedTutorClass] = useState<ClassPaymentData | null>(null)

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const month = e.target.value
    setSelectedMonth(month)
    router.push(`/dashboard/admin/finance?month=${month}`)
  }

  const handleOpenTuitionModal = (c: ClassPaymentData) => {
    setSelectedClass(c)
    setCustomFee(String(c.payment.tuitionFee || c.defaultTuitionFee || ''))
    setPaymentModalOpen(true)
  }

  const handleConfirmTuition = () => {
    if (!selectedClass) return
    const fee = Number(customFee)
    if (isNaN(fee) || fee <= 0) {
      toast.error('Vui lòng nhập học phí hợp lệ')
      return
    }

    startTransition(async () => {
      const res = await confirmTuitionPaid(selectedClass.id, selectedMonth, fee)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Đã ghi nhận đóng học phí')
        setPaymentModalOpen(false)
        router.refresh()
      }
    })
  }

  const handleOpenTutorModal = (c: ClassPaymentData) => {
    setSelectedTutorClass(c)
    setTutorModalOpen(true)
  }

  const handleConfirmTutorPaid = () => {
    if (!selectedTutorClass) return

    startTransition(async () => {
      const res = await confirmTutorPaid(selectedTutorClass.id, selectedMonth)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Đã xác nhận thanh toán cho gia sư')
        setTutorModalOpen(false)
        router.refresh()
      }
    })
  }

  // Filter classes depending on whether parent has paid (for the tutor wage tab)
  const paidTuitionClasses = initialClasses.filter(c => c.payment.tuitionStatus === 'paid')

  return (
    <div className="space-y-6">
      {/* Month Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 backdrop-blur-sm p-4 rounded-xl border border-border">
        <div className="space-y-1">
          <h3 className="font-semibold text-base">Chu kỳ thanh toán</h3>
          <p className="text-xs text-muted-foreground">Chọn tháng để quản lý và theo dõi các khoản tài chính</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="month-picker" className="text-sm font-medium">Tháng:</Label>
          <Input
            id="month-picker"
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-44 bg-background"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 bg-muted/40 p-1 rounded-lg">
          <TabsTrigger value="tuition" className="rounded-md font-medium">
            <Banknote className="h-4 w-4 mr-2" />
            Học phí Phụ huynh
          </TabsTrigger>
          <TabsTrigger value="tutors" className="rounded-md font-medium">
            <CreditCard className="h-4 w-4 mr-2" />
            Lương Gia sư (95%)
          </TabsTrigger>
        </TabsList>

        {/* TUITION TAB */}
        <TabsContent value="tuition">
          <Card>
            <CardHeader>
              <CardTitle>Thu học phí từ Phụ huynh</CardTitle>
              <CardDescription>
                Theo dõi và xác nhận các khoản học phí thu từ phụ huynh trong tháng {selectedMonth}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Học sinh / Lớp</TableHead>
                      <TableHead>Thông tin Phụ huynh</TableHead>
                      <TableHead>Học phí định mức</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          Không có lớp học nào được phân công gia sư trong tháng này.
                        </TableCell>
                      </TableRow>
                    ) : (
                      initialClasses.map(c => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="font-semibold">{c.studentName}</div>
                            <div className="text-xs text-muted-foreground">
                              {c.subjectName} {c.studentGrade ? `(${c.studentGrade})` : ''}
                            </div>
                          </TableCell>
                          <TableCell className="space-y-1">
                            <div className="text-sm font-medium">{c.parentName || '-'}</div>
                            {c.parentPhone && (
                              <a
                                href={`tel:${c.parentPhone}`}
                                className="flex items-center text-xs text-primary hover:underline"
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                {c.parentPhone}
                              </a>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              c.payment.tuitionFee || c.defaultTuitionFee
                            )}
                          </TableCell>
                          <TableCell>
                            {c.payment.tuitionStatus === 'paid' ? (
                              <Badge className="bg-emerald-500 hover:bg-emerald-600">Đã thu</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                                Chưa thu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {c.payment.tuitionStatus === 'paid' ? (
                              <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                {c.payment.tuitionPaidAt && new Date(c.payment.tuitionPaidAt).toLocaleDateString('vi-VN')}
                              </span>
                            ) : (
                              <Button size="sm" onClick={() => handleOpenTuitionModal(c)}>
                                Xác nhận đã thu
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TUTORS TAB */}
        <TabsContent value="tutors">
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán lương Gia sư</CardTitle>
              <CardDescription>
                Chỉ hiển thị các lớp học <strong>đã thu học phí thành công</strong> từ phụ huynh. Lương gia sư tự động tính bằng 95% học phí.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lớp / Học sinh</TableHead>
                      <TableHead>Gia sư</TableHead>
                      <TableHead>Lương Gia sư (95%)</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidTuitionClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                          Chưa có lớp nào được thu học phí hoặc chưa có lớp nào sẵn sàng thanh toán lương.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paidTuitionClasses.map(c => {
                        const baseFee = c.payment.tuitionFee || c.defaultTuitionFee
                        const tutorWage = baseFee * 0.95
                        return (
                          <TableRow key={c.id}>
                            <TableCell>
                              <div className="font-semibold">{c.studentName}</div>
                              <div className="text-xs text-muted-foreground">{c.subjectName}</div>
                            </TableCell>
                            <TableCell>
                              {c.tutor ? (
                                <div className="space-y-1">
                                  <div className="font-medium flex items-center gap-1">
                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                    {c.tutor.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {c.tutor.bankName ? `${c.tutor.bankName} - ${c.tutor.bankAccountNo}` : 'Chưa cập nhật tài khoản'}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">Chưa giao gia sư</span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tutorWage)}
                            </TableCell>
                            <TableCell>
                              {c.payment.tutorPaymentStatus === 'paid' ? (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">Đã thanh toán</Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                                  Chưa chuyển
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {c.payment.tutorPaymentStatus === 'paid' ? (
                                <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  {c.payment.tutorPaidAt && new Date(c.payment.tutorPaidAt).toLocaleDateString('vi-VN')}
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenTutorModal(c)}
                                  disabled={!c.tutor}
                                >
                                  Thanh toán
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CONFIRM TUITION DIALOG */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận đã thu học phí</DialogTitle>
            <DialogDescription>
              Vui lòng nhập chính xác số tiền học phí thực tế đã nhận được từ phụ huynh của học sinh{' '}
              <strong>{selectedClass?.studentName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="custom-fee">Số tiền học phí nhận được (VND)</Label>
              <Input
                id="custom-fee"
                type="number"
                value={customFee}
                onChange={e => setCustomFee(e.target.value)}
                placeholder="Nhập số tiền thực nhận"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Hủy</Button>
            <Button onClick={handleConfirmTuition} disabled={isPending}>
              {isPending ? 'Đang cập nhật...' : 'Xác nhận Đã thu tiền'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM TUTOR PAYMENT DIALOG (WITH QR CODE VIEW) */}
      <Dialog open={tutorModalOpen} onOpenChange={setTutorModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Thanh toán & Chuyển khoản lương Gia sư
            </DialogTitle>
            <DialogDescription>
              Quét mã QR dưới đây hoặc copy thông tin tài khoản ngân hàng để chuyển lương cho gia sư.
            </DialogDescription>
          </DialogHeader>

          {selectedTutorClass && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border border-border text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Gia sư nhận</span>
                  <span className="font-semibold text-base">{selectedTutorClass.tutor?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Số tiền (95%)</span>
                  <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      (selectedTutorClass.payment.tuitionFee || selectedTutorClass.defaultTuitionFee) * 0.95
                    )}
                  </span>
                </div>
                <div className="col-span-2 border-t border-border pt-2 mt-1">
                  <span className="text-muted-foreground block text-xs">Ngân hàng & Số tài khoản</span>
                  <span className="font-medium text-foreground">
                    {selectedTutorClass.tutor?.bankName} — {selectedTutorClass.tutor?.bankAccountNo}
                  </span>
                  <span className="block text-xs font-semibold text-muted-foreground mt-0.5">
                    CHỦ TK: {selectedTutorClass.tutor?.bankAccountName}
                  </span>
                </div>
              </div>

              {/* QR Image */}
              <div className="flex flex-col items-center justify-center border border-border rounded-xl p-4 bg-white/70 backdrop-blur-sm shadow-inner max-w-sm mx-auto">
                {selectedTutorClass.tutor?.qrUrl ? (
                  <div className="text-center space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedTutorClass.tutor.qrUrl}
                      alt="Mã QR Chuyển khoản Gia sư"
                      className="max-h-72 max-w-full rounded-md object-contain shadow-md mx-auto"
                    />
                    <span className="text-xs text-muted-foreground block">
                      Mã QR quét chuyển khoản trực tiếp
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-10 text-amber-600 dark:text-amber-400 space-y-2">
                    <AlertCircle className="h-10 w-10 mx-auto opacity-75" />
                    <p className="text-sm font-medium">Gia sư chưa tải mã QR ngân hàng lên hệ thống</p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Vui lòng chuyển khoản thủ công bằng số tài khoản hoặc yêu cầu gia sư cập nhật mã QR.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setTutorModalOpen(false)}>Đóng</Button>
            <Button onClick={handleConfirmTutorPaid} disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isPending ? 'Đang xử lý...' : 'Xác nhận đã chuyển khoản thành công'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
