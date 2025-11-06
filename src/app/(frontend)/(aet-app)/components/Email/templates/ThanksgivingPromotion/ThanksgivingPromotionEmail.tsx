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
import { HeaderMeiyu } from '../../HeaderMeiyu'
import { styles, spacing } from '../../styles/config'

const fallPalette = {
  background: {
    page: '#fdf6ec',
    container: '#fff8f0',
    hero: 'linear-gradient(180deg, rgba(253,230,138,0.88) 0%, rgba(249,168,37,0.88) 100%)',
    highlight: '#fbe4c9',
  },
  text: {
    primary: '#7c2d12',
    secondary: '#92400e',
    body: '#5f370e',
    light: '#fff9f0',
  },
  accent: '#d97706',
  border: '#fcd34d',
  shadow: '0 18px 35px rgba(124,45,18,0.18)',
}

const thanksgivingStyles = {
  body: {
    ...styles.body,
    backgroundColor: fallPalette.background.page,
    backgroundImage:
      'linear-gradient(135deg, rgba(255, 237, 213, 0.75), rgba(228, 155, 15, 0.2))',
    fontFamily: '"Georgia", "Times New Roman", serif',
    color: fallPalette.text.body,
  },
  container: {
    ...styles.container,
    backgroundColor: fallPalette.background.container,
    border: `1px solid ${fallPalette.border}`,
    boxShadow: fallPalette.shadow,
    padding: spacing.xxxl,
  },
  content: {
    ...styles.content,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: '18px',
    padding: spacing.xxxl,
    border: `1px solid ${fallPalette.border}`,
    position: 'relative',
    overflow: 'hidden',
  },
  heading: {
    h1: {
      ...styles.heading.h1,
      color: fallPalette.text.primary,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '0.5px',
    },
    h2: {
      ...styles.heading.h2,
      color: fallPalette.text.primary,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '0.5px',
    },
    h3: {
      ...styles.heading.h3,
      color: fallPalette.text.secondary,
      fontFamily: '"Georgia", "Times New Roman", serif',
    },
  },
  text: {
    default: {
      ...styles.text.default,
      color: fallPalette.text.body,
    },
    highlight: {
      ...styles.text.default,
      color: fallPalette.text.primary,
      fontWeight: 'bold',
    },
    hero: {
      ...styles.text.default,
      color: fallPalette.text.primary,
      marginBottom: 0,
    },
    signature: {
      ...styles.text.default,
      color: fallPalette.text.secondary,
      fontStyle: 'italic',
    },
  },
  hero: {
    background: fallPalette.background.hero,
    borderRadius: '18px',
    padding: spacing.xxxl,
    textAlign: 'center',
    color: fallPalette.text.primary,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
    marginBottom: spacing.xxxl,
  },
  ribbon: {
    display: 'inline-block',
    backgroundColor: fallPalette.accent,
    color: fallPalette.text.light,
    padding: '6px 20px',
    borderRadius: '9999px',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  leafDivider: {
    margin: `${spacing.xl} auto`,
    height: '1px',
    width: '90%',
    background: 'linear-gradient(90deg, rgba(124,45,18,0), rgba(124,45,18,0.45), rgba(124,45,18,0))',
  },
  card: {
    ...styles.section.card,
    backgroundColor: 'rgba(255, 247, 237, 0.95)',
    borderRadius: '18px',
    border: `1px solid ${fallPalette.border}`,
    boxShadow: '0 12px 28px rgba(124,45,18,0.12)',
  },
  highlight: {
    backgroundColor: 'rgba(252, 211, 77, 0.25)',
    borderRadius: '18px',
    border: '1px solid rgba(245, 158, 11, 0.55)',
    padding: spacing.xxxl,
  },
  contactCard: {
    backgroundColor: 'rgba(254, 215, 170, 0.3)',
    border: '1px solid rgba(217, 119, 6, 0.35)',
    borderRadius: '18px',
    padding: spacing.xxxl,
    textAlign: 'center',
  },
  ctaButtonWrapper: {
    textAlign: 'center',
    margin: `${spacing.xl} 0`,
  },
}

const ctaButtonClassName =
  'bg-[#b45309] text-white px-[28px] py-[14px] rounded-[9999px] font-semibold no-underline text-center box-border shadow-[0_6px_18px_rgba(124,45,18,0.25)]'

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
  contactPerson?: string
  contactPhone?: string
  projectWebsite?: string
  imageUrl?: string
  imageLink?: string
}

