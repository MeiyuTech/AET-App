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

import { FooterMeiyu } from '../../FooterMeiyu'
import { styles, spacing } from '../../styles/config'
import { christmasStyles, holidayPalette } from './styles'

interface ChristmasPromotionEmailChineseProps {
  clientName?: string
  unsubscribeUrl?: string
}

export const ChristmasPromotionEmailChinese = ({
  clientName = '{{{FIRST_NAME}}} {{{LAST_NAME}}}',
  unsubscribeUrl = '{{{RESEND_UNSUBSCRIBE_URL}}}',
}: ChristmasPromotionEmailChineseProps) => {
  const logoUrl = 'https://www.meiyugroup.org/images/aet-favicon.png'
  const headerImageUrl = 'https://americantranslationservice.com/images/Xmas-Email-Header.png'
  const squareImageUrl = 'https://americantranslationservice.com/images/Xmas-Email-Squre-cn.png'
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
    <Html lang="zh-CN" dir="ltr">
      <Head>
        <title>AET 圣诞转介绍 - 学历认证服务</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Tailwind>
        <Body style={christmasStyles.body}>
          <Container style={christmasStyles.container}>
            <Section style={heroStyle}>
              {/* 模糊背景层 */}
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
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 100%)',
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
                <span style={christmasStyles.ribbon}>最好的节日就是帮助身边人</span>
                <Heading style={christmasStyles.heading.h1}>🎄 圣诞快乐 🎄</Heading>
                <Text style={christmasStyles.text.hero}>分享给身边需要学历认证的亲朋好友</Text>
              </div>
            </Section>

            <Section style={christmasStyles.content}>
              <Heading style={christmasStyles.heading.h2}>亲爱的 {clientName}：</Heading>

              <div style={christmasStyles.ornamentDivider} />

              <Text style={christmasStyles.text.default}>
                您身边是否有亲朋好友正在为认证国外学历发愁？
                <br />
                是的，当年的经历或许正发生在亲近人的身上。
              </Text>
              <Text style={christmasStyles.text.default}>
                <strong>所以就别让他们烦恼了！</strong>
              </Text>

              <Text style={christmasStyles.text.highlight}>
                您的推荐可以改变他们的一生：帮助他们通过国外学历认证解锁美国梦。
                <br />
                推荐{' '}
                <Link href="https://americantranslationservice.com/e-evaluation.php">
                  AET 的学历评估（FCE）
                </Link>
                。
              </Text>

              <Section
                style={{
                  ...styles.section.default,
                  backgroundColor: holidayPalette.background.highlight,
                  padding: spacing.md,
                  borderRadius: '16px',
                  boxShadow: '0 10px 24px rgba(12,83,53,0.08)',
                }}
              >
                <Text style={christmasStyles.heading.h2}>AET 可让您的亲友更省心：</Text>
                <Text style={christmasStyles.text.default}>
                  ✅ 提供 24 小时加急服务
                  <br />
                  ✅ 客服口碑 5 星好评
                  <br />✅ 接受电子版材料
                </Text>
              </Section>

              <Section style={christmasStyles.card}>
                <Text style={christmasStyles.heading.h2}>🎄 这个圣诞，抓住这个分享礼物的机会</Text>

                <Text style={{ ...christmasStyles.text.default, marginLeft: spacing.indent }}>
                  想到需要学历评估的身边人了吗？
                  <br />
                  推荐 AET 给：
                  <br />
                  • 申请绿卡或工作签证的朋友
                  <br />
                  • 申请美国职业执照的同事
                  <br />• 求职需要学历证明的邻居
                </Text>
              </Section>

              <Section style={{ textAlign: 'center' as React.CSSProperties['textAlign'] }}>
                <Link href="https://americantranslationservice.com/e-contact.php">
                  <Img
                    src={squareImageUrl}
                    alt="圣诞学历评估转介绍"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'inline-block',
                      borderRadius: '14px',
                    }}
                    width={520}
                    height={520}
                  />
                </Link>
              </Section>

              <Section style={christmasStyles.highlight}>
                <Text style={christmasStyles.text.default}>
                  🎁 感谢您的信任与推荐！
                  <br />
                  <br />
                  AET 拥有 15 年以上经验，已帮助成千上万的国际专业人士实现他们的美国梦想。
                </Text>
              </Section>

              <div style={christmasStyles.ornamentDivider} />

              <Section style={christmasStyles.contactCard}>
                <Heading style={{ ...christmasStyles.heading.h2, marginBottom: spacing.sm }}>
                  📞 联系我们
                </Heading>
                <div style={{ ...styles.section.default, marginTop: spacing.md }}>
                  <Text style={christmasStyles.heading.h3}>迈阿密办公室</Text>
                  <Text style={{ ...christmasStyles.text.default, marginBottom: spacing.sm }}>
                    电话：{' '}
                    <Link
                      href="tel:+17862503999"
                      style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      +1 786-250-3999
                    </Link>
                    <br />
                    邮箱：{' '}
                    <Link
                      href="mailto:info@americantranslationservice.com"
                      style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      info@americantranslationservice.com
                    </Link>
                  </Text>

                  <Text style={christmasStyles.heading.h3}>旧金山办公室</Text>
                  <Text style={{ ...christmasStyles.text.default, marginBottom: spacing.sm }}>
                    电话：{' '}
                    <Link
                      href="tel:+14158684892"
                      style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      +1 415-868-4892
                    </Link>
                    <br />
                    邮箱：{' '}
                    <Link
                      href="mailto:ca@aet21.com"
                      style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      ca@aet21.com
                    </Link>
                  </Text>

                  <Text style={christmasStyles.heading.h3}>洛杉矶办公室</Text>
                  <Text style={{ ...christmasStyles.text.default, marginBottom: spacing.sm }}>
                    电话：{' '}
                    <Link
                      href="tel:+19499547996"
                      style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      +1 949-954-7996
                    </Link>
                    <br />
                    邮箱：{' '}
                    <Link
                      href="mailto:ca2@aet21.com"
                      style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      ca2@aet21.com
                    </Link>
                  </Text>
                </div>
                <Text style={{ ...christmasStyles.text.default, marginTop: spacing.sm }}>
                  <Link
                    href="https://americantranslationservice.com/e-contact.php"
                    style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    在线联系我们
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
                  诚挚敬上，
                  <br />
                  American Education &amp; Translation Services（美域集团）
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
                  如需退订或更新邮件偏好，请{' '}
                  <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={{ color: '#0f766e' }}>
                    点击这里
                  </Link>
                  。
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

ChristmasPromotionEmailChinese.PreviewProps = {
  clientName: '{{{FIRST_NAME}}} {{{LAST_NAME}}}',
  unsubscribeUrl: '{{{RESEND_UNSUBSCRIBE_URL}}}',
} as ChristmasPromotionEmailChineseProps

export default ChristmasPromotionEmailChinese
