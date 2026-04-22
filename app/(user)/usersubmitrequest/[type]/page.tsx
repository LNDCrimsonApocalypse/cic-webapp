'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { findService } from '@/lib/services'
import { useRequestForm } from '@/hooks/useRequestForm'
import RequestForm from '@/components/RequestForm'
import UserPageHeader from '@/components/user/UserPageHeader'

export default function SubmitRequestFormPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = use(params)
  const router = useRouter()
  const service = findService(type)

  const {
    formData,
    errors,
    isSubmitting,
    handleTypeSelect,
    handleInputChange,
    handleSubmit,
    successMessage,
  } = useRequestForm()

  useEffect(() => {
    if (!service) {
      router.replace('/usersubmitrequest')
      return
    }
    handleTypeSelect(service.serviceType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  if (!service) return null

  const showSuccess = !!successMessage

  return (
    <div className="min-h-screen bg-[#F0F3F8]">
      <UserPageHeader title="Submit a New Request" hideBottomBorder />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => router.push('/usersubmitrequest')}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg text-sm font-metropolis font-semibold text-umak-blue bg-white border border-gray-200 hover:bg-umak-blue hover:text-white hover:border-umak-blue transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>

        <div className="mb-8">
          <div className="text-xs font-metropolis font-bold text-umak-blue uppercase tracking-widest mb-3">
            Request Form
          </div>
          <h2 className="text-3xl sm:text-4xl font-marcellus text-umak-blue mb-3 leading-snug">
            {service.title} Request
          </h2>
          <p className="text-gray-500 font-metropolis text-sm">
            Complete all required fields to submit your request.
          </p>
        </div>

        <RequestForm
          serviceType={service.serviceType}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/usersubmitrequest')}
        />
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl mx-auto mb-5">
              ✅
            </div>
            <h2 className="font-marcellus text-2xl text-umak-blue mb-2">
              Request Submitted!
            </h2>
            <p className="text-sm text-gray-500 font-metropolis mb-4">
              Your request has been successfully sent to CIC.
            </p>
            <p className="text-xs text-gray-400 font-metropolis mb-6">
              Expected processing time:{' '}
              <strong className="text-umak-blue">3–5 working days</strong>
            </p>
            <button
              onClick={() => router.push('/usermyrequests')}
              className="w-full py-3 bg-umak-blue text-umak-yellow rounded-lg font-bold font-metropolis text-sm hover:bg-blue-900 transition-all"
            >
              View My Requests →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
