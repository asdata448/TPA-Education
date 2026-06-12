'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wallet, KeyRound, LogOut, ChevronsUpDown } from 'lucide-react'

export function SidebarFooterAvatar({ fullName }: { fullName: string }) {
  const router = useRouter()
  const initials = fullName
    .split(' ')
    .map(w => w[0])
    .slice(-2)
    .join('')
    .toUpperCase() || 'GS'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#0F2A44] text-[#D8B76A] text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate max-w-[120px]">{fullName}</span>
            <span className="text-xs text-muted-foreground">Tài khoản</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/tutor/bank-settings" className="cursor-pointer">
            <Wallet className="mr-2 h-4 w-4" />
            Thông tin thanh toán
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/tutor/change-password" className="cursor-pointer">
            <KeyRound className="mr-2 h-4 w-4" />
            Đổi mật khẩu
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
