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

interface DegreeEquivalencyConfirmationEmailProps {
  applicationId: string
  firstName: string
  lastName: string
  degreeEquivalency: {
    foreignDegree: string
    usEquivalency: string
    institution: string
    country: string
  }
}

export const DegreeEquivalencyConfirmationEmail = ({
  applicationId,
  firstName,
  lastName,
  degreeEquivalency,
}: DegreeEquivalencyConfirmationEmailProps) => {
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
                  universities, employers and licensing boards.
                </Text>
              </Section>

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
                <Heading style={styles.heading.h2}>Your Degree Equivalency</Heading>

                <Text style={styles.text.default}>
                  <strong>Foreign Degree:</strong> {degreeEquivalency.foreignDegree}
                </Text>
                <Text style={styles.text.default}>
                  <strong>U.S. Equivalency:</strong> {degreeEquivalency.usEquivalency}
                </Text>
                <Text style={styles.text.default}>
                  <strong>Institution:</strong> {degreeEquivalency.institution}
                </Text>
                <Text style={styles.text.default}>
                  <strong>Country:</strong> {degreeEquivalency.country}
                </Text>
              </Section>

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
                <Heading style={styles.heading.h2}>Next Steps</Heading>
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
                    </strong>
                  </li>
                </ol>

                <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                  <Button href="https://app.americantranslationservice.com/credential-evaluation-application">
                    Begin Your Application Now
                  </Button>
                </Section>
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
                  If you have any questions, please reply to this email thread (Reply All Please).
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
  applicationId: '1234567890',
  firstName: 'John',
  lastName: 'Doe',
  degreeEquivalency: {
    foreignDegree: 'Bachelor of Science in Computer Science',
    usEquivalency: 'Bachelor of Science in Computer Science',
    institution: 'Example University',
    country: 'China',
  },
} as DegreeEquivalencyConfirmationEmailProps

export default DegreeEquivalencyConfirmationEmail
