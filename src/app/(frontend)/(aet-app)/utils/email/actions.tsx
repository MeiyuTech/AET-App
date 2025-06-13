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
import { fetchFCEApplication } from '../actions'
import { getCCAddress } from './utils'
import { DueAmountChangeEmail } from '../../components/Email/templates/DueAmountChange/DueAmountChangeEmail'
import { DegreeEquivalencyConfirmationEmail } from '../../components/Email/templates/DegreeEquivalencyConfirmation/DegreeEquivalencyConfirmationEmail'

/**
 * Send an email using the Resend API.
 * @param to - The email address of the recipient.
 * @param subject - The subject of the email.
 * @param html - The HTML content of the email.
 * @param cc - The CC address of the email.
 * @param bcc - The BCC address of the email.
 * @returns A promise that resolves to an object containing the success status and message.
 */
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

/**
 * Get the HTML for an application confirmation email.
 * @param applicationId - The ID of the application.
 * @param application - The application data.
 * @param paymentLink - The payment link.
 * @returns A promise that resolves to the HTML for the application confirmation email.
 */
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
  const { success, applicationData } = await fetchFCEApplication(applicationId)
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

/**
 * Get the HTML for a payment confirmation email.
 * @param applicationId - The ID of the application.
 * @param application - The application data.
 * @param paidAt - The date and time the payment was made.
 * @param paymentAmount - The amount of the payment.
 * @param paymentId - The ID of the payment.
 * @param estimatedCompletionDate - The estimated completion date of the application.
 * @returns A promise that resolves to the HTML for the payment confirmation email.
 */
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
 * @param applicationData - The application data.
 * @param paidAt - The date and time the payment was made.
 * @param paymentAmount - The amount of the payment.
 * @param paymentId - The ID of the payment.
 * @param estimatedCompletionDate - The estimated completion date of the application.
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

/**
 * Get the HTML for a due amount change email.
 * @param applicationId - The ID of the application.
 * @param application - The application data.
 * @param newDueAmount - The new due amount.
 * @param paymentLink - The payment link.
 * @returns A promise that resolves to the HTML for the due amount change email.
 */
export async function getDueAmountChangeEmailHTML(
  applicationId: string,
  application: ApplicationData,
  paymentLink?: string
): Promise<string> {
  const emailComponent = React.createElement(DueAmountChangeEmail, {
    applicationId,
    application,
    paymentLink,
  })

  return render(emailComponent)
}

/**
 * Send a due amount change email to the applicant.
 * @param applicationId - The ID of the application.
 * @param newDueAmount - The new due amount.
 * @returns A promise that resolves to an object containing the success status and message.
 */
export async function sendDueAmountChangeEmail(applicationId: string) {
  const { success, applicationData } = await fetchFCEApplication(applicationId)
  if (!success || !applicationData) {
    throw new Error('Application not found')
  }

  let paymentLink = ''
  if (!applicationData.due_amount) {
    const response = await createPaymentLink(applicationData.due_amount, applicationId)
    const data = await response.json()
    paymentLink = data.url
  }

  const dueAmountChangeEmailHTML = await getDueAmountChangeEmailHTML(
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
      subject: 'AET Services Service Fee Update',
      html: dueAmountChangeEmailHTML,
    })

    return { success: emailSuccess, message: sendEmailMessage }
  } catch (error) {
    console.error('Failed to send service fee change email:', error)
    throw error
  }
}

/**
 * Get the HTML for a degree equivalency confirmation email.
 * @param education - The degree equivalency data.
 * @returns A promise that resolves to the HTML for the degree equivalency confirmation email.
 */
export async function getDegreeEquivalencyConfirmationEmailHTML(education: {
  countryOfStudy: string
  degreeObtained: string
  schoolName: string
  studyStartDate: { year: string; month: string }
  studyEndDate: { year: string; month: string }
  aiOutput: {
    result: string
    reasoning?: string
  }
}): Promise<string> {
  const emailComponent = React.createElement(DegreeEquivalencyConfirmationEmail, {
    education,
  })

  return render(emailComponent)
}

/**
 * Send a degree equivalency confirmation email to the applicant.
 * @param education - The degree equivalency data.
 * @returns A promise that resolves to an object containing the success status and message.
 */
export async function sendDegreeEquivalencyConfirmationEmail(
  email: string,
  education: {
    countryOfStudy: string
    degreeObtained: string
    schoolName: string
    studyStartDate: { year: string; month: string }
    studyEndDate: { year: string; month: string }
    aiOutput: {
      result: string
      reasoning?: string
    }
  }
) {
  const degreeEquivalencyConfirmationEmailHTML =
    await getDegreeEquivalencyConfirmationEmailHTML(education)

  try {
    const { success: emailSuccess, message: sendEmailMessage } = await resendEmail({
      to: email,
      cc: process.env.RESEND_DEFAULT_CC_ADDRESS!,
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      subject: 'AET Degree Equivalency Confirmation',
      html: degreeEquivalencyConfirmationEmailHTML,
    })

    return { success: emailSuccess, message: sendEmailMessage }
  } catch (error) {
    console.error('Failed to send degree equivalency confirmation email:', error)
    throw error
  }
}
