'use server'

import React from 'react'
import { render } from '@react-email/render'

import { ApplicationConfirmationEmail } from 'emails'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ApplicationData } from '../../components/FCEApplicationForm/types'
import { EmailOptions } from './config'

export async function resendEmail({ to, subject, html, cc, bcc }: EmailOptions) {
  if (!process.env.RESEND_DEFAULT_FROM_ADDRESS) {
    throw new Error('RESEND_DEFAULT_FROM_ADDRESS is not set')
  }
  if (!process.env.RESEND_DEFAULT_FROM_NAME) {
    throw new Error('RESEND_DEFAULT_FROM_NAME is not set')
  }

  const fromAddress = process.env.RESEND_DEFAULT_FROM_ADDRESS
  const fromName = process.env.RESEND_DEFAULT_FROM_NAME
  const fromEmail = `${fromName} <${fromAddress}>`

  try {
    const payload = await getPayload({ config })
    await payload.sendEmail({
      from: fromEmail,
      to,
      cc: cc || process.env.RESEND_DEFAULT_CC_ADDRESS,
      bcc: bcc || process.env.RESEND_DEFAULT_BCC_ADDRESS,
      subject,
      html,
    })
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function getApplicationConfirmationEmailHTML(
  applicationId: string,
  application: ApplicationData
): Promise<string> {
  console.log('getApplicationConfirmationEmailHTML:')
  console.log('################################################')
  console.log('applicationId', applicationId)
  console.log('application', application)
  console.log('################################################')
  const emailComponent = React.createElement(ApplicationConfirmationEmail, {
    applicationId,
    application,
  })

  return render(emailComponent)
}
