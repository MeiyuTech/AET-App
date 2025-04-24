'use server'

import React from 'react'
import { render } from '@react-email/render'

import { ApplicationConfirmationEmail } from '../../components/Email/templates/ApplicationConfirmation/ApplicationConfirmationEmail'
import { PaymentConfirmationEmail } from '../../components/Email/templates/PaymentConfirmation/PaymentConfirmationEmail'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ApplicationData } from '../../components/FCEApplicationForm/types'
import { calculateTotalPrice } from '../../components/FCEApplicationForm/utils'

import { createPaymentLink } from '../stripe/actions'

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
  application: ApplicationData,
  paymentLink: string
): Promise<string> {
  const emailComponent = React.createElement(ApplicationConfirmationEmail, {
    applicationId,
    application,
    paymentLink,
  })

  return render(emailComponent)
}

/**
 * Send an application confirmation email to the applicant.
 * @param applicationId - The ID of the application.
 * @returns A promise that resolves to an object containing the success status and message.
 */
export async function sendApplicationConfirmationEmail(applicationId: string) {
  // Send confirmation email using the new email content generator
  const { success, applicationData } = await fetchApplication(applicationId)
  if (!success) {
    throw new Error('Application not found')
  }
  if (!applicationData) {
    throw new Error('Application data not found')
  }

  const dueAmount =
    applicationData.serviceType?.translation?.required ||
    applicationData.serviceType?.customizedService?.required
      ? 'Due amount is not set yet'
      : `$${calculateTotalPrice(applicationData)}`
  console.log('Due amount:', dueAmount)

  let paymentLink = ''
  if (dueAmount != 'Due amount is not set yet') {
    const dueAmountNumber = parseFloat(dueAmount.replace('$', ''))
    const response = await createPaymentLink(dueAmountNumber, applicationId)
    const data = await response.json()
    paymentLink = data.url
  }

  const applicationConfirmationEmailHTML = await getApplicationConfirmationEmailHTML(
    applicationId,
    applicationData,
    paymentLink
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
      cc: getCCAddress(applicationData.office, applicationData.email),
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

export async function getPaymentConfirmationEmailHTML(
  applicationId: string,
  application: ApplicationData,
  paidAt: string,
  paymentAmount: string,
  paymentId: string,
  estimatedCompletionDate: string
): Promise<string> {
  const emailComponent = React.createElement(PaymentConfirmationEmail, {
    applicationId,
    application,
    paidAt,
    paymentAmount,
    paymentId,
    estimatedCompletionDate,
  })

  return render(emailComponent)
}

/**
 * Send a payment confirmation email to the applicant.
 * @param applicationId - The ID of the application.
 * @returns A promise that resolves to an object containing the success status and message.
 */
export async function sendPaymentConfirmationEmail(
  applicationId: string,
  applicationData: ApplicationData,
  paidAt: string,
  paymentAmount: string,
  paymentId: string,
  estimatedCompletionDate: string
) {
  const paymentConfirmationEmailHTML = await getPaymentConfirmationEmailHTML(
    applicationId,
    applicationData,
    paidAt,
    paymentAmount,
    paymentId,
    estimatedCompletionDate
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
      cc: getCCAddress(applicationData.office, applicationData.email),
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      subject: 'AET Services Payment Confirmation',
      html: paymentConfirmationEmailHTML,
    })

    return { success: emailSuccess, message: sendEmailMessage }
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error)
    throw error
  }
}

export async function getDueAmountChangeEmailHTML(
  applicationId: string,
  application: ApplicationData,
  newDueAmount: number | null
): Promise<string> {
  // TODO: Replace with actual email template component
  return `
    <div>
      <h1>Due Amount Update Notification</h1>
      <p>Application ID: ${applicationId}</p>
      <p>New Due Amount: ${newDueAmount !== null ? `$${newDueAmount.toFixed(2)}` : 'Not set'}</p>
    </div>
  `
}

export async function sendDueAmountChangeEmail(applicationId: string, newDueAmount: number | null) {
  const { success, applicationData } = await fetchApplication(applicationId)
  if (!success || !applicationData) {
    throw new Error('Application not found')
  }

  const dueAmountChangeEmailHTML = await getDueAmountChangeEmailHTML(
    applicationId,
    applicationData,
    newDueAmount
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
      cc: getCCAddress(applicationData.office, applicationData.email),
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      subject: 'AET Services Due Amount Update',
      html: dueAmountChangeEmailHTML,
    })

    return { success: emailSuccess, message: sendEmailMessage }
  } catch (error) {
    console.error('Failed to send due amount change email:', error)
    throw error
  }
}
