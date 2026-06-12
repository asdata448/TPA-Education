'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const ROUTE_MAP: Record<string, string> = {
  'tutor': 'Gia sư',
  'classes': 'Lớp của tôi',
  'calendar': 'Lịch dạy',
  'reports': 'Báo cáo tiến độ',
  'change-password': 'Đổi mật khẩu',
  'bank-settings': 'Cài đặt ngân hàng',
  'library': 'Thư viện tài liệu',
  'open-classes': 'Lớp học mới tuyển',
  'document-feedback': 'Ý kiến tài liệu',
}

export function TutorNavHeader() {
  const pathname = usePathname()
  const router = useRouter()

  if (!pathname) return null

  // Split path, remove empty strings
  const segments = pathname.split('/').filter(Boolean)
  
  // Find index of 'tutor' to start breadcrumbs from tutor dashboard root
  const tutorIdx = segments.indexOf('tutor')
  const relativeSegments = tutorIdx !== -1 ? segments.slice(tutorIdx) : segments

  // Is main dashboard page
  const isDashboardRoot = relativeSegments.length <= 1

  return (
    <div className="flex flex-col gap-2 mb-4 md:mb-6 print:hidden">
      {/* Top row: Back button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Back Button (only show if not on dashboard root) */}
        {!isDashboardRoot && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 rounded-full border bg-white text-[#0F2A44] hover:bg-[#0F2A44]/5 hover:text-[#0F2A44] hover:scale-105 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center text-[11px] font-medium text-muted-foreground/80 md:text-xs">
          <ol className="inline-flex items-center space-x-1 md:space-x-1.5">
            <li className="inline-flex items-center">
              <Link
                href="/dashboard/tutor"
                className="inline-flex items-center gap-1 hover:text-[#0F2A44] transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
            </li>
            
            {relativeSegments.slice(1).map((segment, idx) => {
              // Construct full path for this breadcrumb
              const fullSegmentPath = '/' + segments.slice(0, segments.indexOf(segment) + 1).join('/')
              const isLast = idx === relativeSegments.length - 2
              const displayName = ROUTE_MAP[segment] || (segment.length > 20 ? 'Chi tiết' : segment)

              return (
                <li key={segment} className="inline-flex items-center">
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40 mx-0.5 md:mx-1" />
                  {isLast ? (
                    <span className="text-[#0F2A44] font-semibold">{displayName}</span>
                  ) : (
                    <Link
                      href={fullSegmentPath}
                      className="hover:text-[#0F2A44] transition-colors truncate max-w-[120px] md:max-w-none"
                    >
                      {displayName}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}
