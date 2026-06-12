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
  Home,
  BookOpen,
  FolderOpen,
  CalendarDays,
  FileText,
  FolderArchive,
  Wallet,
  KeyRound,
} from 'lucide-react'

const menuGroups = [
  {
    label: '',
    items: [
      { label: 'Trang tổng quan', href: '/dashboard/tutor', icon: Home, color: 'text-amber-600 dark:text-amber-400' },
    ],
  },
  {
    label: 'Dạy học',
    items: [
      { label: 'Lớp của tôi', href: '/dashboard/tutor/classes', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400' },
      { label: 'Lớp mở', href: '/dashboard/tutor/open-classes', icon: FolderOpen, color: 'text-teal-600 dark:text-teal-400' },
      { label: 'Lịch & Điểm danh', href: '/dashboard/tutor/calendar', icon: CalendarDays, color: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Báo cáo học tập', href: '/dashboard/tutor/reports', icon: FileText, color: 'text-violet-600 dark:text-violet-400' },
    ],
  },
  {
    label: 'Tài nguyên',
    items: [
      { label: 'Tài liệu & Phản hồi', href: '/dashboard/tutor/library', icon: FolderArchive, color: 'text-orange-600 dark:text-orange-400' },
    ],
  },
  {
    label: 'Tài khoản',
    items: [
      { label: 'Thông tin thanh toán', href: '/dashboard/tutor/bank-settings', icon: Wallet, color: 'text-rose-600 dark:text-rose-400' },
      { label: 'Đổi mật khẩu', href: '/dashboard/tutor/change-password', icon: KeyRound, color: 'text-indigo-600 dark:text-indigo-400' },
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
                  const isActive = item.href === '/dashboard/tutor'
                    ? pathname === '/dashboard/tutor'
                    : pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
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
