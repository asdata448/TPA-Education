import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TutorSidebar } from './_components/tutor-sidebar'
import { getTutorProfile } from './classes-data'
import { TutorNavHeader } from './_components/tutor-nav-header'

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const profile = await getTutorProfile()

  return (
    <SidebarProvider>
      <TutorSidebar fullName={profile.fullName} />
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b bg-[#F8F5EC] px-4 dark:border-[#1a3a5c] dark:bg-[#0a1f33] md:hidden">
          <SidebarTrigger className="-ml-1" />
          <span className="text-sm font-semibold text-[#0F2A44] dark:text-[#F8F5EC]">TPA+ Gia sư</span>
        </header>
        <div className="flex-1 min-h-screen bg-[#F8F5EC] p-3 dark:bg-[#0a1f33] md:p-6">
          <TutorNavHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
