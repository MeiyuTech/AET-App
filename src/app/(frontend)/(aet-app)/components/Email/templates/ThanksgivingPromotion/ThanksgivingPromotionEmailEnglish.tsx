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
  Link,
} from '@react-email/components'

import { Button } from '../../Button'
import { FooterMeiyu } from '../../FooterMeiyu'
import { styles, spacing } from '../../styles/config'
import { ctaButtonClassName, fallPalette, thanksgivingStyles } from './styles'

interface ThanksgivingPromotionEmailEnglishProps {
  clientName?: string
}

export const ThanksgivingPromotionEmailEnglish = ({
  clientName = 'Dear client',
}: ThanksgivingPromotionEmailEnglishProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Thanksgiving Email Marketing - AET</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Tailwind>
        <Body style={thanksgivingStyles.body}>
          <Container style={thanksgivingStyles.container}>
            {/* <HeaderMeiyu /> */}
            <Section style={thanksgivingStyles.hero}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Img
                  src={'https://americantranslationservice.com/images/aet-favicon.svg'}
                  alt={'AET'}
                  className="h-[60px] w-auto"
                  style={{ display: 'block' }}
                />
              </div>
              <Heading style={thanksgivingStyles.heading.h1}>Thanksgiving Email Marketing</Heading>
              <Text style={thanksgivingStyles.text.hero}>Happy Thanksgiving from AET!</Text>
            </Section>

            <Section style={thanksgivingStyles.content}>
              <Heading style={thanksgivingStyles.heading.h2}>{clientName}:</Heading>

              <div style={thanksgivingStyles.leafDivider} />

              <Text style={thanksgivingStyles.text.default}>
                Have you been worried about how to get a green card fast in 2025? We can help.
              </Text>
              <Section
                style={{
                  ...styles.section.default,
                  backgroundColor: 'rgba(255, 244, 222, 0.5)',
                  padding: spacing.md,
                  borderRadius: '16px',
                  border: `1px dashed ${fallPalette.accent}`,
                }}
              >
                <Text style={thanksgivingStyles.text.default}>
                  However, TEA investment immigration only has
                  <span style={{ fontWeight: 'bold', color: fallPalette.text.primary }}>
                    {' '}
                    about 10% of the quota left.
                  </span>
                </Text>
              </Section>

              <Section style={thanksgivingStyles.card}>
                <Text style={thanksgivingStyles.heading.h2}>At AET, we provide:</Text>
                <Text style={{ ...thanksgivingStyles.text.default, textAlign: 'center' as const }}>
                  FedEx & Vegan Restaurant Investment Programs
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  Equity Investment: We assist with financing of up to USD 300,000
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  Debt Plan: We provide real estate collateral
                </Text>

                <Section style={thanksgivingStyles.ctaButtonWrapper}>
                  <Button href={'https://www.usyimin.com/'} className={ctaButtonClassName}>
                    Click to learn more
                  </Button>
                </Section>
              </Section>

              <Section style={thanksgivingStyles.highlight}>
                <Text style={{ ...thanksgivingStyles.text.default, marginBottom: spacing.sm }}>
                  Hurry up! With over 15 years of experience in investment and professional
                  immigration, AET is ready to serve you today.
                </Text>
              </Section>

              <Section style={thanksgivingStyles.contactCard}>
                <Heading style={{ ...thanksgivingStyles.heading.h2, marginBottom: spacing.sm }}>
                  Contact
                </Heading>
                <Text style={thanksgivingStyles.text.default}>
                  <strong>Phone:</strong>{' '}
                  <Link
                    href="tel:+19499786699"
                    style={{ color: '#1ABC9C', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    +1-949-978-6699
                  </Link>
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  <strong>Email:</strong>{' '}
                  <Link
                    href="mailto:ca2@aet21.com"
                    style={{ color: '#1ABC9C', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    ca2@aet21.com
                  </Link>
                </Text>
              </Section>

              <Section style={{ ...styles.section.default, marginTop: spacing.lg }}>
                <Text style={thanksgivingStyles.text.default}>Sincerely,</Text>
                <Text style={thanksgivingStyles.text.signature}>
                  American Education & Translation Services (Meiyu Group)
                </Text>
              </Section>

              <FooterMeiyu />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ThanksgivingPromotionEmailEnglish.PreviewProps = {
  clientName: 'Dear client',
} as ThanksgivingPromotionEmailEnglishProps

export default ThanksgivingPromotionEmailEnglish
