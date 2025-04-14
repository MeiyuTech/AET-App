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
import SelectedServicesEmailCard from '../../components/SelectedServicesEmailCard'
import { styles, colors } from '../../styles/config'

import { ApplicationData } from '@/app/(frontend)/(aet-app)/components/FCEApplicationForm/types'

interface ApplicationConfirmationEmailProps {
  applicationId: string
  application: ApplicationData
}

const ApplicationConfirmationEmail: React.FC<ApplicationConfirmationEmailProps> = ({
  applicationId,
  application,
}) => {
  // Format date for display
  const formattedSubmissionDate = new Date(application.submitted_at).toLocaleString()
  console.log('ApplicationConfirmationEmail:')
  console.log('################################################')
  console.log('formattedSubmissionDate', formattedSubmissionDate)
  console.log('application', application)
  console.log('################################################')
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Application Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Tailwind>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Header />

            <Section style={styles.content}>
              <Heading style={styles.heading.h1}>
                Dear {application.firstName} {application.lastName}!
              </Heading>
              <Text style={styles.text.default}>
                Thank you for submitting your application. We have received it successfully! Your
                application ID is <span style={styles.text.monospace}>{applicationId}</span>.
              </Text>

              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>Application Summary</Heading>

                <Text style={styles.text.default}>
                  <strong>Submission Time:</strong> {formattedSubmissionDate}
                </Text>

                <SelectedServicesEmailCard application={application} />
              </Section>

              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>What&apos;s next?</Heading>
                <Text style={styles.text.default}>
                  1. Confirm your application by clicking the button below:
                </Text>

                <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Button
                    href={`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}
                  >
                    Check your status
                  </Button>
                </Section>

                <Text style={styles.text.default}>
                  If the button doesn&apos;t work, you can also copy and paste this link into your
                  browser:
                </Text>
                <Text style={styles.text.small}>
                  {`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}
                </Text>

                <Text style={styles.text.default}>
                  2. Submit all required documents as specified in your application.
                </Text>
                <Text style={styles.text.default}>
                  3. We will begin processing your evaluation once payment is confirmed.
                </Text>
              </Section>

              <Section style={styles.section.default}>
                <Text style={styles.text.default}>
                  <span style={{ color: colors.primary }}>
                    If anything, please reply to this email thread (Reply All Please) with all of
                    your questions.
                  </span>{' '}
                  We are looking forward to cooperating with you!
                </Text>

                <Text style={styles.text.default}>
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
