import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

if (!process.env.RESEND_DEFAULT_FROM_ADDRESS) {
  throw new Error('RESEND_DEFAULT_FROM_ADDRESS is not set')
}

if (!process.env.RESEND_DEFAULT_FROM_NAME) {
  throw new Error('RESEND_DEFAULT_FROM_NAME is not set')
}

export async function POST() {
  const fromAddress = process.env.RESEND_DEFAULT_FROM_ADDRESS || 'onboarding@resend.dev'
  const fromName = process.env.RESEND_DEFAULT_FROM_NAME || 'Resend'
  const fromEmail = `${fromName} <${fromAddress}>`

  try {
    const payload = await getPayload({ config })
    await payload.sendEmail({
      from: fromEmail,
      to: 'nietsemorej@gmail.com',
      cc: 'ikblue.002fa7@gmail.com',
      subject: 'Test Email',
      html: '<p>This is a test email from your application.</p>',
    })

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
