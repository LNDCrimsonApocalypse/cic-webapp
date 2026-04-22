// Shared helpers for rendering submission rows consistently on the dashboard's
// Recent Submissions section and the /usermyrequests list page.

import { findService } from '@/lib/services'

export interface ServiceAccent {
  bar: string
  tileBg: string
  tileIcon: string
}

export const SERVICE_ACCENTS: Record<string, ServiceAccent> = {
  design: { bar: '#F59E0B', tileBg: 'rgba(245, 158, 11, 0.14)', tileIcon: '#D97706' },
  branding: { bar: '#A855F7', tileBg: 'rgba(168, 85, 247, 0.14)', tileIcon: '#9333EA' },
  coverage: { bar: '#3B82F6', tileBg: 'rgba(59, 130, 246, 0.14)', tileIcon: '#2563EB' },
  video: { bar: '#EF4444', tileBg: 'rgba(239, 68, 68, 0.14)', tileIcon: '#DC2626' },
  'social-media': {
    bar: '#EC4899',
    tileBg: 'rgba(236, 72, 153, 0.14)',
    tileIcon: '#DB2777',
  },
  website: { bar: '#14B8A6', tileBg: 'rgba(20, 184, 166, 0.14)', tileIcon: '#0D9488' },
}

export const FALLBACK_ACCENT: ServiceAccent = {
  bar: '#64748B',
  tileBg: 'rgba(100, 116, 139, 0.14)',
  tileIcon: '#475569',
}

export function getAccent(serviceType: string): ServiceAccent {
  return SERVICE_ACCENTS[serviceType] || FALLBACK_ACCENT
}

interface DesignDetails {
  corporateRequisiteType?: string
  eventName?: string
  eventDate?: string
  quantity?: string
  draftCitation?: string
}

function parseDesignDetails(details: string): DesignDetails | null {
  try {
    return JSON.parse(details) as DesignDetails
  } catch {
    return null
  }
}

export function formatSubmissionDetails(serviceType: string, details: string): string {
  if (serviceType === 'design') {
    const parsed = parseDesignDetails(details || '')
    if (parsed) {
      const parts: string[] = []
      if (parsed.corporateRequisiteType) parts.push(parsed.corporateRequisiteType)
      if (parsed.eventName) parts.push(`Event: ${parsed.eventName}`)
      if (parsed.quantity) parts.push(`Qty: ${parsed.quantity}`)
      if (parsed.draftCitation && parsed.draftCitation.trim().toUpperCase() !== 'N/A') {
        parts.push(`Draft Citation: ${parsed.draftCitation}`)
      }
      return parts.join(' · ')
    }
  }
  return details || ''
}

export function getSubmissionTag(serviceType: string, details: string): string {
  if (serviceType === 'design') {
    const parsed = parseDesignDetails(details || '')
    if (parsed?.corporateRequisiteType) return parsed.corporateRequisiteType
  }
  const service = findService(serviceType)
  return service?.tags[0] || ''
}
