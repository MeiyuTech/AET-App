import * as React from 'react'
import { Section, Img, Text } from '@react-email/components'

interface HeaderMeiyuProps {
  logoUrl?: string
  logoAlt?: string
  companyName?: string
}

export const HeaderMeiyu: React.FC<HeaderMeiyuProps> = ({
  logoUrl = 'https://americantranslationservice.com/images/aet-favicon.svg',
  logoAlt = '美域佳华 Logo',
  companyName = '美域佳华',
}) => {
  return (
    <Section className="text-center mb-[2px]">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          gap: '12px',
        }}
      >
        <Img src={logoUrl} alt={logoAlt} className="h-[60px] w-auto" style={{ display: 'block' }} />
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333333',
            margin: '0',
            fontFamily: 'Arial, sans-serif',
            display: 'inline-block',
          }}
        >
          {companyName}
        </Text>
      </div>
    </Section>
  )
}
