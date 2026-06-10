'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 border border-border bg-white rounded-lg shadow-sm hover:bg-muted/30 transition-colors cursor-pointer"
    >
      <Printer className="h-4 w-4" /> Tải về PDF / In báo cáo
    </button>
  )
}
