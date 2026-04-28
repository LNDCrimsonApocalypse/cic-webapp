'use client'

import { Menu } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import NotificationBell from '@/components/NotificationBell'

interface UserPageHeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  hideBottomBorder?: boolean
}

export default function UserPageHeader({
  title,
  subtitle,
  onMenuClick,
  hideBottomBorder = false,
}: UserPageHeaderProps) {
  return (
    <header
      className={[
        'sticky top-0 z-30 transition-colors duration-300',
        // Light: white surface with yellow underline.
        // Dark: navy glass surface with subtle white divider.
        'bg-white shadow-sm border-b-4 border-umak-yellow',
        'dark:bg-umak-blue/80 dark:backdrop-blur-md dark:shadow-none dark:border-b-4 dark:border-umak-yellow',
        hideBottomBorder ? 'border-b border-gray-100 dark:border-white/10' : '',
      ].join(' ')}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-umak-blue dark:text-white" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-marcellus text-umak-blue dark:text-white truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-white/70 mt-1 font-metropolis text-xs sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
