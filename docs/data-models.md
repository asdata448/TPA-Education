# Data Models

## Active Application Data Models

The application currently uses active Supabase-backed data models for:
- authentication / authorization
- Tutor operational management

## Supabase Auth Model

Primary identity is managed by Supabase Auth in `auth.users`.

Relevant fields used by the app:
- `id`
- `email`
- `encrypted_password`
- session metadata managed by Supabase

## Profiles Table

Created by:

```text
supabase/migrations/20260608000001_create_profiles.sql
```

### Columns
- `id uuid primary key references auth.users(id) on delete cascade`
- `role text not null check (role in ('admin', 'tutor'))`
- `full_name text not null`
- `active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Purpose
- link each authenticated user to an application role
- support server-side authorization in login action and middleware
- support Admin/Tutor workflows

## Tutors Table

Created by:

```text
supabase/migrations/20260609000001_create_tutors.sql
supabase/migrations/20260609000002_add_tutor_subjects.sql
```

### Columns
- `id uuid primary key default gen_random_uuid()`
- `profile_id uuid not null unique references public.profiles(id) on delete cascade`
- `phone text`
- `subjects text`
- `specialties text`
- `notes text`
- `active boolean not null default true`
- `bank_name text` -- Tên ngân hàng nhận thanh toán (ví dụ: Vietcombank)
- `bank_account_no text` -- Số tài khoản ngân hàng
- `bank_account_name text` -- Tên chủ tài khoản ngân hàng
- `bank_qr_key text` -- Key lưu ảnh mã QR tĩnh của gia sư trên Cloudflare R2
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Purpose
- store Tutor operational profile data separately from auth identity
- support Admin Tutor creation/editing
- store Tutor payment details (bank account details and static QR code key)
- support future Tutor assignment workflows

## Class Payments Table

Created by:

```text
supabase/migrations/20260610000003_add_payment_system.sql
```

### Columns
- `id uuid primary key default gen_random_uuid()`
- `class_id uuid not null references public.classes(id) on delete cascade`
- `billing_month varchar(7) not null` -- Chu kỳ thanh toán định dạng YYYY-MM
- `tuition_fee numeric(12,2) not null` -- Học phí thực thu
- `tuition_status text not null default 'unpaid' check (tuition_status in ('unpaid', 'paid'))` -- Trạng thái đóng học phí
- `tuition_paid_at timestamptz` -- Thời gian thu học phí
- `tutor_payment_status text not null default 'unpaid' check (tutor_payment_status in ('unpaid', 'paid'))` -- Trạng thái thanh toán lương gia sư (95% học phí)
- `tutor_paid_at timestamptz` -- Thời gian thanh toán lương gia sư
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

- theo dõi chu kỳ học phí của học sinh/phụ huynh theo tháng
- tính toán tự động và chuyển lương cho Gia sư dựa trên học phí thực thu
- hạn chế việc chuyển lương trước khi phụ huynh hoàn tất đóng tiền


## Class Progress Reports Table

Created by:

```text
supabase/migrations/20260610000004_create_progress_reports.sql
```

### Columns
- `id uuid primary key default gen_random_uuid()`
- `class_id uuid not null references public.classes(id) on delete cascade`
- `reporting_month varchar(7) not null` -- Chu kỳ báo cáo (YYYY-MM)
- `lessons_completed integer not null default 0` -- Số buổi học thực tế trong tháng
- `rating_comprehension integer not null` -- Đánh giá mức độ tiếp thu (1-5 sao)
- `rating_homework integer not null` -- Đánh giá tự giác làm bài tập (1-5 sao)
- `rating_attendance integer not null` -- Đánh giá chuyên cần (1-5 sao)
- `rating_attitude integer not null` -- Đánh giá thái độ học (1-5 sao)
- `teacher_comments text not null` -- Nhận xét chi tiết của gia sư
- `next_month_plan text` -- Định hướng/lộ trình học tiếp theo
- `tuition_fee numeric(12,2) not null` -- Học phí ghi nhận (lấy tại thời điểm xuất báo cáo)
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Purpose
- lưu trữ phiếu báo cáo đánh giá học tập hàng tháng của học viên do Gia sư lập
- cung cấp giao diện/đường dẫn xem báo cáo công khai (Anonymous Read) để gửi trực tiếp cho Phụ huynh qua Zalo/Messenger
- hiển thị thông tin học phí kèm ảnh mã QR thanh toán của Trung tâm (qrtrungtam.png)


## Class Sessions Table

Created by:

```text
supabase/migrations/20260610000006_create_class_sessions.sql
```

### Columns
- `id uuid primary key default gen_random_uuid()`
- `class_id uuid not null references public.classes(id) on delete cascade`
- `session_date date not null` -- Ngày diễn ra buổi học
- `start_time time not null` -- Giờ bắt đầu
- `end_time time not null` -- Giờ kết thúc
- `status text not null default 'scheduled' check (status in ('scheduled', 'attended', 'absent', 'cancelled'))` -- Trạng thái (chờ học, đã học, báo nghỉ, hủy buổi)
- `tutor_comments text` -- Nhận xét nhanh về học sinh của Gia sư
- `attendance_checked_at timestamptz` -- Thời điểm điểm danh
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Purpose
- Lưu chi tiết từng buổi học cụ thể được sinh ra tự động từ thời khóa biểu cố định
- Hỗ trợ điểm danh và lưu nhận xét nhanh của Gia sư trực tiếp
- Hỗ trợ tính năng dời lịch học riêng lẻ (chỉ dời một buổi duy nhất mà không ảnh hưởng lịch lặp lại)


## Class Schedules Table

Created by:

```text
supabase/migrations/20260609000007_create_classes_schedules_requests.sql
```

### Columns
- `id uuid primary key default gen_random_uuid()`
- `class_id uuid not null references public.classes(id) on delete cascade`
- `weekday smallint not null check (weekday between 0 and 6)` -- Thứ trong tuần (0: Chủ Nhật, 1: Thứ Hai, ..., 6: Thứ Bảy)
- `start_time time not null`
- `end_time time not null`
- `notes text`
- `created_at timestamptz not null default now()`

### Purpose
- Quản lý các khung giờ học cố định lặp lại hàng tuần của từng lớp học
- Làm dữ liệu nguồn để tự động sinh ra danh sách các buổi học thực tế (`class_sessions`) trong 30 ngày tiếp theo


## Authorization Model

Supported roles:
- `admin`
- `tutor`

Behavior:
- Admin users land on `/dashboard/admin`
- Tutor users land on `/dashboard/tutor`
- Tutor access to `/dashboard/admin/*` is blocked and redirected
- inactive Tutor users are blocked from Tutor dashboard access

## Removed Models

Removed by:

```text
supabase/migrations/20260609000006_remove_students_parents.sql
```

Removed tables:
- `students`
- `parents`
- `student_parents`

Reason:
- Student/Parent data is no longer treated as independent Admin CRUD in the current product slice
- that information will instead be entered later as part of class/schedule management

## Static Content Structures

The landing page still uses `lib/data.ts` for static marketing content such as:
- tutor records
- subject definitions
- FAQ entries
- consultation process steps
- commitment cards


## Schedule Proposal Scope

Schedule proposal workflow is removed from current scope. Tutors self-coordinate schedule changes directly with parents outside the app, so no Tutor proposal or Admin approval workflow should be built for Epic 7.


## Cloudflare R2 Material Library Scope

Epic 8 is replanned away from Cloudflare R2. Teaching materials will be stored in a private Cloudflare R2 bucket, while Postgres stores item/file metadata and the app enforces authorized access for Admin/Tutor roles. Presigned URLs or Worker/server-mediated access are both valid implementation paths; MVP should prefer simpler app-controlled access first.
