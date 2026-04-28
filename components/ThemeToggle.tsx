'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className={[
        'relative inline-flex h-9 w-[78px] items-center rounded-full',
        'transition-colors duration-200 shadow-sm',
        isDark
          ? 'bg-[#020727] border-2 border-[#FFD700]/40'
          : 'bg-[#001A41] border-2 border-[#001A41]',
      ].join(' ')}
    >
      {/* Left-side label icon (Sun) */}
      <span
        aria-hidden="true"
        className={[
          'flex h-9 w-1/2 items-center justify-center text-xs',
          isDark ? 'text-white/40' : 'text-[#FFD700]',
        ].join(' ')}
      >
        <Sun size={15} />
      </span>
      {/* Right-side label icon (Moon) */}
      <span
        aria-hidden="true"
        className={[
          'flex h-9 w-1/2 items-center justify-center text-xs',
          isDark ? 'text-[#FFD700]' : 'text-white/50',
        ].join(' ')}
      >
        <Moon size={15} />
      </span>
      {/* Sliding circle indicator (sits on top of the active side) */}
      <span
        aria-hidden="true"
        className={[
          'absolute top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full',
          'transition-all duration-200 shadow-md',
          'bg-white text-[#001A41]',
          isDark ? 'right-1' : 'left-1',
        ].join(' ')}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  )
}
