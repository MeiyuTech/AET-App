'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

import { EmailOptions } from './config'

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

// Send email to test the email sending functionality
export async function sendTestEmail() {
  try {
    return await sendEmail({
      to: 'nietsemorej@gmail.com',
      subject: 'Test Email',
      html: '<p>This is a test email from your application.</p>',
    })
  } catch (error) {
    console.error('Failed to send test email:', error)
    return { success: false, message: 'Failed to send email' }
  }
}
