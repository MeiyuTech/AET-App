'use server'

import React from 'react'
import { render } from '@react-email/render'

import { ApplicationConfirmationEmail } from 'emails'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ApplicationData } from '../../components/FCEApplicationForm/types'
import { EmailOptions } from './config'
import { fetchApplication } from '../actions'
import { getCCAddress } from './utils'

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
  const emailComponent = React.createElement(ApplicationConfirmationEmail, {
    applicationId,
    application,
  })

  return render(emailComponent)
}

export async function sendApplicationConfirmationEmail(applicationId: string) {
  // Send confirmation email using the new email content generator
  const { success, applicationData } = await fetchApplication(applicationId)
  if (!success) {
    throw new Error('Application not found')
  }
  if (!applicationData) {
    throw new Error('Application data not found')
  }
  const applicationConfirmationEmailHTML = await getApplicationConfirmationEmailHTML(
    applicationId,
    applicationData
  )

  if (!applicationData.office) {
    throw new Error('Application office not found')
  }
  if (!applicationData.email) {
    throw new Error('Application email not found')
  }

  try {
    const { success: emailSuccess, message: sendEmailMessage } = await resendEmail({
      to: applicationData.email,
      cc:
        applicationData.email === 'tech@meiyugroup.org'
          ? undefined
          : getCCAddress(applicationData.office),
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      subject: 'AET Services Application Confirmation',
      html: applicationConfirmationEmailHTML,
    })

    return { success: emailSuccess, message: sendEmailMessage }
  } catch (error) {
    console.error('Failed to send application confirmation email:', error)
    throw error
  }
}
