'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { FormData, FormErrors, SocialMediaRequestType } from '@/lib/types'
import {
  requestFormSchema,
  corporateRequisitesSchema,
  socialMediaSchema,
} from '@/lib/validation'
import { INITIAL_FORM_DATA } from '@/lib/constants'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getDisplayName } from '@/lib/get-display-name'

const ATTACHMENTS_BUCKET = 'request-attachments'

export function useRequestForm() {
  const { user, profile } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  // Auto-populate name + email from the logged-in user once auth resolves.
  useEffect(() => {
    if (!user) return
    const displayName = getDisplayName(user, profile)
    setFormData((prev) => ({
      ...prev,
      name: prev.name || displayName,
      email: prev.email || user.email || '',
    }))
  }, [user, profile])

  const getSchemaForType = (typeId: string) => {
    if (typeId === 'design') return corporateRequisitesSchema
    if (typeId === 'social-media') return socialMediaSchema
    return requestFormSchema
  }

  const validateField = (name: keyof FormData, value: string): void => {
    const schema = getSchemaForType(selectedType)
    const fieldSchema = (schema.shape as Record<string, z.ZodType | undefined>)[name]
    if (!fieldSchema) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
      return
    }
    try {
      fieldSchema.parse(value)
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.issues[0].message }))
      }
    }
  }

  const handleTypeSelect = (typeId: string): void => {
    setSelectedType(typeId)
    setStep(2)
  }

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  // Toggle membership in the `socialMediaTypes` array (used by the checkbox group).
  const handleToggleSocialMediaType = (type: SocialMediaRequestType): void => {
    setFormData((prev) => {
      const current = prev.socialMediaTypes ?? []
      const next = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
      return { ...prev, socialMediaTypes: next }
    })
    setErrors((prev) => ({ ...prev, socialMediaTypes: undefined }))
  }

  const addAttachedFiles = (files: File[]): void => {
    if (files.length === 0) return
    setAttachedFiles((prev) => [...prev, ...files])
  }

  const removeAttachedFile = (index: number): void => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Upload a list of files to the request-attachments bucket and return their
  // public URLs (in the same order). Skips the upload round-trip entirely if
  // the list is empty or Supabase isn't configured.
  const uploadAttachments = async (
    files: File[],
    userId: string,
  ): Promise<string[]> => {
    if (!supabaseClient || files.length === 0) return []
    const urls: string[] = []
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${userId}/${Date.now()}-${safeName}`
      const { error: uploadError } = await supabaseClient.storage
        .from(ATTACHMENTS_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || undefined,
        })
      if (uploadError) {
        throw new Error(
          `Failed to upload "${file.name}": ${uploadError.message}`,
        )
      }
      const { data: publicUrlData } = supabaseClient.storage
        .from(ATTACHMENTS_BUCKET)
        .getPublicUrl(path)
      urls.push(publicUrlData.publicUrl)
    }
    return urls
  }

  const handleCancel = (): void => {
    setStep(1)
    setSelectedType('')
    setErrors({})
  }

  const resetForm = (): void => {
    setStep(1)
    setSelectedType('')
    setFormData({
      ...INITIAL_FORM_DATA,
      name: user ? getDisplayName(user, profile) : '',
      email: user?.email || '',
    })
    setErrors({})
    setAttachedFiles([])
  }

  // Build the Supabase row payload based on selected service type.
  // `extra` carries any runtime-computed values (e.g., uploaded attachment URLs)
  // that aren't part of the Zod-validated form data.
  const buildSubmissionPayload = (
    validated: Record<string, unknown>,
    extra: { attachmentUrls?: string[] } = {},
  ) => {
    const base = {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      department: validated.department,
      type: selectedType,
      status: 'Pending',
      user_id: user?.id ?? null,
    }

    if (selectedType === 'design') {
      return {
        ...base,
        // Stash the service-specific fields in `details` as a structured blob
        // so we don't need a schema migration. Admin view can parse as JSON.
        details: JSON.stringify({
          corporateRequisiteType: validated.corporateRequisiteType,
          eventName: validated.eventName,
          eventDate: validated.eventDate,
          quantity: validated.quantity,
          draftCitation: validated.draftCitation,
        }),
        deadline: validated.eventDate,
        // Priority is no longer user-facing; write a default so the (non-nullable)
        // DB column stays happy without a schema migration.
        priority: 'Medium',
      }
    }

    if (selectedType === 'social-media') {
      return {
        ...base,
        details: JSON.stringify({
          socialMediaTypes: validated.socialMediaTypes,
          keyInformation: validated.keyInformation,
          postingDate: validated.postingDate,
          postingTime: `${validated.postingTimeHour}:${String(
            validated.postingTimeMinute,
          ).padStart(2, '0')} ${validated.postingTimeAmPm}`,
          attachments: extra.attachmentUrls ?? [],
        }),
        deadline: validated.postingDate,
        priority: 'Medium',
      }
    }

    return {
      ...base,
      details: validated.requestDetails,
      deadline: validated.deadline,
      priority: 'Medium',
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')
    setSubmissionError('')

    try {
      const schema = getSchemaForType(selectedType)
      const validatedData = schema.parse(formData) as Record<string, unknown>

      // Guard: we need an authenticated user to stamp user_id on the row so the
      // dashboards (which filter by user_id) can show it back to them. If the
      // session isn't loaded yet, fail loudly instead of writing a null user_id.
      if (!user?.id) {
        throw new Error(
          'You are not signed in. Please refresh the page and try again.',
        )
      }

      if (supabaseClient) {
        // Upload any attached files first so we can persist their public URLs
        // into the row's `details` JSON alongside the form data.
        const attachmentUrls =
          selectedType === 'social-media'
            ? await uploadAttachments(attachedFiles, user.id)
            : []

        const payload = buildSubmissionPayload(validatedData, {
          attachmentUrls,
        })
        const { data, error: submitError } = await supabaseClient
          .from('submissions')
          .insert(payload)
          .select()

        if (submitError) throw submitError
        // eslint-disable-next-line no-console
        console.log('[useRequestForm] submission inserted:', data)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      setSuccessMessage(
        'Request submitted successfully! Our team will review and contact you within 24-48 hours.',
      )
      resetForm()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        // eslint-disable-next-line no-console
        console.error('[useRequestForm] submission failed:', error)
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? String((error as { message: unknown }).message)
              : 'Submission failed. Please try again.'
        setSubmissionError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    selectedType,
    formData,
    errors,
    isSubmitting,
    attachedFiles,
    addAttachedFiles,
    removeAttachedFile,
    handleTypeSelect,
    handleInputChange,
    handleToggleSocialMediaType,
    handleCancel,
    handleSubmit,
    successMessage,
    submissionError,
    clearSubmissionError: () => setSubmissionError(''),
    clearSuccessMessage: () => setSuccessMessage(''),
  }
}