export const ThanksgivingPromotionEmail = ({
  clientName = '尊敬的客户',
  contactPerson = 'X先生或小姐',
  contactPhone = '+1-949-978-6699',
  projectWebsite = 'https://www.usyimin.com/',
  imageUrl = 'https://americantranslationservice.com/images/%E7%90%86%E6%83%B3%E7%94%9F%E6%B4%BB%EF%BC%8C%E5%B0%BD%E5%9C%A8%E7%9C%BC%E5%89%8D.png',
  imageLink,
}: ThanksgivingPromotionEmailProps) => {
  const imageLinkUrl = imageLink || projectWebsite
  return (
    <Html lang="zh-CN" dir="ltr">
      <Head>
        <title>感恩节邮件推广 - 美域集团</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Tailwind>
        <Body style={thanksgivingStyles.body}>
          <Container style={thanksgivingStyles.container}>
            <HeaderMeiyu />

            <Section style={thanksgivingStyles.hero}>
              <span style={thanksgivingStyles.ribbon}>感恩有您</span>
              <Heading style={thanksgivingStyles.heading.h1}>🍂 感恩节特别礼遇 🍂</Heading>
              <Text style={thanksgivingStyles.text.hero}>
                美域集团以衷心的感谢陪您度过秋意满满的季节，献上以家庭与团聚为灵感打造的专属投资移民方案。
              </Text>
            </Section>

            <Section style={thanksgivingStyles.content}>
              {/* Greeting */}
              <Heading style={thanksgivingStyles.heading.h2}>{clientName}：</Heading>

              <div style={thanksgivingStyles.leafDivider} />

              {/* Thanksgiving Message */}
              <Section
                style={{
                  ...styles.section.default,
                  backgroundColor: fallPalette.background.highlight,
                  padding: spacing.lg,
                  borderRadius: '16px',
                  border: `1px solid ${fallPalette.border}`,
                }}
              >
                <Text style={thanksgivingStyles.text.default}>
                  感恩节将近，美域留学与翻译公司（美域集团）全体员工提前祝您身体健康，合家美满！
                </Text>
              </Section>

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
                  padding: spacing.lg,
                  borderRadius: '16px',
                  border: `1px dashed ${fallPalette.accent}`,
                }}
              >
                <Text style={thanksgivingStyles.text.default}>
                  今年，由于众所周知的原因，美国移民政策进一步收紧，针对中国公民的无排期绿卡项目少之又少。而美国EB-5无排期通道——
                  <span style={{ fontWeight: 'bold', color: fallPalette.text.primary }}>
                    指定就业区（TEA）投资移民名额
                  </span>
                  <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>只剩不到10%</span>。
                </Text>
              </Section>

              {/* Investment Solutions */}
              <Section style={thanksgivingStyles.card}>
                <Heading style={thanksgivingStyles.heading.h2}>
                  🍁 美域集团帮您通过投资方式快速获得美国绿卡：
                </Heading>

                <Section style={{ marginBottom: spacing.lg }}>
                  <Text style={thanksgivingStyles.heading.h3}>🚚 联邦快递 & 连锁餐厅</Text>
                  <Text style={thanksgivingStyles.text.highlight}>
                    💼 多重资金安全保障 · 全面资金解决方案
                  </Text>

                  <Text style={{ ...thanksgivingStyles.text.default, marginLeft: spacing.indent }}>
                    <strong>💰 股权投资：</strong>可协助配资达六位数（美元）
                  </Text>

                  <Text style={{ ...thanksgivingStyles.text.default, marginLeft: spacing.indent }}>
                    <strong>🏠 债权方案：</strong>可提供房产担保
                  </Text>
                </Section>

                <Section style={thanksgivingStyles.ctaButtonWrapper}>
                  <Button href={projectWebsite} className={ctaButtonClassName}>
                    🍂 点击了解更多
                  </Button>
                </Section>
              </Section>

              {/* Urgency Message */}
              <Section style={thanksgivingStyles.highlight}>
                <Heading style={{ ...thanksgivingStyles.heading.h2, textAlign: 'center' }}>
                  ⚠️ 把握感恩佳节优惠窗口 ⚠️
                </Heading>
                <Text style={{ ...thanksgivingStyles.text.default, textAlign: 'center' }}>
                  时间紧迫，美域集团15年来深耕投资与职业移民领域，以真实实业为基础，助您抢占绿卡先机，安心布局未来。
                </Text>
              </Section>

              <div style={thanksgivingStyles.leafDivider} />

              {/* Contact Information */}
              <Section style={thanksgivingStyles.contactCard}>
                <Heading style={{ ...thanksgivingStyles.heading.h2, marginBottom: spacing.md }}>
                  📞 感恩节专属顾问
                </Heading>
                <Text style={{ ...thanksgivingStyles.text.default, fontSize: '18px', fontWeight: 'bold' }}>
                  如有需要，请联系{contactPerson}：{contactPhone}（微信同号）
                </Text>
              </Section>

              <div style={thanksgivingStyles.leafDivider} />

              {/* Thanksgiving Wishes */}
              <Section style={{ ...styles.section.default, textAlign: 'center' }}>
                <Text style={{ ...thanksgivingStyles.text.highlight, fontSize: '20px' }}>
                  🦃 祝您与挚爱共享丰盛佳节 · 感恩常伴 🦃
                </Text>

                <Text style={{ ...thanksgivingStyles.text.signature, marginTop: spacing.md }}>
                  美域留学与翻译公司（美域集团）
                  <br />
                  American Education & Translation Services
                </Text>
              </Section>

              {/* Promotional Image */}
              <Section
                style={{
                  textAlign: 'center',
                  margin: `${spacing.xl} 0`,
                  backgroundColor: 'rgba(255, 244, 222, 0.45)',
                  padding: spacing.lg,
                  borderRadius: '18px',
                  border: `1px solid ${fallPalette.border}`,
                }}
              >
                <Link href={imageLinkUrl} style={{ display: 'inline-block' }}>
                  <Img
                    src={imageUrl}
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
  contactPerson: 'X先生或小姐',
  contactPhone: '+1-949-978-6699',
  projectWebsite: 'https://www.usyimin.com/',
  imageUrl:
    'https://americantranslationservice.com/images/%E7%90%86%E6%83%B3%E7%94%9F%E6%B4%BB%EF%BC%8C%E5%B0%BD%E5%9C%A8%E7%9C%BC%E5%89%8D.png',
  imageLink: 'https://www.usyimin.com/',
} as ThanksgivingPromotionEmailProps

export default ThanksgivingPromotionEmail
