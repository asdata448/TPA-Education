'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ShieldAlert, LogIn, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js application error caught by boundary:', error)
  }, [error])

  const isUnauthorized =
    error.message?.includes('Unauthorized') ||
    error.message?.includes('auth') ||
    error.message?.includes('not logged in')

  return (
    <main className="min-h-screen bg-[#F8F5EC] flex flex-col items-center justify-center p-4">
      {/* Background Ornaments */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#0F2A44]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-[#E5E7EB] text-center space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {isUnauthorized ? (
          // Session Expired / Unauthorized Screen
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-[#D8B76A]">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-black text-[#0F2A44] tracking-tight">Phiên làm việc hết hạn</h1>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Hoặc không có quyền truy cập</p>
            </div>

            <p className="text-sm text-neutral-500 leading-relaxed">
              Bạn chưa đăng nhập, phiên đăng nhập đã hết hạn hoặc tài khoản không có quyền xem trang này. Vui lòng đăng nhập lại để tiếp tục.
            </p>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#0F2A44] hover:bg-[#1a3d5f] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4" /> Đăng nhập ngay
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-white hover:bg-neutral-50 text-[#0F2A44] text-xs font-bold rounded-xl border border-neutral-300 shadow-sm transition-all cursor-pointer"
              >
                <Home className="h-4 w-4" /> Quay về Trang chủ
              </Link>
            </div>
          </>
        ) : (
          // General App Error Screen
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-black text-[#0F2A44] tracking-tight">Đã xảy ra lỗi hệ thống</h1>
              <p className="text-xs text-red-500 uppercase font-bold tracking-widest mt-1">Lỗi không mong muốn</p>
            </div>

            <p className="text-sm text-neutral-500 leading-relaxed">
              Hệ thống gặp sự cố tải trang. Bạn có thể nhấn nút thử lại dưới đây hoặc quay về trang chủ.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => reset()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0F2A44] hover:bg-[#1a3d5f] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" /> Thử tải lại
              </button>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-50 text-[#0F2A44] text-xs font-bold rounded-xl border border-neutral-350 shadow-sm transition-all cursor-pointer"
              >
                <Home className="h-4 w-4" /> Về Trang chủ
              </Link>
            </div>
          </>
        )}

        {/* Footer info */}
        <div className="text-[10px] text-muted-foreground pt-4 border-t">
          Hotline kỹ thuật: 0899 736 669 • TPA+ Support
        </div>
      </div>
    </main>
  )
}
