'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  body: string
  date: string
  read?: boolean
}

interface NotificationBellProps {
  /**
   * Optional list of notifications. When undefined we render an empty-state
   * placeholder; the caller can wire this up to real data later without
   * changing the bell's visual treatment.
   */
  notifications?: NotificationItem[]
}

export default function NotificationBell({
  notifications = [],
}: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className={[
          'relative flex h-9 w-9 items-center justify-center rounded-full',
          'transition-colors duration-150',
          // Navy on light surfaces, white in dark mode. Gold on hover/open in either mode.
          'text-umak-blue hover:text-umak-yellow',
          'dark:text-white dark:hover:text-umak-yellow',
          open ? 'text-umak-yellow dark:text-umak-yellow' : '',
        ].join(' ')}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-umak-blue"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#0b1438] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-marcellus text-sm text-umak-blue dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-umak-blue dark:text-umak-yellow font-semibold font-metropolis">
                {unreadCount} new
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-metropolis text-gray-500 dark:text-white/60">
                You&apos;re all caught up.
              </p>
              <p className="text-xs font-metropolis text-gray-400 dark:text-white/40 mt-1">
                Status changes on your requests will show up here.
              </p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-white/10">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 flex gap-3 ${
                    n.read ? '' : 'bg-blue-50/60 dark:bg-white/5'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-umak-blue dark:text-white font-metropolis truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/60 font-metropolis line-clamp-2 mt-0.5">
                      {n.body}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-white/40 font-metropolis flex-shrink-0">
                    {n.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
