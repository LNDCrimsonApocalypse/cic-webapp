'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format, addBusinessDays } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { REQUEST_TYPES } from '@/lib/constants'
import UserPageHeader from '@/components/user/UserPageHeader'

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-metropolis">
        {label}
      </p>
      <p className="text-sm text-gray-700 font-metropolis mt-0.5 break-words">
        {value || '—'}
      </p>
    </div>
  )
}

interface SubmissionDetail {
  id: string
  type: string
  name: string
  email: string
  phone: string
  department: string
  details: string
  status: string
  priority?: string | null
  deadline?: string | null
  created_at: string
}

export default function RequestDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const { user } = useAuth()
  const router = useRouter()
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user || !supabaseClient || !id) return
      const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (!error && data) setSubmission(data as SubmissionDetail)
      setLoading(false)
    }
    load()
  }, [id, user])

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400 font-metropolis">Loading...</div>
    )
  if (!submission)
    return (
      <div className="p-8 text-center text-gray-400 font-metropolis">
        Request not found.
      </div>
    )

  const getTypeLabel = (typeId: string) =>
    REQUEST_TYPES.find((t) => t.id === typeId)?.label || typeId

  interface ParsedDetails {
    // Corporate Requisites
    corporateRequisiteType?: string
    eventName?: string
    eventDate?: string
    quantity?: string
    draftCitation?: string
    // Social Media
    socialMediaTypes?: string[]
    keyInformation?: string
    postingDate?: string
    postingTime?: string
    attachments?: string[]
  }

  // Parse details safely
  let parsedDetails: ParsedDetails = {}
  try {
    parsedDetails = JSON.parse(submission.details) as ParsedDetails
  } catch {}

  // Extract a human-readable filename from a Supabase public URL.
  const filenameFromUrl = (url: string): string => {
    try {
      const pathname = new URL(url).pathname
      const last = pathname.split('/').filter(Boolean).pop() || 'attachment'
      const decoded = decodeURIComponent(last)
      // Strip the "<timestamp>-" prefix we add on upload.
      return decoded.replace(/^\d+-/, '')
    } catch {
      return url
    }
  }

  const isSocialMedia = submission.type === 'social-media'
  const attachments = parsedDetails.attachments ?? []

  // Progress tracker — 4 steps. The DB stores 'Pending', 'In Progress', 'Completed';
  // 'Submitted' is inferred (always done once the record exists).
  const steps = [
    {
      label: 'Submitted',
      desc: 'Your request was received by the CIC system.',
      icon: '✓',
    },
    {
      label: 'Pending',
      desc: 'A CIC staff member is reviewing your request.',
      icon: '⏳',
    },
    {
      label: 'In Progress',
      desc: 'CIC is actively working on your request.',
      icon: '🔧',
    },
    {
      label: 'Completed',
      desc: 'Request fulfilled and closed.',
      icon: '🎉',
    },
  ]

  // Map DB status → index of the currently-active visual step.
  const dbStatusToStepIndex: Record<string, number> = {
    Pending: 1,
    'In Progress': 2,
    Completed: 3,
  }
  const currentIndex = dbStatusToStepIndex[submission.status] ?? 0

  type StepState = 'done' | 'active' | 'inactive'
  const getStepState = (stepIndex: number): StepState => {
    if (stepIndex < currentIndex) return 'done'
    if (stepIndex === currentIndex) return 'active'
    return 'inactive'
  }

  const submittedDate = new Date(submission.created_at)
  const estimatedDate = addBusinessDays(submittedDate, 5)

  return (
    <div className="min-h-screen">
      <UserPageHeader
        title="Request Details"
        subtitle="View your submission and track its progress."
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-5">
        {/* BACK LINK */}
        <button
          onClick={() => router.push('/usermyrequests')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-metropolis font-semibold text-umak-blue bg-white border border-gray-200 hover:bg-umak-blue hover:text-white hover:border-umak-blue transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to My Requests
        </button>

        {/* ① HEADER CARD */}
        <div className="bg-umak-blue rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-white/50 font-metropolis uppercase tracking-widest mb-1">
              Service Request
            </p>
            <h2 className="font-marcellus text-2xl text-white">
              {getTypeLabel(submission.type)}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-metropolis uppercase tracking-wide
              ${
                submission.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : submission.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              ● {submission.status}
            </span>
          </div>
        </div>

        {/* ② PROGRESS TRACKER */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-umak-yellow/20 border-b border-gray-200 flex items-center gap-2">
            <span className="block w-1 h-4 bg-umak-blue rounded-full"></span>
            <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
              Request Progress
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col">
            {steps.map((step, index) => {
              const state = getStepState(index)
              const isLast = index === steps.length - 1
              const nextState = !isLast ? getStepState(index + 1) : null

              const circleClasses =
                state === 'done'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : state === 'active'
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-gray-100 border-gray-200 text-gray-400'

              const connectorClass =
                state === 'done' && nextState !== 'inactive'
                  ? 'bg-emerald-400'
                  : 'bg-gray-200'

              return (
                <div key={step.label} className="flex gap-4">
                  {/* Left rail: circle + connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold border-2 ${circleClasses}`}
                    >
                      {state === 'done' ? '✓' : step.icon}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-1 ${connectorClass}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-7'} pt-1.5`}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold font-metropolis ${
                          state === 'inactive' ? 'text-gray-400' : 'text-umak-blue'
                        }`}
                      >
                        {step.label}
                      </span>
                      {state === 'active' && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Current
                        </span>
                      )}
                      {state === 'done' && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                          Done
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-metropolis mt-1 leading-relaxed ${
                        state === 'inactive' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {step.desc}
                    </p>

                    {/* Meta line below description */}
                    {state === 'done' && index === 0 && (
                      <p className="text-xs text-gray-400 font-metropolis mt-1.5 inline-flex items-center gap-1.5">
                        📅 {format(submittedDate, 'MMM d, yyyy · h:mm a')}
                      </p>
                    )}
                    {state === 'active' && index > 0 && (
                      <p className="text-xs text-amber-600/80 font-metropolis mt-1.5 inline-flex items-center gap-1.5">
                        🕐 Started {format(new Date(), 'MMM d, yyyy')}
                      </p>
                    )}
                    {state === 'inactive' && (
                      <p className="text-xs text-gray-400 font-metropolis mt-1.5">
                        Waiting to start
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

            {/* ETA Banner */}
            {submission.status !== 'Completed' && (
              <div className="mt-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-metropolis">
                🕐{' '}
                <span>
                  Estimated completion: <strong>3–5 working days</strong> from submission ·{' '}
                  {format(submittedDate, 'MMM d')} → ~{format(estimatedDate, 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ③ TWO COLUMN: REQUEST DETAILS + REQUESTOR INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Request Details */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-umak-yellow/20 border-b border-gray-200 flex items-center gap-2">
              <span className="block w-1 h-4 bg-umak-blue rounded-full"></span>
              <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
                Request Details
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {submission.type === 'design' ? (
                <>
                  <DetailRow label="Service Type" value={getTypeLabel(submission.type)} />
                  {parsedDetails.corporateRequisiteType && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-metropolis">
                        Requisite Type
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium font-metropolis">
                        🏆 {parsedDetails.corporateRequisiteType}
                      </span>
                    </div>
                  )}
                  <DetailRow label="Event Name" value={parsedDetails.eventName} />
                  <DetailRow
                    label="Event Date"
                    value={
                      parsedDetails.eventDate
                        ? format(new Date(parsedDetails.eventDate), 'MMMM d, yyyy')
                        : undefined
                    }
                  />
                  <DetailRow
                    label="Quantity"
                    value={parsedDetails.quantity ? `${parsedDetails.quantity} pieces` : undefined}
                  />
                </>
              ) : isSocialMedia ? (
                <>
                  <DetailRow label="Service Type" value={getTypeLabel(submission.type)} />

                  {parsedDetails.socialMediaTypes &&
                    parsedDetails.socialMediaTypes.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-metropolis">
                          Type of Social Media Request
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {parsedDetails.socialMediaTypes.map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-medium font-metropolis"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <DetailRow
                    label="Date of Posting"
                    value={
                      parsedDetails.postingDate
                        ? format(new Date(parsedDetails.postingDate), 'MMMM d, yyyy')
                        : undefined
                    }
                  />
                  <DetailRow
                    label="Time of Posting"
                    value={parsedDetails.postingTime}
                  />
                </>
              ) : (
                <>
                  <DetailRow label="Service Type" value={getTypeLabel(submission.type)} />
                  {submission.deadline && (
                    <DetailRow
                      label="Target Deadline"
                      value={format(new Date(submission.deadline), 'MMMM d, yyyy')}
                    />
                  )}
                  <DetailRow label="Description" value={submission.details} />
                </>
              )}

            </div>
          </div>

          {/* Requestor Information */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-umak-yellow/20 border-b border-gray-200 flex items-center gap-2">
              <span className="block w-1 h-4 bg-umak-blue rounded-full"></span>
              <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
                Requestor Information
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <DetailRow label="Full Name" value={submission.name} />
              <DetailRow label="Email Address" value={submission.email} />
              <DetailRow label="Contact Number" value={submission.phone} />
              <DetailRow label="Office / College" value={submission.department} />
              <DetailRow
                label="Date Submitted"
                value={format(submittedDate, 'MMMM d, yyyy')}
              />
            </div>
          </div>
        </div>

        {/* Draft Citation — full width, only for Corporate Requisites with a real citation */}
        {submission.type === 'design' &&
          parsedDetails.draftCitation &&
          parsedDetails.draftCitation.trim().toUpperCase() !== 'N/A' && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <span className="block w-1 h-4 bg-umak-blue rounded-full"></span>
                <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
                  Draft Citation
                </span>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                  <p className="italic text-gray-600 text-sm font-metropolis leading-relaxed">
                    &ldquo;{parsedDetails.draftCitation}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Key Information — full width for Social Media submissions */}
        {isSocialMedia && parsedDetails.keyInformation && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-umak-yellow/20 border-b border-gray-200 flex items-center gap-2">
              <span className="block w-1 h-4 bg-umak-blue rounded-full"></span>
              <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
                Key Information for Post Content
              </span>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                <p className="text-gray-700 text-sm font-metropolis leading-relaxed whitespace-pre-wrap">
                  {parsedDetails.keyInformation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Attachments — always rendered for Social Media submissions */}
        {isSocialMedia && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 bg-umak-yellow/20 border-b border-gray-200 flex items-center gap-2">
              <span className="block w-1 h-4 bg-umak-blue rounded-full"></span>
              <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
                Attachments{attachments.length > 0 ? ` (${attachments.length})` : ''}
              </span>
            </div>
            <div className="p-6">
              {attachments.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg px-5 py-6 text-center">
                  <p className="text-sm text-gray-500 font-metropolis">
                    No files were attached to this request.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {attachments.map((url, i) => {
                    const name = filenameFromUrl(url)
                    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(name)
                    return (
                      <li key={`${url}-${i}`}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:border-umak-blue hover:bg-blue-50/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span
                              aria-hidden="true"
                              className="w-9 h-9 rounded-lg bg-umak-blue/10 flex items-center justify-center flex-shrink-0 text-umak-blue text-xs font-bold font-metropolis"
                            >
                              {isImage ? 'IMG' : 'PDF'}
                            </span>
                            <span className="text-sm font-metropolis text-gray-700 truncate group-hover:text-umak-blue">
                              {name}
                            </span>
                          </div>
                          <span className="text-xs font-metropolis font-semibold text-umak-blue flex-shrink-0 group-hover:underline">
                            View →
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ④ ACTION ROW */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => router.push('/usermyrequests')}
            className="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-500 font-metropolis hover:border-umak-blue hover:text-umak-blue transition-all"
          >
            ← Back to My Requests
          </button>
          <span className="text-xs text-gray-400 font-metropolis hidden sm:block">
            For concerns, contact CIC directly
          </span>
          {submission.status === 'Pending' && (
            <button className="px-5 py-2.5 border-2 border-red-200 rounded-lg text-sm font-semibold text-red-500 bg-red-50 font-metropolis hover:bg-red-100 transition-all">
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
