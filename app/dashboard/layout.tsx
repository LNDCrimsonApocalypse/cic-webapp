'use client'

import Sidebar from '@/components/Sidebar'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#020727] dark:via-[#060e33] dark:to-[#020727] transition-colors duration-300">
      <Sidebar />
      <main 
        className="flex-1 transition-all duration-300 min-h-screen w-full"
        style={{
          marginLeft: isOpen ? '256px' : '80px'
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
