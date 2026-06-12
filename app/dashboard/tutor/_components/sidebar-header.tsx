'use client'

import Link from 'next/link'

export function SidebarHeaderBranding() {
  return (
    <Link href="/dashboard/tutor" className="flex items-center gap-2 px-2 py-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F2A44] text-[#D8B76A] font-extrabold text-sm">
        T+
      </div>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-bold text-[#0F2A44] dark:text-[#F8F5EC]">TPA+ Gia sư</span>
        <span className="text-xs text-muted-foreground">Trung tâm gia sư</span>
      </div>
    </Link>
  )
}
