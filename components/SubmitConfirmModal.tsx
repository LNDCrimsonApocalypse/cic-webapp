'use client'

import { useEffect } from 'react'

interface SubmitConfirmModalProps {
  open: boolean
  isSubmitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const BULLETS = [
  'We process all service and event booking requests on a first-come, first-served basis, subject to availability on the CIC Calendar. Please submit your form at least one week in advance of your event.',
  'To ensure your request is processed smoothly, your office must provide all complete requirements at the time of submission. Requests with incomplete details will be put on hold until all necessary information is provided.',
  'The estimated turnaround time is based on your initial request. Please note that any further revisions or changes may cause delays in the delivery of materials.',
  'By submitting this request form, you agree and provide all the information requested and the terms and conditions provided.',
]

export default function SubmitConfirmModal({
  open,
  isSubmitting,
  onConfirm,
  onCancel,
}: SubmitConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isSubmitting, onCancel])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => {
        if (!isSubmitting) onCancel()
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl border-2 border-[#FFD700] bg-[#001A41] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="submit-confirm-title"
          className="mb-5 font-marcellus text-[22px] text-[#FFD700]"
        >
          Please read carefully:
        </h2>

        <ul className="mb-8 space-y-4">
          {BULLETS.map((bullet, idx) => (
            <li
              key={idx}
              className="flex gap-3 font-metropolis text-sm leading-relaxed text-white"
            >
              <span aria-hidden="true" className="mt-1 text-[#FFD700]">
                •
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-white bg-transparent px-5 py-2 font-metropolis text-sm text-white transition-colors hover:text-[#FFD700] disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={[
              'rounded-lg border-2 border-[#FFD700] bg-[#FFD700] px-5 py-2',
              'font-metropolis text-sm font-bold text-[#001A41]',
              'transition-colors duration-150',
              'hover:bg-transparent hover:text-[#FFD700]',
              'active:bg-transparent active:text-[#FFD700]',
              'disabled:cursor-not-allowed disabled:opacity-60',
              'inline-flex items-center justify-center gap-2',
            ].join(' ')}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
