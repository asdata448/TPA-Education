'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { SidebarHeaderBranding } from './sidebar-header'
import { SidebarFooterAvatar } from './sidebar-footer'
import {
  BookOpen,
  FolderOpen,
  CalendarDays,
  FileText,
  FolderArchive,
} from 'lucide-react'

const menuGroups = [
  {
    label: 'Dạy học',
    items: [
      { label: 'Lớp của tôi', href: '/dashboard/tutor/classes', icon: BookOpen },
      { label: 'Lớp mở', href: '/dashboard/tutor/open-classes', icon: FolderOpen },
      { label: 'Lịch & Điểm danh', href: '/dashboard/tutor/calendar', icon: CalendarDays },
      { label: 'Báo cáo học tập', href: '/dashboard/tutor/reports', icon: FileText },
    ],
  },
  {
    label: 'Tài nguyên',
    items: [
      { label: 'Tài liệu & Phản hồi', href: '/dashboard/tutor/library', icon: FolderArchive },
    ],
  },
]

export function TutorSidebar({ fullName }: { fullName: string }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader>
        <SidebarHeaderBranding />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarFooterAvatar fullName={fullName} />
      </SidebarFooter>
    </Sidebar>
  )
}
