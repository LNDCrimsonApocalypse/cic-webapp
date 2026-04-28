'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Inbox,
  Plus,
  Calendar,
  ChevronRight,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import { findService } from '@/lib/services'
import { getAccent, getSubmissionTag } from '@/lib/submission-display'
import UserStatusBadge from './UserStatusBadge'

interface Submission {
  id: string
  type: string
  details: string
  status: string
  created_at: string
}

interface UserRecentSubmissionsProps {
  submissions: Submission[]
  loading?: boolean
}

export default function UserRecentSubmissions({
  submissions,
  loading = false,
}: UserRecentSubmissionsProps) {
  const router = useRouter()

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-marcellus text-xl text-umak-blue dark:text-white">
          Recent Submissions
        </h2>
        <Link
          href="/usermyrequests"
          className="font-metropolis text-sm font-semibold text-umak-blue dark:text-white hover:text-umak-yellow dark:hover:text-umak-yellow transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5 animate-pulse flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-3 w-64 bg-gray-100 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-metropolis text-sm text-gray-600 mb-4">
            No submissions yet. Ready to submit your first request?
          </p>
          <button
            onClick={() => router.push('/usersubmitrequest')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-umak-yellow text-umak-blue font-metropolis font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus size={16} />
            Submit Request
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.slice(0, 5).map((sub) => {
            const service = findService(sub.type)
            const accent = getAccent(sub.type)
            const Icon: LucideIcon = service?.icon || FileText
            const title = service?.title || sub.type
            const tag = getSubmissionTag(sub.type, sub.details)

            return (
              <div
                key={sub.id}
                onClick={() => router.push('/usermyrequests')}
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
    </section>
  )
}
