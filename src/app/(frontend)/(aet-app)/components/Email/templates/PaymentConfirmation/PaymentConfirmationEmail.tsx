import * as React from 'react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

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
import { styles, colors } from '../../styles/config'

import { ApplicationData } from '../../../FCEApplicationForm/types'

/**
 * Initialize dayjs plugins in the correct order:
 * 1. UTC plugin must be initialized first as it provides the base functionality for timezone handling
 * 2. Timezone plugin depends on UTC plugin for timezone conversions
 * This order is crucial for proper timezone handling in the email template,
 * especially when formatting dates for different time zones (e.g., 'America/New_York')
 */
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

// Helper function to determine if a date is in EDT (Daylight Saving Time)
const isEDT = (date: dayjs.Dayjs): boolean => {
  const year = date.year()
  // EDT starts on the second Sunday in March
  const edtStart = dayjs.tz(`${year}-03-08`, 'America/New_York').day(7).hour(2)
  // EDT ends on the first Sunday in November
  const edtEnd = dayjs.tz(`${year}-11-01`, 'America/New_York').day(7).hour(2)
  return date.isSameOrAfter(edtStart) && date.isBefore(edtEnd)
}

interface PaymentConfirmationEmailProps {
  applicationId: string
  application: ApplicationData
  paidAt: string
  paymentAmount: string
  paymentId: string
  estimatedCompletionDate?: string
}

export const PaymentConfirmationEmail = ({
  applicationId,
  application,
  paidAt,
  paymentAmount,
  paymentId,
  estimatedCompletionDate,
}: PaymentConfirmationEmailProps) => {
  // Format date for display
  if (!paidAt) {
    throw new Error('Application has not been paid')
  }

  // Format payment date with exact time in EST/EDT
  const nyTime = dayjs(paidAt).tz('America/New_York')
  const timeZone = isEDT(nyTime) ? 'EDT' : 'EST'
  const formattedPaymentDate = nyTime.format('YYYY-MM-DD h:mm A ') + timeZone

  // Format completion date with date only (no time)
  const formattedCompletionDate = estimatedCompletionDate
    ? dayjs(estimatedCompletionDate).tz('America/New_York').format('YYYY-MM-DD')
    : 'Estimated processing time will be communicated after review'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Payment Confirmation</title>
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
                Thank you for your payment. We have received your payment successfully! Your
                application ID is <span style={styles.text.monospace}>{applicationId}</span>.
              </Text>

              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>Payment Details</Heading>

                <Text style={styles.text.default}>
                  <strong>Payment Date:</strong> {formattedPaymentDate}
                </Text>

                <Text style={styles.text.default}>
                  <strong>Payment ID:</strong>{' '}
                  <span style={styles.text.monospace}>{paymentId}</span>
                </Text>

                <CheckoutSummaryCard application={application} amount={parseFloat(paymentAmount)} />
              </Section>

              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>What&apos;s Next</Heading>
                <Text style={styles.heading.h3}>1. Check Application Status</Text>
                <Text style={{ ...styles.text.default, marginLeft: '24px' }}>
                  You can check the processing status of your application at any time by clicking
                  the button below.
                </Text>

                <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Button
                    href={`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}
                  >
                    Check Status
                  </Button>
                </Section>

                <Text style={styles.heading.h3}>2. Processing Time</Text>
                <Text style={{ ...styles.text.default, marginLeft: '24px' }}>
                  We have started processing your application. Estimated completion date:{' '}
                  {formattedCompletionDate}
                </Text>
                <Text style={styles.text.note}>
                  Note: The delivery deadline may be adjusted if required materials are not uploaded
                  or during federal holidays.
                </Text>

                <Text style={styles.heading.h3}>3. Result Notification</Text>
                <Text style={{ ...styles.text.default, marginLeft: '24px' }}>
                  Once your application is processed, we will notify you via email.
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

PaymentConfirmationEmail.PreviewProps = {
  applicationId: '1234567890',
  application: {
    firstName: 'John',
    lastName: 'Doe',
  },
  paidAt: '2023-01-01T10:00:00.000Z',
  paymentAmount: '100.00',
  paymentId: '1234567890',
} as PaymentConfirmationEmailProps

export default PaymentConfirmationEmail
