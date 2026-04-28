'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme, type Theme } from '@/contexts/ThemeContext'

export default function ThemePrompt() {
  const { needsThemeChoice, setTheme, dismissPrompt } = useTheme()

  if (!needsThemeChoice) return null

  const choose = (next: Theme) => {
    setTheme(next)
    dismissPrompt()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-prompt-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border-2 border-[#FFD700] bg-[#001A41] p-8 shadow-2xl">
        <h2
          id="theme-prompt-title"
          className="font-marcellus text-[22px] text-[#FFD700]"
        >
          Welcome
        </h2>
        <p className="mt-2 mb-6 font-metropolis text-sm leading-relaxed text-white">
          Which theme would you prefer? You can change this anytime from the top
          of the page.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => choose('light')}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-white/20 bg-white px-4 py-5 transition-colors hover:border-[#FFD700]"
          >
            <Sun size={26} className="text-amber-500" />
            <span className="font-metropolis text-sm font-bold text-[#001A41]">
              Light
            </span>
            <span className="font-metropolis text-[11px] text-gray-500 text-center leading-snug">
              Bright, white cards
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose('dark')}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-white/20 bg-[#020727] px-4 py-5 transition-colors hover:border-[#FFD700]"
          >
            <Moon size={26} className="text-[#FFD700]" />
            <span className="font-metropolis text-sm font-bold text-white">
              Dark
            </span>
            <span className="font-metropolis text-[11px] text-white/60 text-center leading-snug">
              Glass cards on navy
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={dismissPrompt}
          className="mt-5 w-full rounded-lg border border-white/30 px-4 py-2 font-metropolis text-xs text-white/70 transition-colors hover:text-[#FFD700]"
        >
          Decide later
        </button>
      </div>
    </div>
  )
}
