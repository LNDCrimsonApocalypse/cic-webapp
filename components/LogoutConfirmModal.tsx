'use client'

import { useEffect } from 'react'

interface LogoutConfirmModalProps {
  open: boolean
  isLoggingOut?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function LogoutConfirmModal({
  open,
  isLoggingOut = false,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  // Escape closes the modal (disabled while the sign-out request is in flight).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoggingOut) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isLoggingOut, onCancel])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => {
        if (!isLoggingOut) onCancel()
      }}
    >
      <div
        className="w-full max-w-md rounded-xl border-2 border-[#FFD700] bg-[#001A41] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="logout-confirm-title"
          className="font-marcellus text-[22px] text-[#FFD700]"
        >
          Confirm Logout
        </h2>

        <p className="mt-3 mb-8 font-metropolis text-sm leading-relaxed text-white">
          Are you sure you want to securely log out? You will need to sign in again
          to access the dashboard.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="rounded-lg border border-white bg-transparent px-5 py-2 font-metropolis text-sm text-white transition-colors hover:text-[#FFD700] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className={[
              'rounded-lg border-2 border-red-500 bg-red-500 px-5 py-2',
              'font-metropolis text-sm font-bold text-white',
              'transition-colors duration-150',
              'hover:bg-red-600 hover:border-red-600',
              'disabled:cursor-not-allowed disabled:opacity-60',
              'inline-flex items-center justify-center gap-2',
            ].join(' ')}
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
                Logging out…
              </>
            ) : (
              'Log Out'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
