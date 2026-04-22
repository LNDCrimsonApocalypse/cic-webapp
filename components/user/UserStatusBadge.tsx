'use client'

interface UserStatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Completed' | string
}

// Keep these in sync with UserDashboardStats accent colors.
const STATUS_STYLES: Record<string, { bg: string; accent: string }> = {
  Pending: { bg: 'rgba(251, 146, 60, 0.15)', accent: '#FB923C' },
  'In Progress': { bg: 'rgba(56, 189, 248, 0.15)', accent: '#38BDF8' },
  Completed: { bg: 'rgba(74, 222, 128, 0.15)', accent: '#4ADE80' },
}

const FALLBACK = { bg: 'rgba(100, 116, 139, 0.15)', accent: '#475569' }

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const style = STATUS_STYLES[status] || FALLBACK

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-metropolis font-semibold"
      style={{ background: style.bg, color: style.accent }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: style.accent }}
      />
      {status}
    </span>
  )
}
