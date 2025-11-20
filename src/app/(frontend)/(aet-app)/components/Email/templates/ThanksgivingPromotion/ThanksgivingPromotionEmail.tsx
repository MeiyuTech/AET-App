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

/**
 * ThanksgivingPromotionEmailProps interface
 * @param clientName - The name of the client (optional)
 * @param contactPerson - The contact person name (default: "X先生或小姐")
 * @param contactPhone - The contact phone number (default: "+1-949-978-6699")
 * @param projectWebsite - The project website URL (optional)
 * @param imageUrl - The promotional image URL (optional)
 * @param imageLink - The link URL when clicking on the promotional image (optional, defaults to projectWebsite)
 */
interface ThanksgivingPromotionEmailProps {
  clientName?: string
}

export const ThanksgivingPromotionEmail = ({
  clientName = '尊敬的客户',
}: ThanksgivingPromotionEmailProps) => {
  return (
    <Html lang="zh-CN" dir="ltr">
      <Head>
        <title>感恩节邮件推广 - 美域集团</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Tailwind>
        <Body style={thanksgivingStyles.body}>
          <Container style={thanksgivingStyles.container}>
            {/* <HeaderMeiyu /> */}
            {/* <Link
              href={'https://americantranslationservice.com/images/happy_thanksgiving.jpg'}
              style={{ display: 'inline-block' }}
            >
              <Img
                src="https://americantranslationservice.com/images/happy_thanksgiving.jpg"
                alt="感恩节快乐"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
                width={600}
              />
            </Link> */}
            <Section style={thanksgivingStyles.hero}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Img
                  src={'https://americantranslationservice.com/images/aet-favicon.svg'}
                  alt={'美域佳华'}
                  className="h-[60px] w-auto"
                  style={{ display: 'block' }}
                />
              </div>
              <Heading style={thanksgivingStyles.heading.h1}>🍂 感恩节特别礼遇 🍂</Heading>
              <Text style={thanksgivingStyles.text.hero}>
                美域集团衷心感谢您的陪伴，献上专属于您的投资移民方案。
              </Text>
            </Section>

            <Section style={thanksgivingStyles.content}>
              {/* Greeting */}
              <Heading style={thanksgivingStyles.heading.h2}>{clientName}：</Heading>

              <div style={thanksgivingStyles.leafDivider} />

              {/* Thanksgiving Message */}
              {/* <Section
                style={{
                  ...styles.section.default,
                  backgroundColor: fallPalette.background.highlight,
                  padding: spacing.md,
                  borderRadius: '16px',
                  border: `1px solid ${fallPalette.border}`,
                }}
              >
                <Text style={thanksgivingStyles.text.default}>
                  感恩节将近，美域留学与翻译公司（美域集团）全体员工提前祝您身体健康，合家美满！
                </Text>
              </Section> */}

              <Text style={thanksgivingStyles.text.default}>
                <span style={{ fontWeight: 'bold', color: fallPalette.text.primary }}>
                  2025年，您是否正在焦虑用何种方式快速获得美国绿卡？
                </span>
              </Text>

              {/* Immigration Policy Update */}
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
                  今年，美国移民政策进一步收紧，针对中国公民的无排期绿卡项目少之又少。而美国EB-5无排期通道——
                  <span style={{ fontWeight: 'bold', color: fallPalette.text.primary }}>
                    指定就业区（TEA）投资移民名额
                  </span>
                  <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>只剩不到10%</span>。
                </Text>
              </Section>

              {/* Investment Solutions */}
              <Section style={thanksgivingStyles.card}>
                <Text style={thanksgivingStyles.heading.h2}>
                  美域帮您通过投资方式快速获得美国绿卡：
                </Text>

                <Text style={thanksgivingStyles.heading.h3}>🚚 联邦快递 & 🍴 连锁餐厅</Text>
                <Text style={thanksgivingStyles.text.highlight}>
                  多重资金安全保障 · 全面资金解决方案
                </Text>

                <Text style={{ ...thanksgivingStyles.text.default, marginLeft: spacing.indent }}>
                  <strong>股权投资：</strong>可协助配资达六位数（美元）
                  <br />
                  <strong>债权方案：</strong>可提供房产担保
                </Text>

                <Section style={thanksgivingStyles.ctaButtonWrapper}>
                  <Button
                    href={'https://www.usyimin.com/projects/fedex#project-overview'}
                    className={ctaButtonClassName}
                  >
                    🍂 点击了解更多
                  </Button>
                </Section>
              </Section>

              {/* Urgency Message */}
              {/* <Section style={thanksgivingStyles.highlight}>
                <Heading
                  style={{
                    ...thanksgivingStyles.heading.h2,
                    textAlign: 'center' as React.CSSProperties['textAlign'],
                  }}
                >
                  ⚠️ 把握感恩佳节优惠窗口 ⚠️
                </Heading>
                <Text
                  style={{
                    ...thanksgivingStyles.text.default,
                    textAlign: 'center' as React.CSSProperties['textAlign'],
                  }}
                >
                  时间紧迫，美域集团15年来深耕投资与职业移民领域，以真实实业为基础，助您抢占绿卡先机，安心布局未来。
                </Text>
              </Section> */}

              <div style={thanksgivingStyles.leafDivider} />

              {/* Contact Information */}
              <Section style={thanksgivingStyles.contactCard}>
                <Heading style={{ ...thanksgivingStyles.heading.h2, marginBottom: spacing.sm }}>
                  📍 联系我们
                </Heading>
                <Text style={{ ...thanksgivingStyles.text.default, fontWeight: 'bold' }}>
                  19800 MacArthur Blvd Ste 570, Irvine CA 92612
                </Text>

                <Text style={thanksgivingStyles.text.default}>
                  <strong>中国直拨：</strong>
                  <Link
                    href="tel:+8616762084336"
                    style={{ color: '#1ABC9C', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    167-6208-4336
                  </Link>
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  <strong>美国电话：</strong>
                  <Link
                    href="tel:+19499786699"
                    style={{ color: '#1ABC9C', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    (949)978-6699
                  </Link>
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  <strong>邮箱：</strong>
                  <Link
                    href="mailto:ca2@aet21.com"
                    style={{ color: '#1ABC9C', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    ca2@aet21.com
                  </Link>
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  <strong>微信：</strong>LA9499786699
                </Text>
                <Text style={thanksgivingStyles.text.default}>
                  周一至周五 当地时间: 8:30 AM - 5:00 PM (PST)
                </Text>

                <Text style={{ ...thanksgivingStyles.text.default, marginTop: spacing.sm }}>
                  <Link
                    href="https://usyimin.com/about-us/contact"
                    style={{ color: '#1ABC9C', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    查看更多办公室
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
                    src={
                      'https://americantranslationservice.com/images/chinatown_american_dream.png'
                    }
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

              {/* Thanksgiving Wishes */}
              <Section
                style={{
                  ...styles.section.default,
                  textAlign: 'center' as React.CSSProperties['textAlign'],
                }}
              >
                <Text style={{ ...thanksgivingStyles.text.highlight, fontSize: '20px' }}>
                  🦃 祝您与挚爱共享丰盛佳节 · 感恩常伴 🦃
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

ThanksgivingPromotionEmail.PreviewProps = {
  clientName: '尊敬的客户',
} as ThanksgivingPromotionEmailProps

export default ThanksgivingPromotionEmail
