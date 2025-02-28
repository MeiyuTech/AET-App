'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FormData, FormStep } from './types'
import { submitAETApplication } from '../../utils/actions'

interface FormState {
  // Form data
  formData: Partial<FormData>
  // Current step
  currentStep: FormStep
  // Draft ID from Supabase
  draftId: string | null
  // Form status
  // When fullfilling the form, the status is always 'draft' or 'submitted'
  // Other statuses are set by the backend
  status: 'draft' | 'submitted' | null
  // Loading states
  isLoading: boolean
  isSaving: boolean

  // Actions
  setFormData: (data: Partial<FormData>) => void
  setCurrentStep: (step: FormStep) => void
  setDraftId: (id: string) => void
  setStatus: (status: 'draft' | 'submitted' | null) => void

  // Submit final form
  submitForm: () => Promise<{ success: boolean; applicationId: string } | undefined>

  // Add reset action
  resetForm: () => void
}

// 默认表单值
const defaultFormValues: Partial<FormData> = {
  name: '',
  country: '',
  streetAddress: '',
  streetAddress2: '',
  city: '',
  region: '',
  zipCode: '',
  phone: '',
  fax: '',
  email: '',
  office: undefined,
  purpose: undefined,
  purposeOther: '',
  pronouns: 'mr',
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: {
    month: '',
    date: '',
    year: '',
  },
  educations: [
    {
      countryOfStudy: '',
      degreeObtained: '',
      schoolName: '',
      studyDuration: {
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
      },
    },
  ],
  serviceType: {
    foreignCredentialEvaluation: {
      firstDegree: { speed: undefined },
      secondDegrees: 0,
    },
    coursebyCourse: {
      firstDegree: { speed: undefined },
      secondDegrees: 0,
    },
    professionalExperience: { speed: undefined },
    positionEvaluation: { speed: undefined },
    translation: { required: false },
  },
  deliveryMethod: 'no_delivery_needed',
  additionalServices: [],
  additionalServicesQuantity: {
    extra_copy: 0,
    pdf_with_hard_copy: 0,
    pdf_only: 0,
  },
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      formData: defaultFormValues,
      currentStep: FormStep.CLIENT_INFO,
      draftId: null,
      status: null,
      isLoading: false,
      isSaving: false,

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setDraftId: (id) => set({ draftId: id }),

      setStatus: (status) => set({ status }),

      submitForm: async () => {
        const state = get()
        set({ isLoading: true })

        try {
          const result = await submitAETApplication({
            ...(state.formData as FormData),
            // Make sure email is included in the submission
            email: state.formData.email as string,
          })

          if (result.success) {
            set({
              status: 'submitted',
              draftId: result.applicationId,
            })
            return result
          }
        } catch (error) {
          console.error('Failed to submit form:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      resetForm: () => {
        set({
          formData: defaultFormValues,
          currentStep: FormStep.CLIENT_INFO,
          draftId: null,
          status: null,
        })
      },
    }),
    {
      name: 'fce-form-storage',
      // Only persist these fields
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        draftId: state.draftId,
        status: state.status,
      }),
    }
  )
)
