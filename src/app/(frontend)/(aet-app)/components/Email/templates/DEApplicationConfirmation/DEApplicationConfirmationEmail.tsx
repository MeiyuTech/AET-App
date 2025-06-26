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
  Img,
} from '@react-email/components'
import { Button } from '../../Button'
import { Footer } from '../../Footer'
import { Header } from '../../Header'
import { styles, colors } from '../../styles/config'
import countryList from 'react-select-country-list'

interface DEApplicationConfirmationEmailProps {
  applicationId: string
  firstName: string
  lastName: string
  education: {
    countryOfStudy: string
    degreeObtained: string
    schoolName: string
    studyStartDate: { year: string; month: string }
    studyEndDate: { year: string; month: string }
    aiOutput: string
  }
}

function formatStudyDuration(
  startDate: { year: string; month: string },
  endDate: { year: string; month: string }
) {
  return `${startDate.year}-${startDate.month} - ${endDate.year}-${endDate.month}`
}

function getCountryName(code: string) {
  const countries = countryList().getData()
  return countries.find((c) => c.value === code)?.label || code
}

export const DEApplicationConfirmationEmail = ({
  applicationId,
  firstName,
  lastName,
  education: degreeEquivalency,
}: DEApplicationConfirmationEmailProps) => {
  const countryName = getCountryName(degreeEquivalency.countryOfStudy)
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Degree Equivalency Application Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Tailwind>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Header />

            {/* Top Image and Title */}
            <Section
              style={{ ...styles.section.default, textAlign: 'center', marginBottom: '24px' }}
            >
              <div
                style={{
                  position: 'relative',
                  height: '128px',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                }}
              >
                <Img
                  src="https://app.americantranslationservice.com/Graduation-Students.jpg"
                  alt="Graduation Cap"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  width={1000}
                  height={1000}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Heading
                    style={{
                      ...styles.heading.h1,
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    Degree Equivalency <span style={{ color: '#86efac' }}>Tool</span>
                  </Heading>
                </div>
              </div>
            </Section>

            <Section style={styles.content}>
              <Heading style={styles.heading.h1}>
                Dear {firstName} {lastName},
              </Heading>
              <Text style={styles.text.default}>
                Thank you for submitting your application. We have received it successfully! Your
                application ID is <span style={styles.text.monospace}>{applicationId}</span>.
              </Text>

              {/* Degree Equivalency Table */}
              <Section
                style={{
                  ...styles.section.card,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  padding: '0',
                  marginBottom: '24px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1e3a8a',
                    padding: '16px',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                  }}
                >
                  <Heading
                    style={{
                      ...styles.heading.h2,
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    Credential 1
                  </Heading>
                </div>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td
                        style={{
                          padding: '8px 16px',
                          fontWeight: '500',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        Country of Study:
                      </td>
                      <td style={{ padding: '8px 16px' }}>{countryName}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td
                        style={{
                          padding: '8px 16px',
                          fontWeight: '500',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        Name of Degree:
                      </td>
                      <td style={{ padding: '8px 16px' }}>{degreeEquivalency.degreeObtained}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td
                        style={{
                          padding: '8px 16px',
                          fontWeight: '500',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        Name of Institution:
                      </td>
                      <td style={{ padding: '8px 16px' }}>{degreeEquivalency.schoolName}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td
                        style={{
                          padding: '8px 16px',
                          fontWeight: '500',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        Study Duration:
                      </td>
                      <td style={{ padding: '8px 16px' }}>
                        {formatStudyDuration(
                          degreeEquivalency.studyStartDate,
                          degreeEquivalency.studyEndDate
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: '8px 16px',
                          fontWeight: '500',
                          backgroundColor: '#f9fafb',
                        }}
                      >
                        Equivalency in U.S.:
                      </td>
                      <td
                        style={{
                          padding: '8px 16px',
                          fontWeight: '600',
                          color: '#1e3a8a',
                          backgroundColor: '#eff6ff',
                        }}
                      >
                        Upon Receipt of Payment, We Will Email Your Degree Equivalency Results in
                        One Business Day.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              {/* What's next? Section */}
              <Section style={styles.section.card}>
                <Heading style={styles.heading.h2}>What&apos;s next?</Heading>
                <Text style={styles.heading.h3}>1. Confirm Your Application</Text>
                <Text style={{ ...styles.text.default, marginLeft: '24px' }}>
                  Click the &quot;Check Status&quot; button to confirm your application.
                </Text>

                <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Button
                    href={`https://app.americantranslationservice.com/degree-equivalency-tool/application/success?applicationId=${applicationId}`}
                  >
                    Check Status
                  </Button>
                </Section>

                <Text style={styles.heading.h3}>2. Make Payment</Text>

                <Text style={styles.heading.h3}>3. Processing</Text>
                <Text style={{ ...styles.text.default, marginLeft: '24px' }}>
                  We will begin processing your evaluation once payment is confirmed.
                </Text>
              </Section>

              {/* Best Regards Section */}
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

DEApplicationConfirmationEmail.PreviewProps = {
  applicationId: 'cbdb4ed3-c7e2-4af6-9f2a-706403d8b5d3',
  firstName: 'Basharat',
  lastName: 'Rakhmanberdieva',
  education: {
    countryOfStudy: 'Kazakhstan',
    degreeObtained: 'Bachelor of economics and business in finance',
    schoolName: 'Khoja Akhmet Yassawi International Kazakh-Turkish University',
    studyStartDate: { year: '2014', month: '06' },
    studyEndDate: { year: '2018', month: '06' },
    aiOutput: 'Bachelor of Science in Computer Science',
  },
} as DEApplicationConfirmationEmailProps

export default DEApplicationConfirmationEmail
