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
        <title>Happy Thanksgiving - AET</title>
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
              <Heading style={thanksgivingStyles.heading.h1}>🍂 Happy Thanksgiving 🍂 </Heading>
              <Text style={thanksgivingStyles.text.hero}> </Text>
              <br />
            </Section>

            <Section style={thanksgivingStyles.content}>
              <Heading style={thanksgivingStyles.heading.h2}>{clientName}:</Heading>

              <div style={thanksgivingStyles.leafDivider} />

              <Text style={thanksgivingStyles.text.default}>
                Have you been worried about how to get a green card fast in 2025?
                <br />
                We can help.
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
                  However, TEA investment immigration program only has
                  <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>
                    {' '}
                    about 10% of the quota left.
                  </span>
                </Text>
              </Section>

              {/* Investment Solutions */}
              <Section style={thanksgivingStyles.card}>
                <Text style={thanksgivingStyles.heading.h2}>
                  AET helps you secure a U.S. green card quickly through investment:
                </Text>

                <Text style={thanksgivingStyles.heading.h3}>
                  🚚 FedEx & 🍴 Franchise Restaurant
                </Text>
                <Text style={thanksgivingStyles.text.highlight}>
                  Layered capital protections · End-to-end funding solutions
                </Text>

                <Text style={{ ...thanksgivingStyles.text.default, marginLeft: spacing.indent }}>
                  <strong>Equity investment:</strong> arrange up to six-figure USD co-investment
                  <br />
                  <strong>Debt solution:</strong> property-backed collateral available
                </Text>

                <Section style={thanksgivingStyles.ctaButtonWrapper}>
                  <Button
                    href={'https://www.usyimin.com/projects/fedex#project-overview'}
                    className={ctaButtonClassName}
                  >
                    🍂 Learn more
                  </Button>
                </Section>
              </Section>

              <Section style={thanksgivingStyles.highlight}>
                <Text style={{ ...thanksgivingStyles.text.default, marginBottom: spacing.sm }}>
                  Hurry up!
                  <br />
                  <br />
                  With over 15 years of experience in investment and professional immigration, AET
                  is ready to serve you today!
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

              {/* Promotional Image */}
              <Section
                style={{
                  textAlign: 'center' as React.CSSProperties['textAlign'],
                  margin: `${spacing.lg} 0`,
                  backgroundColor: 'rgba(255, 244, 222, 0.45)',
                  padding: spacing.md,
                  borderRadius: '18px',
                  border: `1px solid ${fallPalette.border}`,
                }}
              >
                <Link href={'https://www.usyimin.com/'} style={{ display: 'inline-block' }}>
                  <Img
                    src={'https://americantranslationservice.com/images/thanksgiving-en.png'}
                    alt="理想生活，尽在眼前"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                    }}
                    width={600}
                  />
                </Link>
              </Section>

              <div style={thanksgivingStyles.leafDivider} />

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
