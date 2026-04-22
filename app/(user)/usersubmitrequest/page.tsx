'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SERVICES, findService } from '@/lib/services'
import UserPageHeader from '@/components/user/UserPageHeader'
import UserServiceTypeCard from '@/components/user/UserServiceTypeCard'
import BeforeProceedModal, {
  BEFORE_PROCEED_SERVICE_TYPES,
} from '@/components/BeforeProceedModal'

export default function UserSubmitRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handledRef = useRef(false)
  const [modalServiceType, setModalServiceType] = useState<string | null>(null)

  const navigateToForm = (serviceType: string) => {
    router.push(`/usersubmitrequest/${serviceType}`)
  }

  const handleSelect = (serviceType: string) => {
    if (BEFORE_PROCEED_SERVICE_TYPES.has(serviceType)) {
      setModalServiceType(serviceType)
      return
    }
    navigateToForm(serviceType)
  }

  const handleProceed = () => {
    if (!modalServiceType) return
    const target = modalServiceType
    setModalServiceType(null)
    navigateToForm(target)
  }

  const handleGoBack = () => {
    setModalServiceType(null)
  }

  useEffect(() => {
    if (handledRef.current) return
    const type = searchParams.get('type')
    if (type && findService(type)) {
      handledRef.current = true
      handleSelect(type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <UserPageHeader
        title="Submit a New Request"
        subtitle="Choose the type of service you need from the options below."
        hideBottomBorder
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {SERVICES.map((service) => (
            <UserServiceTypeCard
              key={service.serviceType}
              service={service}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      <BeforeProceedModal
        serviceType={modalServiceType}
        onProceed={handleProceed}
        onCancel={handleGoBack}
      />
    </div>
  )
}
