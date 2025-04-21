'use client'

import { Card, CardContent } from '@/components/ui/card'

interface StepProps {
  number: number
  title: string
  description: string
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium flex items-center gap-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
          {number}
        </div>
        <span>{title}</span>
      </h4>
      <p className="text-sm text-gray-600 pl-8">{description}</p>
    </div>
  )
}

export default function NextStepsCard() {
  const steps: StepProps[] = [
    {
      number: 1,
      title: 'Confirm Your Application',
      description: 'Click the "Check Status" button to confirm your application.',
    },
    {
      number: 2,
      title: 'Submit All Required Documents',
      description: 'Please submit all required documents as specified in your application.',
    },
    {
      number: 3,
      title: 'Processing Begins After Payment Confirmation',
      description: 'We will begin processing your evaluation once payment is confirmed.',
    },
  ]

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">What&apos;s next?</h3>

          <div className="space-y-4">
            {steps.map((step) => (
              <Step key={step.number} {...step} />
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
            <p>
              If you have any questions, please reply to your{' '}
              <strong>Application Confirmation Email thread</strong>. We look forward to cooperating
              with you!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
