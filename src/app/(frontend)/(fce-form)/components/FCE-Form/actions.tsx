'use server'

import { createClient } from '../../utils/supabase/server'
import { FormData } from './types'
import { formatUtils } from './utils'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function createFCESubmission(formData: FormData) {
  const client = await createClient()
  const { error } = await client.from('fce_applications').insert(formData)
  if (error) throw error
}

export async function submitFCEApplication(formData: FormData) {
  try {
    const client = await createClient()

    // 添加调试日志
    console.log('Original form data:', formData)
    const dbData = formatUtils.toDatabase(formData, 3, 'submitted')
    console.log('Converted database data:', dbData)

    // 开始数据库事务
    const { data: application, error: applicationError } = await client
      .from('fce_applications')
      .insert({
        ...dbData,
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (applicationError) {
      console.error('Application insert error:', applicationError)
      throw applicationError
    }

    // 插入教育经历记录
    const educationPromises = formData.educations.map((education) =>
      client.from('fce_educations').insert({
        application_id: application.id,
        ...formatUtils.toEducationDatabase(education),
      })
    )

    await Promise.all(educationPromises)

    const fromAddress = process.env.RESEND_DEFAULT_FROM_ADDRESS || 'onboarding@resend.dev'
    const fromName = process.env.RESEND_DEFAULT_FROM_NAME || 'Resend'
    const fromEmail = `${fromName} <${fromAddress}>`

    const payload = await getPayload({ config })
    // Send confirmation email
    await payload.sendEmail({
      from: fromEmail,
      to: [formData.email],
      cc: process.env.RESEND_DEFAULT_CC_ADDRESS,
      subject: 'FCE Application Confirmation',
      html: `
        <h1>FCE Application Received</h1>
        <p>Dear ${formData.firstName} ${formData.lastName},</p>
        <p>We have received your FCE application. Your application ID is: ${application.id}</p>
        <p>We will process your application and get back to you soon.</p>
        <h2>Application Details:</h2>
        <ul>
          <li>Delivery Method: ${formData.deliveryMethod}</li>
          <li>Additional Services: ${formData.additionalServices.join(', ') || 'None'}</li>
        </ul>
        <p>If you have any questions, please contact us.</p>
        <p>Best regards,<br>FCE Service Team</p>
      `,
    })

    return {
      success: true,
      applicationId: application.id,
    }
  } catch (error) {
    console.error('Failed to submit FCE application:', error)
    throw new Error('Failed to submit application')
  }
}

export async function sendTestEmail() {
  if (!process.env.RESEND_DEFAULT_FROM_ADDRESS) {
    throw new Error('RESEND_DEFAULT_FROM_ADDRESS is not set')
  }
  if (!process.env.RESEND_DEFAULT_FROM_NAME) {
    throw new Error('RESEND_DEFAULT_FROM_NAME is not set')
  }
  const fromAddress = process.env.RESEND_DEFAULT_FROM_ADDRESS || 'onboarding@resend.dev'
  const fromName = process.env.RESEND_DEFAULT_FROM_NAME || 'Resend'
  const fromEmail = `${fromName} <${fromAddress}>`

  try {
    const payload = await getPayload({ config })
    await payload.sendEmail({
      from: fromEmail,
      to: 'nietsemorej@gmail.com',
      cc: process.env.RESEND_DEFAULT_CC_ADDRESS,
      subject: 'Test Email',
      html: '<p>This is a test email from your application.</p>',
    })
    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, message: 'Failed to send email' }
  }
}
