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
import { TUTOR_COLORS, type TutorColorKey } from './tutor-theme'
import {
  Home,
  BookOpen,
  FolderOpen,
  CalendarDays,
  FileText,
  FolderArchive,
  Wallet,
  KeyRound,
  MessageSquare,
} from 'lucide-react'

const menuGroups = [
  {
    label: '',
    items: [
      { label: 'Trang tổng quan', href: '/dashboard/tutor', icon: Home, colorKey: 'amber' as TutorColorKey },
    ],
  },
  {
    label: 'Dạy học',
    items: [
      { label: 'Lớp của tôi', href: '/dashboard/tutor/classes', icon: BookOpen, colorKey: 'blue' as TutorColorKey },
      { label: 'Lớp mở', href: '/dashboard/tutor/open-classes', icon: FolderOpen, colorKey: 'teal' as TutorColorKey },
      { label: 'Lịch & Điểm danh', href: '/dashboard/tutor/calendar', icon: CalendarDays, colorKey: 'emerald' as TutorColorKey },
      { label: 'Báo cáo học tập', href: '/dashboard/tutor/reports', icon: FileText, colorKey: 'violet' as TutorColorKey },
    ],
  },
  {
    label: 'Tài nguyên',
    items: [
      { label: 'Thư viện tài liệu', href: '/dashboard/tutor/library', icon: FolderArchive, colorKey: 'orange' as TutorColorKey },
      { label: 'Yêu cầu & Phản hồi', href: '/dashboard/tutor/document-feedback', icon: MessageSquare, colorKey: 'pink' as TutorColorKey },
    ],
  },
  {
    label: 'Tài khoản',
    items: [
      { label: 'Thông tin thanh toán', href: '/dashboard/tutor/bank-settings', icon: Wallet, colorKey: 'rose' as TutorColorKey },
      { label: 'Đổi mật khẩu', href: '/dashboard/tutor/change-password', icon: KeyRound, colorKey: 'indigo' as TutorColorKey },
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
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const c = TUTOR_COLORS[item.colorKey]
                  const isActive = item.href === '/dashboard/tutor'
                    ? pathname === '/dashboard/tutor'
                    : pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} className={isActive ? c.activeClass : ''}>
                        <Link href={item.href}>
                          <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : c.text}`} />
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
