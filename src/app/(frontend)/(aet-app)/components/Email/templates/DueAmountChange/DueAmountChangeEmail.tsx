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

import { Button } from '../../Button'
import { Footer } from '../../Footer'
import { Header } from '../../Header'
import CheckoutSummaryCard from '../../CheckoutSummaryCard'
import SelectedServicesEmailCard from '../../SelectedServicesEmailCard'
import { styles, colors } from '../../styles/config'

import { ApplicationData } from '../../../FCEApplicationForm/types'

interface DueAmountChangeEmailProps {
  applicationId: string
  application: ApplicationData
  paymentLink?: string
}

export const DueAmountChangeEmail = ({
  applicationId,
  application,
  paymentLink,
}: DueAmountChangeEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Service Fee Update</title>
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
                We are writing to inform you that the service fee for your AET application (ID:{' '}
                <span style={styles.text.monospace}>{applicationId}</span>) has been updated.
              </Text>

              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>Updated Service Fee</Heading>
                <Text style={styles.text.default}>
                  {application.due_amount !== null ? (
                    <>
                      Your service fee is{' '}
                      <strong style={{ color: colors.primary }}>
                        ${application.due_amount.toFixed(2)}
                      </strong>
                      .
                    </>
                  ) : (
                    'Your application is currently under review, and we will notify you of the final service fee once it has been determined.'
                  )}
                </Text>

                {application.due_amount !== null && paymentLink && (
                  <>
                    <Text style={styles.text.default}>
                      Please click the button below to proceed with the payment:
                    </Text>
                    <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                      <Button href={paymentLink}>Proceed to Online Payment</Button>
                    </Section>
                  </>
                )}
              </Section>

              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>Service Details</Heading>
                <SelectedServicesEmailCard application={application} />

                {application.due_amount !== null && (
                  <CheckoutSummaryCard application={application} amount={application.due_amount} />
                )}

                <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Button
                    href={`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}
                  >
                    Check Status
                  </Button>
                </Section>
              </Section>

              <Section style={styles.section.default}>
                <Text style={styles.text.default}>
                  <span style={{ color: colors.primary }}>
                    If you have any questions about the service fee or our services, please reply to
                    this email thread (Reply All Please).
                  </span>{' '}
                  We are here to help!
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

DueAmountChangeEmail.PreviewProps = {
  applicationId: '1234567890',
  application: {
    firstName: 'John',
    lastName: 'Doe',
    due_amount: 299.99,
  },
  paymentLink: 'https://app.americantranslationservice.com/payment?applicationId=1234567890',
} as DueAmountChangeEmailProps

export default DueAmountChangeEmail
