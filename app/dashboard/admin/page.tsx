import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateClassForm, RequestReviewForm } from './create-class-form'
import { CreateMaterialForm } from './create-material-form'
import { MaterialLibraryManager } from './material-library-manager'
import { CreateTutorForm } from './create-tutor-form'
import { getAdminClassData } from './classes-data'
import { getAdminMaterialData } from './materials-data'
import { getAdminFeedbackItems } from './document-feedback-data'
import { DocumentFeedbackManager } from './document-feedback-manager'
import { listTutors } from './data'

function resultValue<T>(result: PromiseSettledResult<T>, fallback: T) { return result.status === 'fulfilled' ? result.value : fallback }
function resultError(result: PromiseSettledResult<unknown>, label: string) { return result.status === 'fulfilled' ? null : `${label}: ${result.reason instanceof Error ? result.reason.message : 'Unable to load data'}` }

export default async function AdminDashboardPage() {
  const [tutorsResult, classDataResult, materialDataResult, feedbackResult] = await Promise.allSettled([listTutors(), getAdminClassData(), getAdminMaterialData(), getAdminFeedbackItems()])
  const tutors = resultValue(tutorsResult, [])
  const classData = resultValue(classDataResult, {subjects:[], tutors:[], classes:[], requests:[]})
  const materialData = resultValue(materialDataResult, {subjects:[], items:[]})
  const feedbackItems = resultValue(feedbackResult, [])
  const loadErrors = [resultError(tutorsResult, 'Tutors'), resultError(classDataResult, 'Classes'), resultError(materialDataResult, 'Materials'), resultError(feedbackResult, 'Document feedback')].filter(Boolean)
  return <main className="container mx-auto space-y-8 px-6 py-12">
    {loadErrors.length>0&&<Card className="border-destructive"><CardHeader><CardTitle>Some admin data could not load</CardTitle></CardHeader><CardContent className="space-y-1 text-sm text-destructive">{loadErrors.map(e=><p key={e}>{e}</p>)}</CardContent></Card>}

    <Card className="border-sky-500/20 bg-sky-50/10 dark:bg-sky-950/5">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sky-600 dark:text-sky-400">Email notification settings</CardTitle>
            <CardDescription>Manage Admin recipient emails for operational notifications.</CardDescription>
          </div>
          <Link className="text-sm font-medium text-sky-600 dark:text-sky-400 underline-offset-4 hover:underline" href="/dashboard/admin/settings">
            Open settings ?
          </Link>
        </div>
      </CardHeader>
    </Card>

    <Card className="border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/5">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-emerald-600 dark:text-emerald-400">Quản lý Tài chính & Lương Gia sư</CardTitle>
            <CardDescription>
              Theo dõi học phí phụ huynh, tự động tính và chuyển khoản lương gia sư (95% học phí) qua ảnh QR tĩnh tiện lợi.
            </CardDescription>
          </div>
          <Link className="text-sm font-medium text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline" href="/dashboard/admin/finance">
            Mở Quản lý Tài chính →
          </Link>
        </div>
      </CardHeader>
    </Card>

    <Card className="border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/5">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-indigo-600 dark:text-indigo-400">Quản lý Báo cáo Tiến độ Học sinh</CardTitle>
            <CardDescription>
              Theo dõi các phiếu đánh giá kết quả học tập định kỳ, điểm số chuyên cần, thái độ học tập và ý kiến từ Gia sư.
            </CardDescription>
          </div>
          <Link className="text-sm font-medium text-indigo-600 dark:text-indigo-400 underline-offset-4 hover:underline" href="/dashboard/admin/reports">
            Mở Quản lý Báo cáo →
          </Link>
        </div>
      </CardHeader>
    </Card>

    <Card className="border-teal-500/20 bg-teal-50/10 dark:bg-teal-950/5">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-teal-600 dark:text-teal-400">Lịch học & Xếp lớp (Google Calendar style)</CardTitle>
            <CardDescription>
              Xem và xếp lịch học lặp lại hàng tuần cho lớp, dời buổi học đơn lẻ hoặc xem tổng quan thời khóa biểu các gia sư.
            </CardDescription>
          </div>
          <Link className="text-sm font-medium text-teal-600 dark:text-teal-400 underline-offset-4 hover:underline" href="/dashboard/admin/calendar">
            Mở Lịch học & Xếp lớp →
          </Link>
        </div>
      </CardHeader>
    </Card>

    <Card className="border-amber-500/20 bg-amber-50/10 dark:bg-amber-950/5">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-amber-600 dark:text-amber-400">Yêu cầu Tư vấn tuyển sinh (Landing Page)</CardTitle>
            <CardDescription>
              Xem danh sách thông tin phụ huynh/học sinh đăng ký tư vấn trực tuyến từ trang chủ, cập nhật trạng thái cuộc gọi và ghi chú nội bộ.
            </CardDescription>
          </div>
          <Link className="text-sm font-medium text-amber-600 dark:text-amber-400 underline-offset-4 hover:underline" href="/dashboard/admin/consultants">
            Mở Yêu cầu Tư vấn →
          </Link>
        </div>
      </CardHeader>
    </Card>

    <Card><CardHeader><div className="flex items-center justify-between gap-3"><div><CardTitle>Phản hồi tài liệu & học liệu</CardTitle><CardDescription>Yêu cầu tài liệu và báo cáo sự cố từ gia sư. Đánh dấu Đã xử lý hoặc Từ chối kèm lý do.</CardDescription></div><Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href="/dashboard/admin/document-feedback">Xem toàn bộ trang</Link></div></CardHeader><CardContent><DocumentFeedbackManager items={feedbackItems.slice(0,5)} /></CardContent></Card>
    <Card><CardHeader><CardTitle>Thư viện tài liệu giảng dạy</CardTitle><CardDescription>Tải lên tệp tài liệu đã được trung tâm phê duyệt vào Cloudflare R2 riêng tư cho Gia sư.</CardDescription></CardHeader><CardContent><CreateMaterialForm /></CardContent></Card>
    <Card><CardHeader><CardTitle>Danh sách tài liệu trong thư viện</CardTitle><CardDescription>Chỉnh sửa, ẩn/hiện, xóa và lọc các tệp tài liệu giảng dạy đã tải lên.</CardDescription></CardHeader><CardContent><MaterialLibraryManager items={materialData.items} /></CardContent></Card>
    <Card><CardHeader><CardTitle>Tạo lớp học mới</CardTitle><CardDescription>Admin tạo lớp học mới, thông tin liên hệ phụ huynh, học phí, trạng thái phân công và lịch học.</CardDescription></CardHeader><CardContent><CreateClassForm subjects={classData.subjects} tutors={classData.tutors}/></CardContent></Card>
    <Card><CardHeader><CardTitle>Yêu cầu nhận lớp từ Gia sư</CardTitle><CardDescription>Phê duyệt hoặc từ chối yêu cầu đăng ký dạy các lớp học đang mở của Gia sư.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Lớp học</TableHead><TableHead>Gia sư</TableHead><TableHead>Lời nhắn</TableHead><TableHead>Hành động</TableHead></TableRow></TableHeader><TableBody>{classData.requests.length===0?<TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Không có yêu cầu nào đang chờ duyệt.</TableCell></TableRow>:classData.requests.map(r=><TableRow key={r.id}><TableCell>{r.classLabel}</TableCell><TableCell>{r.tutorName}</TableCell><TableCell>{r.message||'-'}</TableCell><TableCell><RequestReviewForm request={r}/></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    <Card><CardHeader><CardTitle>Danh sách lớp học</CardTitle><CardDescription>Tất cả các lớp học, trạng thái phân công gia sư, ghi chú lịch học và học phí.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Học sinh</TableHead><TableHead>Môn học</TableHead><TableHead>Gia sư</TableHead><TableHead>Trạng thái</TableHead><TableHead>Phụ huynh</TableHead><TableHead>Học phí</TableHead><TableHead>Lịch học</TableHead><TableHead>Hành động</TableHead></TableRow></TableHeader><TableBody>{classData.classes.length===0?<TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Chưa có lớp học nào.</TableCell></TableRow>:classData.classes.map(c=><TableRow key={c.id}><TableCell className="font-medium">{c.studentName}{c.studentGrade?` (${c.studentGrade})`:''}</TableCell><TableCell>{c.subjectName||'-'}</TableCell><TableCell>{c.tutorName||'Đang mở'}</TableCell><TableCell><Badge variant={c.status==='open'?'secondary':'default'}>{c.status === 'open' ? 'Đang mở' : c.status === 'assigned' ? 'Đã giao' : c.status === 'paused' ? 'Tạm dừng' : c.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}</Badge></TableCell><TableCell>{c.parentName||'-'}{c.parentPhone?` / ${c.parentPhone}`:''}</TableCell><TableCell>{c.tuitionFee??'-'}</TableCell><TableCell>{c.scheduleNotes||'-'}</TableCell><TableCell><Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/admin/classes/${c.id}`}>Xem / Sửa</Link></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    <Card className="mx-auto w-full max-w-3xl"><CardHeader><CardTitle>Tạo tài khoản Gia sư mới</CardTitle><CardDescription>Tạo tài khoản đăng nhập và hồ sơ giảng dạy nội bộ cho gia sư mới.</CardDescription></CardHeader><CardContent><CreateTutorForm /></CardContent></Card>
    <Card><CardHeader><div className="flex items-center justify-between gap-3"><div><CardTitle>Danh sách Gia sư</CardTitle><CardDescription>Xem và quản lý tài khoản gia sư, trạng thái hoạt động và môn học đảm nhận.</CardDescription></div><Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href="/dashboard/admin/tutors">Quản lý Gia sư →</Link></div></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Họ và tên</TableHead><TableHead>Trạng thái</TableHead><TableHead>Môn học</TableHead><TableHead>Số điện thoại</TableHead><TableHead>Hành động</TableHead></TableRow></TableHeader><TableBody>{tutors.length===0?<TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Chưa có gia sư nào.</TableCell></TableRow>:tutors.map(t=><TableRow key={t.tutorId}><TableCell className="font-medium">{t.fullName}</TableCell><TableCell><Badge variant={t.profileActive&&t.tutorActive?'default':'secondary'}>{t.profileActive&&t.tutorActive?'Hoạt động':'Tạm khóa'}</Badge></TableCell><TableCell>{t.subjects||'-'}</TableCell><TableCell>{t.phone||'-'}</TableCell><TableCell><Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/admin/tutors/${t.tutorId}`}>Xem / Sửa</Link></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
  </main>
}

