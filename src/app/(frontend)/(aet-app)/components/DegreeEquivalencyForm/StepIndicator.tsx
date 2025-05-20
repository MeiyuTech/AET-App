import { cn } from '@/utilities/cn'
import { FormStep } from './types'
import { CONFIG } from './constants'

interface StepIndicatorProps {
  currentStep: FormStep
  onStepClick: (step: FormStep) => void
  showServiceSelection?: boolean
}

export function StepIndicator({
  currentStep,
  onStepClick,
  showServiceSelection = CONFIG.SHOW_SERVICE_SELECTION,
}: StepIndicatorProps) {
  const steps = [
    { step: FormStep.CLIENT_INFO, label: 'Client Info' },
    { step: FormStep.EVALUEE_INFO, label: 'Education Info' },
    ...(showServiceSelection ? [{ step: FormStep.SERVICE_SELECTION, label: 'Services' }] : []),
    { step: FormStep.REVIEW, label: 'Review' },
  ]

  return (
    <div className="mb-8">
      {/* Step Indicator Container - Using grid instead of previous relative positioning solution */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
          gap: '0',
        }}
      >
        {/* Background line */}
        <div
          className="col-span-full h-[2px] bg-gray-200 self-center relative -z-10"
          style={{ top: '20px', marginLeft: '15%', width: '70%' }}
        />

        {/* Create step items */}
        {steps.map((step, index) => (
          <div key={step.step} className="flex flex-col items-center">
            {/* Circle indicator button */}
            <div onClick={() => onStepClick(step.step)} className="cursor-pointer mb-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-200',
                  'hover:shadow-md hover:scale-105',
                  currentStep === step.step && 'border-primary bg-primary text-white',
                  currentStep > step.step && 'border-primary bg-primary text-white',
                  currentStep < step.step && 'border-gray-300 text-gray-500 hover:border-primary/50'
                )}
              >
                {currentStep > step.step ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            </div>

            {/* Step title */}
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-200 text-center',
                currentStep === step.step && 'text-primary',
                currentStep > step.step && 'text-primary',
                currentStep < step.step && 'text-gray-500'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
