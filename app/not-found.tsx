'use client'

import Link from 'next/link'
import { FileQuestion, ChevronLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F5EC] flex flex-col items-center justify-center p-4">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#D8B76A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#0F2A44]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-[#E5E7EB] text-center space-y-6 relative z-10">
        
        {/* Icon & Error Code */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#F8F5EC] rounded-full flex items-center justify-center mb-4 text-[#D8B76A]">
            <FileQuestion className="h-10 w-10" />
          </div>
          <h1 className="text-6xl font-black text-[#0F2A44]">404</h1>
          <p className="text-lg font-bold text-[#0F2A44] uppercase tracking-wider mt-1">Không tìm thấy trang</p>
        </div>

        {/* Message */}
        <p className="text-sm text-neutral-500 leading-relaxed">
          Đường dẫn bạn truy cập hiện không tồn tại hoặc đã bị thay đổi. Vui lòng kiểm tra lại liên kết hoặc quay về trang chủ.
        </p>

        {/* Quick Links */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0F2A44] hover:bg-[#1a3d5f] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" /> Quay về Trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-50 text-[#0F2A44] text-xs font-bold rounded-xl border border-neutral-350 shadow-sm transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> Quay lại trang trước
          </button>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-muted-foreground pt-4 border-t">
          Hotline hỗ trợ: 0899 736 669 • TPA+ Education
        </div>
      </div>
    </main>
  )
}
