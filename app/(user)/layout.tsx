'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/user/UserSidebar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#020727] dark:via-[#060e33] dark:to-[#020727] transition-colors duration-300">
        <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="flex-1 transition-all duration-300 min-h-screen w-full overflow-x-hidden"
          style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
