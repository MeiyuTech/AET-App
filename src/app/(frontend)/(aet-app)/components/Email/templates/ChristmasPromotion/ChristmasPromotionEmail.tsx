import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { Button } from '../../Button'
import { FooterMeiyu } from '../../FooterMeiyu'
import { styles, spacing } from '../../styles/config'
import { christmasStyles, ctaButtonClassName, holidayPalette } from './styles'

interface ChristmasPromotionEmailProps {
  clientName?: string
}

export const ChristmasPromotionEmail = ({
  clientName = '{{{FIRST_NAME}}} {{{LAST_NAME}}}',
}: ChristmasPromotionEmailProps) => {
  const logoUrl = 'https://www.meiyugroup.org/images/aet-favicon.png'
  const headerImageUrl = 'https://americantranslationservice.com/images/Xmas-Email-Header.jpg'
  const squareImageUrl = 'https://americantranslationservice.com/images/Xmas-Email-Squre.jpg'
  const heroStyle = {
    ...christmasStyles.hero,
    backgroundImage: `url(${headerImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative' as React.CSSProperties['position'],
    overflow: 'hidden',
  }

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>AET Christmas Referral - Foreign Credential Evaluation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Tailwind>
        <Body style={christmasStyles.body}>
          <Container style={christmasStyles.container}>
            <Section style={{ ...styles.section.default, padding: 0, marginBottom: spacing.lg }}>
              <Img
                src={headerImageUrl}
                alt="Share the gift of opportunity this Christmas"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '16px',
                }}
                width={1200}
                height={640}
              />
            </Section>

            <Section style={heroStyle}>
              {/* Blurred background overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${headerImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(6px)',
                  transform: 'scale(1.05)',
                  opacity: 0.85,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)',
                  zIndex: 1,
                }}
              />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Img
                    src={logoUrl}
                    alt={'AET'}
                    className="h-[60px] w-auto"
                    style={{ display: 'block' }}
                  />
                </div>
                <span style={christmasStyles.ribbon}>The Best Gift - Help Someone You Know</span>
                <Heading style={christmasStyles.heading.h1}>🎄 Merry Christmas 🎄</Heading>
                <Text style={christmasStyles.text.hero}>
                  Share the gift of opportunity with someone who needs Foreign Credential Evaluation.
                </Text>
              </div>
            </Section>

            <Section style={christmasStyles.content}>
              <Heading style={christmasStyles.heading.h2}>Dear {clientName},</Heading>

              <div style={christmasStyles.ornamentDivider} />

              <Text style={christmasStyles.text.default}>
                Do you know someone struggling to use their foreign degree in the U.S.? You probably
                still remember how stressful it was. Don&apos;t let others go through that struggle!
              </Text>

              <Text style={christmasStyles.text.highlight}>
                Your referral can change someone&apos;s life — help them unlock opportunities in the
                U.S. with AET&apos;s Foreign Credential Evaluation (FCE).
              </Text>

              <Section
                style={{
                  ...styles.section.default,
                  backgroundColor: holidayPalette.background.highlight,
                  padding: spacing.md,
                  borderRadius: '16px',
                  border: `1px dashed ${holidayPalette.accent}`,
                }}
              >
                <Text style={christmasStyles.text.default}>
                  AET makes it easy for your friends and family:
                  <br />
                  ✅ 24-hour service available
                  <br />
                  ✅ 5-star review customer service
                  <br />
                  ✅ Digital copies accepted
                </Text>
              </Section>

              <Section style={christmasStyles.card}>
                <Text style={christmasStyles.heading.h2}>
                  🎄 Share the gift of opportunity this Christmas
                </Text>

                <Text style={{ ...christmasStyles.text.default, marginLeft: spacing.indent }}>
                  Know someone who needs evaluation? Share AET with:
                  <br />
                  • Anyone applying for green cards or work visas
                  <br />
                  • Colleagues seeking U.S. professional licenses
                  <br />
                  • Neighbors needing job verification
                </Text>

                <Section style={{ textAlign: 'center' as React.CSSProperties['textAlign'] }}>
                  <Img
                    src={squareImageUrl}
                    alt="Foreign Credential Evaluation for Christmas referrals"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'inline-block',
                      borderRadius: '14px',
                      border: `1px solid ${holidayPalette.border}`,
                    }}
                    width={520}
                    height={520}
                  />
                </Section>

                <Section style={christmasStyles.ctaButtonWrapper}>
                  <Button
                    href="https://americantranslationservice.com/e-contact.php"
                    className={ctaButtonClassName}
                  >
                    🎁 Refer a friend now
                  </Button>
                </Section>
              </Section>

              <Section style={christmasStyles.highlight}>
                <Text style={christmasStyles.text.default}>
                  🎁 Your recommendation means everything!
                  <br />
                  <br />
                  With over 15 years of experience, AET has helped thousands of international
                  professionals achieve their American dreams.
                </Text>
              </Section>

              <div style={christmasStyles.ornamentDivider} />

              <Section style={christmasStyles.contactCard}>
                <Heading style={{ ...christmasStyles.heading.h2, marginBottom: spacing.sm }}>
                  📞 Contact Us
                </Heading>
                <Text style={christmasStyles.text.default}>
                  Phone:{' '}
                  <Link
                    href="tel:+19499786699"
                    style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    +1-949-978-6699
                  </Link>
                </Text>
                <Text style={christmasStyles.text.default}>
                  Email:{' '}
                  <Link
                    href="mailto:ca2@aet21.com"
                    style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    ca2@aet21.com
                  </Link>
                </Text>
                <Text style={{ ...christmasStyles.text.default, marginTop: spacing.sm }}>
                  <Link
                    href="https://americantranslationservice.com/e-contact.php"
                    style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Contact us online
                  </Link>
                </Text>
              </Section>

              <Section
                style={{
                  ...styles.section.default,
                  marginTop: spacing.md,
                  textAlign: 'left' as React.CSSProperties['textAlign'],
                }}
              >
                <Text style={christmasStyles.text.default}>
                  Sincerely,
                  <br />
                  American Education &amp; Translation Services (Meiyu Group)
                </Text>
              </Section>

              <Section
                style={{
                  ...styles.section.default,
                  textAlign: 'center' as React.CSSProperties['textAlign'],
                  marginTop: spacing.md,
                }}
              >
                <Text style={christmasStyles.text.default}>
                  If you wish to unsubscribe or adjust preferences, please{' '}
                  <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={{ color: '#0f766e' }}>
                    click here
                  </Link>
                  .
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

ChristmasPromotionEmail.PreviewProps = {
  clientName: '{{{FIRST_NAME}}} {{{LAST_NAME}}}',
} as ChristmasPromotionEmailProps

export default ChristmasPromotionEmail
