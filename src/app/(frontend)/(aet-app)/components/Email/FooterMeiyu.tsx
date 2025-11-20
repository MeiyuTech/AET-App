import * as React from 'react'
import { Section, Text, Link, Hr } from '@react-email/components'

interface FooterMeiyuProps {
  companyNameCN?: string
  companyNameEN?: string
  websiteUrl?: string
}

export const FooterMeiyu: React.FC<FooterMeiyuProps> = ({
  companyNameCN = '美域佳华',
  companyNameEN = 'Meiyu Group',
  websiteUrl = 'https://www.usyimin.com',
}) => {
  return (
    <>
      <Hr className="border-t-[1px] border-[#e5e7eb] pt-[16px] mt-[32px]" />

      <Section className="text-center text-[#6b7280] text-[14px]">
        <Text className="m-0">
          {companyNameCN}
          {companyNameEN}
          <br />© All rights reserved.
        </Text>
        <Text className="mt-[8px]">
          <Link href={websiteUrl} className="text-[#3b82f6] no-underline">
            {websiteUrl.replace(/^https?:\/\//, '')}
          </Link>
        </Text>
      </Section>
    </>
  )
}
