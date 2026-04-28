'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (next: Theme) => void
  toggleTheme: () => void
  // True only on the very first visit (before the user has picked a preference)
  // and only on dashboard routes — used to drive the first-visit prompt modal.
  needsThemeChoice: boolean
  dismissPrompt: () => void
}

const STORAGE_KEY = 'cic-theme-preference'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  // Start with the default to avoid hydration mismatch; the real preference is
  // applied in the post-mount effect below.
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [needsThemeChoice, setNeedsThemeChoice] = useState(false)

  useEffect(() => {
    const stored = getStoredTheme()
    if (stored) {
      setThemeState(stored)
      applyThemeClass(stored)
      return
    }
    // No preference stored yet → flag the first-visit prompt and respect the
    // OS preference as a sensible default while the user decides.
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial: Theme = prefersDark ? 'dark' : 'light'
    setThemeState(initial)
    applyThemeClass(initial)
    setNeedsThemeChoice(true)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyThemeClass(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const dismissPrompt = useCallback(() => {
    setNeedsThemeChoice(false)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, needsThemeChoice, dismissPrompt }),
    [theme, setTheme, toggleTheme, needsThemeChoice, dismissPrompt],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
