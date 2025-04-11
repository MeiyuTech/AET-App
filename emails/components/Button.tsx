import * as React from 'react'
import { Button as EmailButton } from '@react-email/components'

interface ButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export const Button: React.FC<ButtonProps> = ({ href, children, className }) => {
  return (
    <EmailButton
      href={href}
      className={
        className ||
        'bg-[#3b82f6] text-white px-[24px] py-[12px] rounded-[4px] font-semibold no-underline text-center box-border shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
      }
    >
      {children}
    </EmailButton>
  )
}
