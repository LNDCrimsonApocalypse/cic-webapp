'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Search,
  Inbox,
  Calendar,
  ChevronRight,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { findService } from '@/lib/services'
import { getAccent, getSubmissionTag } from '@/lib/submission-display'
import UserPageHeader from '@/components/user/UserPageHeader'
import UserStatusBadge from '@/components/user/UserStatusBadge'

type StatusFilter = 'all' | 'Pending' | 'In Progress' | 'Completed'

interface SubmissionRow {
  id: string
  type: string
  details: string
  status: string
  priority?: string | null
  created_at: string
}

export default function UserMyRequestsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) || 'all',
  )

  useEffect(() => {
    async function load() {
      if (!user || !supabaseClient) {
        setLoading(false)
        return
      }
      const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!error) setSubmissions((data || []) as SubmissionRow[])
      setLoading(false)
    }
    load()
  }, [user])

  const filtered = submissions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (
      search &&
      !s.details?.toLowerCase().includes(search.toLowerCase()) &&
      !s.type?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen">
      <UserPageHeader title="My Requests" subtitle="View and track all your submissions." />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50"
              size={18}
            />
            <input
              type="text"
              placeholder="Search your requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg font-metropolis text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:border-umak-blue dark:focus:border-umak-yellow"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['all', 'Pending', 'In Progress', 'Completed'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-xs font-metropolis font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === s
                    ? 'bg-umak-blue text-white dark:bg-umak-yellow dark:text-umak-blue'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push('/usersubmitrequest')}
            className="px-4 py-2 bg-umak-yellow text-umak-blue font-metropolis font-bold rounded-lg hover:bg-yellow-400 transition-all whitespace-nowrap"
          >
            + New Request
          </button>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 rounded-xl shadow-sm p-12 text-center text-gray-500 dark:text-white/70 font-metropolis">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/10 rounded-xl shadow-sm p-12 text-center">
            <Inbox className="mx-auto text-gray-300 dark:text-white/40 mb-4" size={48} />
            <h3 className="font-marcellus text-xl text-gray-600 dark:text-white mb-2">
              No requests found
            </h3>
            <p className="font-metropolis text-sm text-gray-500 dark:text-white/70 mb-4">
              {submissions.length === 0
                ? "You haven't submitted any requests yet."
                : 'Try adjusting your filters.'}
            </p>
            {submissions.length === 0 && (
              <button
                onClick={() => router.push('/usersubmitrequest')}
                className="px-6 py-2 bg-umak-yellow text-umak-blue font-metropolis font-bold rounded-lg hover:bg-yellow-400"
              >
                Submit Your First Request
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((sub) => {
              const service = findService(sub.type)
              const accent = getAccent(sub.type)
              const Icon: LucideIcon = service?.icon || FileText
              const title = service?.title || sub.type
              const tag = getSubmissionTag(sub.type, sub.details)

              return (
                <div
                  key={sub.id}
                  onClick={() => router.push(`/usermyrequests/${sub.id}`)}
                  className="group bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-white dark:hover:backdrop-blur-none transition-all duration-200 overflow-hidden cursor-pointer"
                  style={{ borderLeft: `4px solid ${accent.bar}` }}
                >
                  <div className="p-4 sm:p-5 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: accent.tileBg }}
                      aria-hidden="true"
                    >
                      <Icon size={26} style={{ color: accent.tileIcon }} strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-metropolis font-bold text-umak-blue dark:text-white dark:group-hover:text-umak-blue text-base sm:text-lg mb-1 truncate transition-colors">
                        {title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-metropolis text-gray-500 dark:text-white/80 dark:group-hover:text-gray-500 transition-colors">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} />
                          Submitted {format(new Date(sub.created_at), 'MMM d, yyyy')}
                        </span>
                        {tag && (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium"
                            style={{ background: accent.tileBg, color: accent.tileIcon }}
                          >
                            {tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <UserStatusBadge status={sub.status} />
                      <ChevronRight size={18} className="text-gray-300 dark:text-white/40 dark:group-hover:text-gray-300 transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-white/60 font-metropolis text-center">
            Showing {filtered.length} of {submissions.length} requests
          </p>
        )}
      </div>
    </div>
  )
}
