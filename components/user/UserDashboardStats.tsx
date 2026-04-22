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
          <div key={c.label} className="bg-umak-blue rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-8 w-8 bg-umak-blue-50 rounded mb-4" />
            <div className="h-3 w-20 bg-umak-blue-50 rounded mb-3" />
            <div className="h-10 w-16 bg-umak-blue-50 rounded mb-2" />
            <div className="h-3 w-24 bg-umak-blue-50 rounded" />
          </div>
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
            className="group bg-umak-blue rounded-l-none rounded-r-xl p-6 text-left hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            style={{
              borderLeft: `8px solid ${card.accentColor}`,
              boxShadow: isHovered
                ? `0 18px 40px -10px ${card.accentColor}80, 0 8px 20px -8px ${card.accentColor}55`
                : '0 1px 2px 0 rgba(0,0,0,0.08)',
            }}
          >
            <Icon size={28} className="mb-4" style={{ color: card.accentColor }} />
            <p className="text-xs uppercase tracking-wider text-gray-300 font-metropolis mb-2">
              {card.label}
            </p>
            <p
              className="text-5xl font-marcellus leading-none mb-2"
              style={{ color: card.accentColor }}
            >
              {card.value}
            </p>
            <p className="text-xs text-gray-300 font-metropolis">{card.sublabel}</p>
          </button>
        )
      })}
    </div>
  )
}
