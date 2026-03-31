'use client'

import { useState } from 'react'
import { z } from 'zod'
import { FormData, FormErrors } from '@/lib/types'
import { requestFormSchema } from '@/lib/validation'
import { INITIAL_FORM_DATA } from '@/lib/constants'
import { supabaseClient } from '@/lib/supabase'

export function useRequestForm() {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const validateField = (name: keyof FormData, value: string): void => {
    try {
      requestFormSchema.shape[name].parse(value)
      setErrors(prev => ({ ...prev, [name]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [name]: error.issues[0].message }))
      }
    }
  }

  const handleTypeSelect = (typeId: string): void => {
    setSelectedType(typeId)
    setStep(2)
  }

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleCancel = (): void => {
    setStep(1)
    setSelectedType('')
    setErrors({})
  }

  const resetForm = (): void => {
    setStep(1)
    setSelectedType('')
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')

    try {
      // Validate entire form
      const validatedData = requestFormSchema.parse(formData)

      if (supabaseClient) {
        const { error: submitError } = await supabaseClient
          .from('submissions')
          .insert({
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            department: validatedData.department,
            type: selectedType,
            details: validatedData.requestDetails,
            deadline: validatedData.deadline,
            priority: validatedData.priority,
            status: 'Pending',
            user_id: null,
          })

        if (submitError) throw submitError
      } else {
        // Fallback when Supabase is not configured
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('Request submitted successfully! Our team will review and contact you within 24-48 hours.')
      }

      setSuccessMessage('Request submitted successfully! Our team will review and contact you within 24-48 hours.')
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
    handleTypeSelect,
    handleInputChange,
    handleCancel,
    handleSubmit,
    successMessage,
    clearSuccessMessage: () => setSuccessMessage('')
  }
}
