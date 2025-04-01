'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

import {
  EmailOptions,
  ApplicationConfirmationEmailHead,
  ApplicationConfirmationEmailFooter,
} from './config'

export async function sendEmail({ to, subject, html, cc, bcc }: EmailOptions) {
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
  firstName: string,
  lastName: string,
  servicesDescription: string[],
  deliveryMethod: string,
  additionalServices: ('extra_copy' | 'pdf_with_hard_copy' | 'pdf_only')[],
  applicationId: string,
  submittedAt: string
): Promise<string> {
  // Format services and delivery times for display
  const servicesHtml = servicesDescription.map((service) => `<li>${service}</li>`).join('')

  // Format additional services for display
  const additionalServicesMap: Record<string, string> = {
    extra_copy: 'Extra Hard Copy',
    pdf_with_hard_copy: 'PDF with Hard Copy',
    pdf_only: 'PDF Only',
  }

  const additionalServicesHtml = additionalServices
    .map((service) => `<li>${additionalServicesMap[service] || service}</li>`)
    .join('')

  // Format date for display
  const formattedSubmissionDate = new Date(submittedAt).toLocaleString()

  return `
  <!DOCTYPE html>
  <html>
      ${ApplicationConfirmationEmailHead}
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://app.americantranslationservice.com/_next/image?url=%2Faet_e_logo.png&w=640&q=75" alt="Logo">
        </div>
        <div class="content">
          <h1>Dear ${firstName} ${lastName}!</h1>
          <p>Thank you for submitting your application. We have received it successfully! Your application ID is <span class="application-id">${applicationId}</span>.</p>
          
          <div class="application-details">
            <h1>Application Summary</h1>

            <h2>Submission Time</h2>
            <ul>${formattedSubmissionDate}</ul>

            <h2>Services Requested</h2>
            <ul>${servicesHtml}</ul>
            
            <h2>Delivery Method</h2>
            <ul>${deliveryMethod}</ul>
            
            <h2>Additional Service</h2>
            <ul>${additionalServicesHtml}</ul>
          </div>

          <div class="next-steps">
            <h1>What's next?</h1>
            <p>1. Confirm your application by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}" class="button">Check your status</a>
            </div>

            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px;">${`https://app.americantranslationservice.com/status?applicationId=${applicationId}`}</p>
          
            <p>2. Submit all required documents as specified in your application.</p>
            <p>3. We will begin processing your evaluation once payment is confirmed.</p>
          </div>

          <p><span style="color: #3b82f6;">If anything, please reply to this email thread （Reply All Please） with all of your questions.</span> We are looking forward to cooperating with you!</p>
          
          <p>Best Regards,<br>AET Team</p>
        </div>

        ${ApplicationConfirmationEmailFooter}
      </div>
    </body>
  </html>
  `
}
