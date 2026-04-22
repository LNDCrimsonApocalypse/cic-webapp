'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

interface OptionGroup {
  label: string
  options: readonly string[]
}

interface SearchableSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  optionGroups: OptionGroup[]
  placeholder?: string
  required?: boolean
  error?: string
}

export default function SearchableSelect({
  label,
  value,
  onChange,
  optionGroups,
  placeholder = 'Search or select...',
  required = false,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  // Avoid SSR mismatch for the portal.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track the input's position so the portalled dropdown can follow it.
  useEffect(() => {
    if (!open || !inputWrapperRef.current) return
    const update = () => {
      const rect = inputWrapperRef.current!.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open])

  // Close on outside click (must also whitelist portal content).
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (portalRef.current?.contains(target)) return
      setOpen(false)
      setQuery('')
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return optionGroups
    const q = query.toLowerCase()
    return optionGroups
      .map((g) => ({
        label: g.label,
        options: g.options.filter((o) => o.toLowerCase().includes(q)),
      }))
      .filter((g) => g.options.length > 0)
  }, [optionGroups, query])

  const handleSelect = (option: string) => {
    onChange(option)
    setOpen(false)
    setQuery('')
  }

  // When open, show user's query; when closed, show committed value.
  const displayValue = open ? query : value

  const dropdown = open && mounted ? (
    <div
      ref={portalRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      className="mt-1 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-[1000]"
    >
      {filteredGroups.length === 0 ? (
        <p className="p-3 text-sm text-gray-500 font-metropolis">
          No matches for &ldquo;{query}&rdquo;
        </p>
      ) : (
        filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 border-b border-gray-100 font-metropolis sticky top-0">
              {group.label}
            </p>
            <ul>
              {group.options.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2 text-sm font-metropolis transition-colors ${
                      value === option
                        ? 'bg-blue-50 text-umak-blue font-semibold'
                        : 'text-gray-700 hover:bg-umak-blue hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  ) : null

  return (
    <div ref={containerRef} className="relative">
      <label className="flex items-center mb-1.5">
        <span className="text-sm text-gray-700 font-metropolis font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>

      <div ref={inputWrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={value ? '' : placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          className={`w-full pl-3 pr-10 py-2.5 bg-white border ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-md focus:border-umak-blue focus:ring-2 focus:ring-umak-blue/20 focus:outline-none transition-all font-metropolis text-sm`}
        />
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o)
            inputRef.current?.focus()
          }}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          aria-label="Toggle dropdown"
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {dropdown && createPortal(dropdown, document.body)}

      {error && <p className="text-red-500 text-xs mt-1 font-metropolis">{error}</p>}
    </div>
  )
}
