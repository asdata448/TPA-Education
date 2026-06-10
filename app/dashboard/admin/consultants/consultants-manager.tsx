'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Loader2, Edit2, Trash2, Calendar, Phone, Mail, GraduationCap, Check, HelpCircle } from 'lucide-react'
import { updateConsultantRequest, deleteConsultantRequest } from './consultant-actions'

type RequestItem = {
  id: string
  name: string
  phone: string
  email: string | null
  grade: string
  subjects: string[]
  goals: string[]
  format: string | null
  message: string | null
  status: string
  adminNotes: string | null
  createdAt: string
}

interface ConsultantsManagerProps {
  initialRequests: RequestItem[]
}

const formatSubject = (subjectId: string) => {
  const mapping: Record<string, string> = {
    toan: 'Toán học',
    ly: 'Vật lý',
    hoa: 'Hóa học',
    tin: 'Tin học Lập trình',
  }
  return mapping[subjectId] || subjectId
}

const formatGoal = (goalId: string) => {
  const mapping: Record<string, string> = {
    laygoc: 'Lấy gốc kiến thức',
    tangdiem: 'Tăng điểm số',
    onthi: 'Ôn thi THPT/Chuyển cấp',
    laptrinh: 'Học lập trình',
  }
  return mapping[goalId] || goalId
}

export function ConsultantsManager({ initialRequests }: ConsultantsManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'contacted' | 'cancelled'>('all')
  
  // Dialog state
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Edit fields
  const [status, setStatus] = useState('pending')
  const [adminNotes, setAdminNotes] = useState('')

  // Filters
  const filteredRequests = initialRequests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.message && r.message.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const openDetails = (r: RequestItem) => {
    setSelectedRequest(r)
    setStatus(r.status)
    setAdminNotes(r.adminNotes || '')
    setIsDetailsOpen(true)
  }

  const openDeleteConfirm = (r: RequestItem) => {
    setSelectedRequest(r)
    setIsDeleteOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest) return

    startTransition(async () => {
      const res = await updateConsultantRequest(selectedRequest.id, status, adminNotes)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Cập nhật thành công!')
        setIsDetailsOpen(false)
        router.refresh()
      }
    })
  }

  const handleDelete = async () => {
    if (!selectedRequest) return

    startTransition(async () => {
      const res = await deleteConsultantRequest(selectedRequest.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Đã xóa yêu cầu!')
        setIsDeleteOpen(false)
        router.refresh()
      }
    })
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Chờ liên hệ</Badge>
      case 'contacted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Đã tư vấn</Badge>
      case 'cancelled':
        return <Badge className="bg-neutral-100 text-neutral-800 border-neutral-200">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{s}</Badge>
    }
  }

  const countByStatus = (s: string) => {
    if (s === 'all') return initialRequests.length
    return initialRequests.filter((r) => r.status === s).length
  }

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT, email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filtering tabs */}
        <div className="flex bg-[#F8F5EC] p-1.5 rounded-lg border gap-1 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-[#0F2A44] shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tất cả ({countByStatus('all')})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Chờ liên hệ ({countByStatus('pending')})
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'contacted'
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đã tư vấn ({countByStatus('contacted')})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'cancelled'
                ? 'bg-neutral-500 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đã hủy ({countByStatus('cancelled')})
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu tư vấn</CardTitle>
          <CardDescription>
            Các yêu cầu đăng ký tư vấn tuyển sinh miễn phí nhận được từ form liên hệ ở trang chủ.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên học sinh</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Lớp & Môn học</TableHead>
                  <TableHead>Hình thức</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      Không tìm thấy yêu cầu tư vấn nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-semibold">{r.name}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{r.phone}</div>
                        {r.email && <div className="text-xs text-muted-foreground">{r.email}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground mb-1">
                          Lớp {r.grade}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {r.subjects.map((sub) => (
                            <Badge key={sub} variant="secondary" className="text-[10px] px-1 py-0">
                              {formatSubject(sub)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-xs font-medium">
                        {r.format === 'both' ? 'Online + Offline' : r.format || '-'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>{getStatusBadge(r.status)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openDetails(r)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteConfirm(r)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details & Update Status Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu tư vấn</DialogTitle>
            <DialogDescription>
              Đăng ký gửi lúc {selectedRequest ? new Date(selectedRequest.createdAt).toLocaleString('vi-VN') : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <form onSubmit={handleUpdate} className="space-y-4 py-2">
              
              {/* Detailed specs */}
              <div className="grid grid-cols-2 gap-3 text-sm border-b pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Họ và tên học sinh</span>
                  <span className="font-bold text-[#0F2A44]">{selectedRequest.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Lớp học hiện tại</span>
                  <span className="font-bold text-[#0F2A44] flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-[#D8B76A]" /> Lớp {selectedRequest.grade}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Số điện thoại</span>
                  <a href={`tel:${selectedRequest.phone}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {selectedRequest.phone}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Email</span>
                  {selectedRequest.email ? (
                    <a href={`mailto:${selectedRequest.email}`} className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {selectedRequest.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">-</span>
                  )}
                </div>
              </div>

              {/* Subject & Goals */}
              <div className="space-y-2 border-b pb-4">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Môn học quan tâm</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRequest.subjects.map((sub) => (
                      <Badge key={sub} className="bg-indigo-50 text-indigo-700 border-indigo-100">
                        {formatSubject(sub)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedRequest.goals.length > 0 && (
                  <div className="pt-1">
                    <span className="text-xs text-muted-foreground block mb-1">Mục tiêu học tập</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRequest.goals.map((gl) => (
                        <Badge key={gl} className="bg-[#F8F5EC] text-[#0F2A44] border-neutral-200">
                          {formatGoal(gl)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.format && (
                  <div className="pt-1">
                    <span className="text-xs text-muted-foreground block mb-0.5">Hình thức học mong muốn</span>
                    <span className="text-xs font-semibold capitalize bg-neutral-100 px-2 py-0.5 rounded text-neutral-850">
                      {selectedRequest.format === 'both' ? 'Tất cả (Online & Tại nhà)' : selectedRequest.format}
                    </span>
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div className="space-y-1 border-b pb-4">
                  <span className="text-xs text-muted-foreground block">Lời nhắn từ phụ huynh/học sinh</span>
                  <div className="bg-neutral-55 bg-neutral-50/50 border rounded-lg p-2.5 text-xs text-neutral-700 leading-relaxed whitespace-pre-line">
                    {selectedRequest.message}
                  </div>
                </div>
              )}

              {/* Edit section */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Trạng thái liên hệ *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ liên hệ</SelectItem>
                      <SelectItem value="contacted">Đã liên hệ tư vấn</SelectItem>
                      <SelectItem value="cancelled">Đã hủy / Sai thông tin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Ghi chú nội bộ của Admin</Label>
                  <Textarea
                    placeholder="Điền kết quả cuộc gọi, lịch hẹn tư vấn tiếp theo..."
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDetailsOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu lại'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xóa yêu cầu tư vấn?</DialogTitle>
            <DialogDescription>
              Hành động này sẽ xóa vĩnh viễn dữ liệu đăng ký của phụ huynh/học sinh khỏi trang quản lý.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Hủy</Button>
            <Button type="button" variant="destructive" disabled={isPending} onClick={handleDelete}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xác nhận Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
