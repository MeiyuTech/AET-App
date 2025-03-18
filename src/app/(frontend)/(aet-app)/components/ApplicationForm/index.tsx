'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { motion, useAnimationControls } from 'framer-motion'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Form } from '@/components/ui/form'

import { StepIndicator } from './StepIndicator'
import { ClientInfo } from './steps/ClientInfo'
import { EvalueeInfo } from './steps/EvalueeInfo'
import { ServiceSelection } from './steps/ServiceSelection'
import { Review } from './steps/Review'
import { formSchema } from './schema'
import { useFormStore } from './store'
import { FormData, FormStep, defaultFormValues } from './types'
import { CONFIG } from './constants'

// Import other step components...

export default function ApplicationForm() {
  const { toast } = useToast()
  const router = useRouter()
  const controls = useAnimationControls()
  const {
    formData,
    currentStep,
    draftId,
    isLoading,
    isSaving,
    setFormData,
    setCurrentStep,
    submitForm,
    resetForm,
  } = useFormStore()
  const [termsAgreed, setTermsAgreed] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(formData as FormData),
      deliveryMethod: formData?.deliveryMethod || 'no_delivery_needed',
      additionalServices: formData?.additionalServices || [],
      additionalServicesQuantity: formData?.additionalServicesQuantity || {
        extra_copy: 0,
        pdf_with_hard_copy: 0,
        pdf_only: 0,
      },
      educations: formData?.educations || [
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
      // Set default service type 'customizedService' as required
      serviceType: {
        customizedService: { required: true },
      },
    },
  })

  // Initialize form with persisted data - ONLY ON MOUNT
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      form.reset(formData as FormData)
    }
    // empty dependency array, only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // remove dependencies to avoid loop

  // Update Zustand store when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      // add deep comparison to avoid unnecessary updates with same values
      if (JSON.stringify(value) !== JSON.stringify(formData)) {
        setFormData(value as Partial<FormData>)
      }
    })
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, setFormData]) // remove form.watch and formData dependencies

  // Render component based on current step
  const renderStep = () => {
    switch (currentStep) {
      case FormStep.CLIENT_INFO:
        return <ClientInfo />
      case FormStep.EVALUEE_INFO:
        return <EvalueeInfo />
      case FormStep.SERVICE_SELECTION:
        // Only render if feature flag is enabled
        return CONFIG.SHOW_SERVICE_SELECTION ? <ServiceSelection /> : null
      case FormStep.REVIEW:
        return <Review />
      default:
        return null
    }
  }

  const scrollToTop = async () => {
    await controls.start({
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    })
    window.scrollTo(0, 0)
  }

  const handleNext = async (e: React.FormEvent) => {
    // Prevent form submission
    e.preventDefault()

    // Get fields to validate based on current step
    const fieldsToValidate = getFieldsToValidate(currentStep)

    // Validate fields
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      console.log('Current form data:', form.getValues())

      // Skip SERVICE_SELECTION step if feature flag is disabled
      if (!CONFIG.SHOW_SERVICE_SELECTION && currentStep === FormStep.EVALUEE_INFO) {
        setCurrentStep(FormStep.REVIEW)
      } else {
        setCurrentStep(currentStep + 1)
      }

      await scrollToTop()
    } else {
      toast({
        title: 'Please Complete Current Step',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
    }
  }

  // Helper function: Return fields to validate based on step
  const getFieldsToValidate = (step: FormStep): (keyof FormData)[] => {
    switch (step) {
      case FormStep.CLIENT_INFO:
        return ['name', 'streetAddress', 'city', 'region', 'zipCode', 'phone', 'email', 'purpose']
      case FormStep.EVALUEE_INFO:
        return ['pronouns', 'firstName', 'lastName', 'dateOfBirth', 'educations']
      case FormStep.SERVICE_SELECTION:
        return ['serviceType']
      case FormStep.REVIEW:
        // Validate all required fields in Review step (excluding optional fields)
        return [
          // Client Info
          'name',
          'streetAddress',
          'city',
          'region',
          'zipCode',
          'phone',
          'email',
          'purpose',
          // Evaluee Info
          'pronouns',
          'firstName',
          'lastName',
          'dateOfBirth',
          'educations',
          // Service Selection
          'serviceType',
        ]
      default:
        return []
    }
  }

  const handlePrevious = () => {
    // If Service Selection is hidden and we're at Review, go back to Evaluee Info
    if (!CONFIG.SHOW_SERVICE_SELECTION && currentStep === FormStep.REVIEW) {
      setCurrentStep(FormStep.EVALUEE_INFO)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  // Helper function to reset form state
  const resetFormState = () => {
    resetForm()
    form.reset(defaultFormValues)
  }

  const onSubmit = async (data: FormData) => {
    console.log('Starting form submission...', { currentStep, data })

    if (currentStep !== FormStep.REVIEW) {
      console.log('Not in review step, cannot submit')
      return
    }

    try {
      console.log('Form is valid, submitting data:', data)
      const result = await submitForm()

      if (result?.success) {
        // Reset form after successful submission
        resetFormState()
        setCurrentStep(FormStep.CLIENT_INFO)

        // Show success toast notification with better styling
        toast({
          title: ' 🎉 Application Submitted Successfully!  🎉',
          description: `Your application has been successfully submitted. We are processing your information.`,
          className: 'bg-green-50 border border-green-200 text-green-800',
          //
        })

        router.push(`/status?applicationId=${result.applicationId}`)
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again later.',
        variant: 'destructive',
      })
    }
  }

  // Add this new function to handle step navigation
  const handleStepClick = async (targetStep: FormStep) => {
    // Don't do anything if clicking current step
    if (targetStep === currentStep) return

    // Handle SERVICE_SELECTION navigation based on feature flag
    if (!CONFIG.SHOW_SERVICE_SELECTION) {
      // If trying to go to SERVICE_SELECTION, redirect to appropriate step
      if (targetStep === FormStep.SERVICE_SELECTION) {
        // If coming from earlier step, go to REVIEW
        if (currentStep < FormStep.SERVICE_SELECTION) {
          targetStep = FormStep.REVIEW
        }
        // If coming from later step, go to EVALUEE_INFO
        else {
          targetStep = FormStep.EVALUEE_INFO
        }
      }

      // If going from CLIENT_INFO directly to REVIEW, validate EVALUEE_INFO first
      if (currentStep === FormStep.CLIENT_INFO && targetStep === FormStep.REVIEW) {
        const clientInfoFields = getFieldsToValidate(FormStep.CLIENT_INFO)
        const isClientInfoValid = await form.trigger(clientInfoFields)
        if (!isClientInfoValid) return

        const evalueeInfoFields = getFieldsToValidate(FormStep.EVALUEE_INFO)
        const isEvalueeInfoValid = await form.trigger(evalueeInfoFields)
        if (!isEvalueeInfoValid) {
          targetStep = FormStep.EVALUEE_INFO
        }
      }
    }

    // If going backwards, allow direct navigation without validation
    if (targetStep < currentStep) {
      setCurrentStep(targetStep)
      return
    }

    // If going forwards, validate current step first
    const currentFields = getFieldsToValidate(currentStep)
    const isCurrentStepValid = await form.trigger(currentFields)
    if (!isCurrentStepValid) {
      return
    }

    // If current step is valid, allow navigation
    setCurrentStep(targetStep)
  }

  // Add reset handler
  const handleReset = async () => {
    resetFormState()
    await scrollToTop()
    toast({
      title: 'Form Reset',
      description: 'You can start filling out the application again',
      variant: 'destructive',
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <motion.form animate={controls} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* // Debugging information
        <div className="text-xs text-gray-400">
          Current Step: {currentStep} (Review = {FormStep.REVIEW})
          <br />
          Form Valid: {String(!Object.keys(form.formState.errors).length)}
          <br />
          Validation Errors: {Object.keys(form.formState.errors).join(', ')}
        </div> */}

        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
          showServiceSelection={CONFIG.SHOW_SERVICE_SELECTION}
        />

        {renderStep()}

        {currentStep === FormStep.REVIEW && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAgreed}
              onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I have read and agree to{' '}
              <Link
                href="https://www.americantranslationservice.com/e-terms-of-use.html"
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                AET&apos;s Terms of Service
              </Link>
            </Label>
          </div>
        )}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === FormStep.CLIENT_INFO}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep === FormStep.REVIEW ? (
              <Button type="submit" disabled={isSaving || !termsAgreed}>
                {isSaving ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Next'}
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-gray-100 text-red-600 hover:bg-red-200 hover:text-red-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Application
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to reset the application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will clear all filled information, and you will need to start filling
                  out the application again. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Confirm Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {draftId && (
          <p className="text-sm text-gray-500 text-center">Draft Saved (ID: {draftId})</p>
        )}
      </motion.form>
    </Form>
  )
}
