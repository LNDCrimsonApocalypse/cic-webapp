// =============================================================================
// TYPE DEFINITIONS (Centralized Types)
// =============================================================================

export interface RequestType {
  id: string
  label: string
  description: string
  number: string
  subtypes: string[]
  bgColor: string
}

export type CorporateRequisiteType =
  | 'Medals'
  | 'Plaques'
  | 'Standardized Corporate Giveaways'
  | 'Trophies'

export type SocialMediaRequestType =
  | 'Content Posting on Social Media'
  | 'Sharing of Post from CCO’s Facebook Page'
  | 'CCO Facebook Page Creation'
  | 'Cover Photo Design'

export interface FormData {
  // Requestor info (all services)
  name: string
  email: string
  phone: string
  department: string // stores the selected Office / College / Institute

  // Generic request fields (used by services without a custom form)
  requestDetails: string
  deadline: string

  // Corporate Requisites fields (only filled when that service is selected)
  corporateRequisiteType?: CorporateRequisiteType | ''
  eventName?: string
  eventDate?: string
  quantity?: string
  draftCitation?: string

  // Social Media fields (only filled when that service is selected)
  socialMediaTypes?: SocialMediaRequestType[]
  keyInformation?: string
  postingDate?: string
  postingTimeHour?: string
  postingTimeMinute?: string
  postingTimeAmPm?: 'AM' | 'PM' | ''
}

export type FormErrors = Partial<Record<keyof FormData, string>>

export interface SubmissionData extends FormData {
  requestType: string
  submittedAt: string
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected'
}
