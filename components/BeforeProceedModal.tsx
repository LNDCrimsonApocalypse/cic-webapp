'use client'

import { useEffect } from 'react'

interface BeforeProceedModalProps {
  serviceType: string | null
  onProceed: () => void
  onCancel: () => void
}

const NOTE_ALL_IN_ONE =
  "Select Event Coverage for all-in-one support. This single request handles everything from start to finish, including poster design, so you don't have to fill out multiple forms."
const NOTE_CONFLICT =
  'Please note that due to limited resources, you cannot book Event Coverage and Footage Requests at the same time.'
const NOTE_LIVESTREAM =
  'Livestreaming requests are temporarily on hold while we update our guidelines. Please contact our office for more information.'

// Which service types should open this modal before routing to the form.
export const BEFORE_PROCEED_SERVICE_TYPES = new Set(['coverage', 'video'])

export default function BeforeProceedModal({
  serviceType,
  onProceed,
  onCancel,
}: BeforeProceedModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!serviceType) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [serviceType, onCancel])

  if (!serviceType) return null

  const isCoverage = serviceType === 'coverage'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="before-proceed-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-xl border-2 border-[#FFD700] bg-[#001A41] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="before-proceed-title"
          className="mb-5 font-marcellus text-[22px] text-[#FFD700]"
        >
          NOTE:
        </h2>

        <ul className="mb-8 space-y-4">
          {isCoverage && (
            <li className="flex gap-3 font-metropolis text-sm leading-relaxed text-white">
              <span aria-hidden="true" className="mt-1 text-[#FFD700]">
                •
              </span>
              <span>{NOTE_ALL_IN_ONE}</span>
            </li>
          )}

          <li className="flex gap-3 font-metropolis text-sm leading-relaxed text-white">
            <span aria-hidden="true" className="mt-1 text-[#FFD700]">
              •
            </span>
            <span>{NOTE_CONFLICT}</span>
          </li>

          {isCoverage && (
            <li className="flex gap-3 font-metropolis text-sm leading-relaxed text-white">
              <span aria-hidden="true" className="mt-1 text-[#FFD700]">
                •
              </span>
              <span>{NOTE_LIVESTREAM}</span>
            </li>
          )}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white bg-transparent px-5 py-2 font-metropolis text-sm text-white transition-colors hover:text-[#FFD700]"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onProceed}
            className={[
              'rounded-lg border-2 border-[#FFD700] bg-[#FFD700] px-5 py-2',
              'font-metropolis text-sm font-bold text-[#001A41]',
              'transition-colors duration-150',
              'hover:bg-transparent hover:text-[#FFD700]',
              'active:bg-transparent active:text-[#FFD700]',
            ].join(' ')}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}
