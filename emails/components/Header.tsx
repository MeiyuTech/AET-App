import * as React from 'react'
import { Section, Img } from '@react-email/components'

interface HeaderProps {
  logoUrl?: string
  logoAlt?: string
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl = 'https://app.americantranslationservice.com/_next/image?url=%2Faet_e_logo.png&w=640&q=75',
  logoAlt = 'American Education and Translation Services Logo',
}) => {
  return (
    <Section className="text-center mb-[24px]">
      <Img src={logoUrl} alt={logoAlt} className="h-[60px] w-auto mx-auto" />
    </Section>
  )
}
