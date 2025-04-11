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
} from '@react-email/components'

import { Button } from '../../components/Button'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

interface WelcomeEmailProps {
  firstName: string
  lastName: string
  loginUrl: string
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ firstName, lastName, loginUrl }) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Welcome to AET</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Tailwind>
        <Body className="bg-[#f9fafb] font-sans py-[40px] text-[#333] leading-[1.6] m-0 p-0">
          <Container className="bg-white rounded-[8px] mx-auto p-[20px] max-w-[600px] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            <Header />

            <Section className="p-[10px]">
              <Heading className="text-[32px] font-bold mb-[16px] text-[#333]">
                Welcome to AET, {firstName}!
              </Heading>

              <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                Thank you for creating an account with American Education and Translation Services.
                We&apos;re excited to have you on board!
              </Text>

              <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                With your account, you can:
              </Text>

              <Section className="bg-[#f3f4f6] p-[16px] rounded-[4px] mb-[20px]">
                <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                  • Track the status of your applications
                </Text>
                <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                  • Upload and manage your documents
                </Text>
                <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                  • Communicate with our team
                </Text>
                <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                  • Access your evaluation reports
                </Text>
              </Section>

              <Text className="text-[16px] mb-[16px] text-[#4b5563]">
                To get started, please log in to your account:
              </Text>

              <Section className="text-center my-[20px]">
                <Button href={loginUrl}>Log in to your account</Button>
              </Section>

              <Text className="text-[16px] mb-[8px] text-[#4b5563]">
                If you have any questions or need assistance, please don&apos;t hesitate to contact
                our support team.
              </Text>

              <Text className="text-[16px] text-[#4b5563]">
                Best Regards,
                <br />
                AET Team
              </Text>

              <Footer />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WelcomeEmail
