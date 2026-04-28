'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Clock, Loader2, CheckCircle2, type LucideIcon } from 'lucide-react'

interface Stats {
  total: number
  pending: number
  inProgress: number
  completed: number
}

interface UserDashboardStatsProps {
  stats: Stats
  loading?: boolean
}

interface Card {
  label: string
  value: number
  icon: LucideIcon
  sublabel: string
  filter: string | null
  accentColor: string
}

export default function UserDashboardStats({ stats, loading = false }: UserDashboardStatsProps) {
  const router = useRouter()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const cards: Card[] = [
    {
      label: 'My Requests',
      value: stats.total,
      icon: FileText,
      sublabel: 'All submissions',
      filter: null,
      accentColor: '#A78BFA',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      sublabel: 'Awaiting review',
      filter: 'Pending',
      accentColor: '#FB923C',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      sublabel: 'Being worked on',
      filter: 'In Progress',
      accentColor: '#38BDF8',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      sublabel: 'Done',
      filter: 'Completed',
      accentColor: '#4ADE80',
    },
  ]

  const handleClick = (filter: string | null) => {
    const query = filter ? `?status=${encodeURIComponent(filter)}` : ''
    router.push(`/usermyrequests${query}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-r-xl p-6 animate-pulse h-[168px] bg-white dark:bg-umak-blue border-l-8 border-gray-200 dark:border-white/10 shadow-md"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        const isHovered = hoveredIdx === idx
        return (
          <button
            key={card.label}
            onClick={() => handleClick(card.filter)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setHoveredIdx(idx)}
            onBlur={() => setHoveredIdx(null)}
            className="group bg-white dark:bg-umak-blue rounded-l-none rounded-r-xl p-6 text-left hover:-translate-y-1 transition-all duration-200 cursor-pointer block ring-1 ring-gray-100 dark:ring-0"
            style={{
              borderLeft: `8px solid ${card.accentColor}`,
              boxShadow: isHovered
                ? `0 18px 40px -10px ${card.accentColor}80, 0 8px 20px -8px ${card.accentColor}55`
                : '0 6px 14px -8px rgba(0,0,0,0.18), 0 2px 4px -2px rgba(0,0,0,0.08)',
            }}
          >
            <Icon size={28} className="mb-4" style={{ color: card.accentColor }} />
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-metropolis mb-2">
              {card.label}
            </p>
            <p
              className="text-5xl font-marcellus leading-none mb-2"
              style={{ color: card.accentColor }}
            >
              {card.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-300 font-metropolis">
              {card.sublabel}
            </p>
          </button>
        )
      })}
    </div>
  )
}
