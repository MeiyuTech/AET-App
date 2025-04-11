import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { Button } from '../../components/Button'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

interface ApplicationConfirmationEmailProps {
  firstName: string
  lastName: string
  servicesDescription: string[]
  deliveryMethod: string
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[]
  applicationId: string
  submittedAt: string
}

const ApplicationConfirmationEmail: React.FC<ApplicationConfirmationEmailProps> = ({
  firstName,
  lastName,
  servicesDescription,
  deliveryMethod,
  additionalServices,
  applicationId,
  submittedAt,
}) => {
  // Format services and delivery times for display
  const servicesHtml = servicesDescription.map((service) => service).join(', ')

  // Format additional services for display
  const additionalServicesMap: Record<string, string> = {
    extra_copy: 'Extra Hard Copy',
    pdf_with_hard_copy: 'PDF with Hard Copy',
    pdf_only: 'PDF Only',
  }

  const additionalServicesHtml = additionalServices
    .map((service) => additionalServicesMap[service] || service)
    .join(', ')

  // Format date for display
  const formattedSubmissionDate = new Date(submittedAt).toLocaleString()

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Application Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Tailwind>
        <Body className="bg-[#f9fafb] font-sans py-[40px] text-[#333] leading-[1.6] m-0 p-0">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            <Header />

            <Section className="p-[10px]">
              <Heading className="text-[32px] font-bold mb-[16px] text-[#333]">
                Dear {firstName} {lastName}!
              </Heading>
              <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                Thank you for submitting your application. We have received it successfully! Your
                application ID is{' '}
                <span className="font-mono bg-[#e5e7eb] px-[6px] py-[2px] rounded-[4px] text-[#3b82f6]">
                  {applicationId}
                </span>
                .
              </Text>

              <Section className="bg-[#f3f4f6] p-[16px] rounded-[4px] mb-[20px]">
                <Heading className="text-[32px] font-bold mb-[16px] text-[#333]">
                  Application Summary
                </Heading>

                <Heading className="text-[24px] font-bold mt-[24px] mb-[12px] text-[#4b5563]">
                  Submission Time
                </Heading>
                <Text className="text-[16px] my-[8px] text-[#4b5563]">
                  {formattedSubmissionDate}
                </Text>

                <Heading className="text-[24px] font-bold mt-[24px] mb-[12px] text-[#4b5563]">
                  Services Requested
                </Heading>
                <Text className="text-[16px] my-[8px] text-[#4b5563]">{servicesHtml}</Text>

                <Heading className="text-[24px] font-bold mt-[24px] mb-[12px] text-[#4b5563]">
                  Delivery Method
                </Heading>
                <Text className="text-[16px] my-[8px] text-[#4b5563]">{deliveryMethod}</Text>

                <Heading className="text-[24px] font-bold mt-[24px] mb-[12px] text-[#4b5563]">
                  Additional Service
                </Heading>
                <Text className="text-[16px] my-[8px] text-[#4b5563]">
                  {additionalServicesHtml}
                </Text>
              </Section>

              <Section className="bg-[#f3f4f6] p-[16px] rounded-[4px] mb-[20px]">
                <Heading className="text-[32px] font-bold mb-[16px] text-[#333]">
                  What&apos;s next?
                </Heading>
                <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                  1. Confirm your application by clicking the button below:
                </Text>

                <Section className="text-center my-[20px]">
                  <Button
                    href={`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}
                  >
                    Check your status
                  </Button>
                </Section>

                <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                  If the button doesn&apos;t work, you can also copy and paste this link into your
                  browser:
                </Text>
                <Text className="text-[12px] mb-[16px] break-all text-[#4b5563]">
                  {`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}
                </Text>

                <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                  2. Submit all required documents as specified in your application.
                </Text>
                <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                  3. We will begin processing your evaluation once payment is confirmed.
                </Text>
              </Section>

              <Section className="mb-[24px]">
                <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                  <span className="text-[#3b82f6]">
                    If anything, please reply to this email thread (Reply All Please) with all of
                    your questions.
                  </span>{' '}
                  We are looking forward to cooperating with you!
                </Text>

                <Text className="text-[16px] text-[#4b5563]">
                  Best Regards,
                  <br />
                  AET Team
                </Text>
              </Section>

              <Footer />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ApplicationConfirmationEmail
