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
import { CheckCircle2 } from 'lucide-react'
import { Button } from '../../Button'
import { Footer } from '../../Footer'
import { Header } from '../../Header'
import { styles, colors } from '../../styles/config'
import countryList from 'react-select-country-list'

interface DegreeEquivalencyConfirmationEmailProps {
  // applicationId: string
  // firstName: string
  // lastName: string
  education: {
    countryOfStudy: string
    degreeObtained: string
    schoolName: string
    studyStartDate: { year: string; month: string }
    studyEndDate: { year: string; month: string }
    aiOutput: {
      result: string
      reasoning?: string
    }
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

export const DegreeEquivalencyConfirmationEmail = ({
  // applicationId,
  // firstName,
  // lastName,
  education: degreeEquivalency,
}: DegreeEquivalencyConfirmationEmailProps) => {
  const countryName = getCountryName(degreeEquivalency.countryOfStudy)
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Degree Equivalency Confirmation</title>
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
              <Section
                style={{
                  ...styles.section.card,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  padding: '24px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircle2 className="text-green-600 mr-2" size={28} />
                  <Heading
                    style={{
                      ...styles.heading.h2,
                      color: '#15803d',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    Here is Your AET Degree Equivalency
                  </Heading>
                </div>
                <Text style={styles.text.default}>
                  Now that you know what your education is worth in the U.S., get a AET credential
                  evaluation to verify your credentials so they&apos;ll be recognized by U.S.
                  universities, employers and licensing boards. Follow these simple steps:
                </Text>
                <ol
                  style={{ ...styles.text.default, marginLeft: '24px', listStyleType: 'decimal' }}
                >
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Apply for a AET credential evaluation.</strong>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>Submit related documents (Diploma, Transcripts, etc.)</strong>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>
                      AET prepares a credential evaluation, electronically stores your documents.
                      Your report never expires.
                      <br />
                      <a
                        href="https://app.americantranslationservice.com/credential-evaluation-application"
                        className="text-green-700 underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Begin Your Application Now.
                      </a>
                    </strong>
                  </li>
                </ol>
              </Section>

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
                        {degreeEquivalency.aiOutput.result}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Section
                style={{
                  ...styles.section.default,
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '24px',
                }}
              >
                <Text style={{ ...styles.text.default, fontSize: '14px', color: '#374151' }}>
                  <span style={{ fontWeight: 'bold' }}>Note:</span> Any degree equivalency provided
                  is based on the information you have inputted. It is not based on verified
                  information or documents and may not be used as proof that you attended an
                  institution or earned a degree. AET may change this provisional degree equivalency
                  upon document verification and analysis.
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

DegreeEquivalencyConfirmationEmail.PreviewProps = {
  // applicationId: '1234567890',
  // firstName: 'John',
  // lastName: 'Doe',
  education: {
    countryOfStudy: 'China',
    degreeObtained: 'Bachelor of Science in Computer Science',
    schoolName: 'Example University',
    studyStartDate: { year: '2017', month: '08' },
    studyEndDate: { year: '2021', month: '05' },
    aiOutput: {
      result: 'Bachelor of Science in Computer Science',
      reasoning: 'Based on the degree requirements and curriculum',
    },
  },
} as DegreeEquivalencyConfirmationEmailProps

export default DegreeEquivalencyConfirmationEmail
