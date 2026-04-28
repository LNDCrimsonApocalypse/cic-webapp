'use client'

import Link from 'next/link'
import { Menu, Search, Bell } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'
import ThemeToggle from '@/components/ThemeToggle'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header
      className={[
        'sticky top-0 z-40 transition-colors duration-300',
        'bg-white shadow-sm border-b-4 border-umak-yellow',
        'dark:bg-umak-blue/80 dark:backdrop-blur-md dark:shadow-none dark:border-b-4 dark:border-umak-yellow',
      ].join(' ')}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-umak-blue dark:text-white" />
        </button>

        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-marcellus text-umak-blue dark:text-white tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 dark:text-white/70 mt-1 font-metropolis text-xs sm:text-sm font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search (decorative for now) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-400 dark:text-white/40 w-48 cursor-text">
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-metropolis">Search submissions...</span>
            </div>

            {/* Notification bell */}
            <button
              className="relative p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-gray-500 dark:text-white/70" />
              <span
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-umak-blue"
                aria-hidden="true"
              />
            </button>

            <ThemeToggle />

            {/* View public site */}
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors whitespace-nowrap font-metropolis"
            >
              View public site ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
