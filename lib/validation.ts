import { z } from 'zod'

// =============================================================================
// VALIDATION SCHEMAS (Zod)
// =============================================================================

// Shared requestor fields used by every service form.
const requestorSchema = {
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z
    .string()
    .email('Invalid email address')
    .endsWith('@umak.edu.ph', 'Must be a UMak email address'),
  phone: z.string().regex(/^(09|\+639)\d{9}$/, 'Invalid Philippine phone number'),
  department: z.string().min(1, 'Please select an office, college, or institute'),
}

// Generic request schema (services that still use the free-form fields).
export const requestFormSchema = z.object({
  ...requestorSchema,
  requestDetails: z
    .string()
    .min(50, 'Please provide at least 50 characters of detail')
    .max(1000, 'Description is too long'),
  deadline: z.string().min(1, 'Deadline is required'),
})

// Corporate Requisites (design) service-specific schema.
export const corporateRequisitesSchema = z.object({
  ...requestorSchema,
  corporateRequisiteType: z.enum(
    ['Medals', 'Plaques', 'Standardized Corporate Giveaways', 'Trophies'],
    { message: 'Please select the type of corporate requisite' },
  ),
  eventName: z.string().min(2, 'Event name is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  quantity: z
    .string()
    .regex(/^\d+$/, 'Quantity must be a number')
    .refine((v) => Number(v) > 0, 'Quantity must be greater than 0'),
  draftCitation: z
    .string()
    .min(1, 'Please enter the draft citation, or type N/A if not applicable'),
})

// Social Media service-specific schema.
export const socialMediaSchema = z.object({
  ...requestorSchema,
  socialMediaTypes: z
    .array(
      z.enum([
        'Content Posting on Social Media',
        'Sharing of Post from CCO’s Facebook Page',
        'CCO Facebook Page Creation',
        'Cover Photo Design',
      ]),
    )
    .min(1, 'Select at least one type of social media request'),
  keyInformation: z
    .string()
    .min(10, 'Please provide key information for the post content')
    .max(2000, 'Too long'),
  postingDate: z.string().min(1, 'Posting date is required'),
  postingTimeHour: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/, 'Hour must be between 1 and 12'),
  postingTimeMinute: z
    .string()
    .regex(/^([0-5]?[0-9])$/, 'Minute must be between 00 and 59'),
  postingTimeAmPm: z.enum(['AM', 'PM'], {
    message: 'Select AM or PM',
  }),
})

export type ValidatedFormData = z.infer<typeof requestFormSchema>
export type ValidatedCorporateRequisites = z.infer<typeof corporateRequisitesSchema>
export type ValidatedSocialMedia = z.infer<typeof socialMediaSchema>
