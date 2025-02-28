'use server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { createClient } from './supabase/server'
import { FormData } from '../components/ApplicationForm/types'
import { formatUtils } from '../components/ApplicationForm/utils'

export async function createAETSubmission(formData: FormData) {
  const client = await createClient()
  const { error } = await client.from('fce_applications').insert(formData)
  if (error) throw error
}

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  cc?: string | string[]
  bcc?: string | string[]
}

async function sendEmail({ to, subject, html, cc, bcc }: EmailOptions) {
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

function getServiceDeliveryTime(serviceType: FormData['serviceType']) {
  const deliveryTimes: string[] = []

  // FCE Service
  if (serviceType.foreignCredentialEvaluation.firstDegree.speed) {
    const speedMap = {
      sameday: 'same day',
      '24hour': '24 hours',
      '3day': '3 business days',
      '7day': '7 business days',
    }
    deliveryTimes.push(
      `Foreign Credential Evaluation: ${speedMap[serviceType.foreignCredentialEvaluation.firstDegree.speed]}`
    )
  }

  // Course by Course
  if (serviceType.coursebyCourse.firstDegree.speed) {
    const speedMap = {
      '24hour': '24 hours',
      '3day': '3 business days',
      '5day': '5 business days',
      '8day': '8 business days',
    }
    deliveryTimes.push(
      `Course by Course Evaluation: ${speedMap[serviceType.coursebyCourse.firstDegree.speed]}`
    )
  }

  // Professional Experience
  if (serviceType.professionalExperience.speed) {
    const speedMap = {
      '3day': '3 business days',
      '7day': '7 business days',
      '21day': '21 business days',
    }
    deliveryTimes.push(
      `Professional Experience Evaluation: ${speedMap[serviceType.professionalExperience.speed]}`
    )
  }

  // Position Evaluation
  if (serviceType.positionEvaluation.speed) {
    const speedMap = {
      '2day': '2 business days',
      '3day': '3 business days',
      '5day': '5 business days',
      '10day': '10 business days',
    }
    deliveryTimes.push(`Position Evaluation: ${speedMap[serviceType.positionEvaluation.speed]}`)
  }

  return deliveryTimes
}

function generateServiceDescription(serviceType: FormData['serviceType']) {
  const services: string[] = []

  if (serviceType.foreignCredentialEvaluation.firstDegree.speed) {
    const additionalDegrees =
      serviceType.foreignCredentialEvaluation.secondDegrees > 0
        ? ` plus ${serviceType.foreignCredentialEvaluation.secondDegrees} additional degree(s)`
        : ''
    services.push(`Foreign Credential Evaluation${additionalDegrees}`)
  }

  if (serviceType.coursebyCourse.firstDegree.speed) {
    const additionalDegrees =
      serviceType.coursebyCourse.secondDegrees > 0
        ? ` plus ${serviceType.coursebyCourse.secondDegrees} additional degree(s)`
        : ''
    services.push(`Course by Course Evaluation${additionalDegrees}`)
  }

  if (serviceType.professionalExperience.speed) {
    services.push('Professional Experience Evaluation')
  }

  if (serviceType.positionEvaluation.speed) {
    services.push('Position Evaluation')
  }

  if (serviceType.translation.required) {
    services.push('Document Translation')
  }

  return services
}

function generateApplicationConfirmationEmail(
  formData: FormData,
  applicationId: string,
  submittedAt: string
): string {
  const services = generateServiceDescription(formData.serviceType)
  const deliveryTimes = getServiceDeliveryTime(formData.serviceType)
  const submissionDate = new Date(submittedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1 style="color: #7bc1f4;">Your Application Has Been Received</h1>
      <p>Dear ${formData.firstName} ${formData.lastName},</p>
      <p>We have received your application. Your application ID is: <strong style="color: #7bc1f4">${applicationId}</strong></p>

      <h2 style="color: #7bc1f4;">Submission Time:</h2>
      <ul>
        <li>${submissionDate}</li>
      </ul>
      <h2 style="color: #7bc1f4;">Services Requested:</h2>
      <ul>
        ${services.map((service) => `<li>${service}</li>`).join('')}
      </ul>

      <h2 style="color: #7bc1f4;">Expected Delivery Times:</h2>
      <ul>
        ${deliveryTimes.map((time) => `<li>${time}</li>`).join('')}
      </ul>

      <h2 style="color: #7bc1f4;">Additional Details:</h2>
      <ul>
        <li>Delivery Method: ${formData.deliveryMethod}</li>
        ${
          formData.additionalServices.length > 0
            ? `<li>Additional Services: ${formData.additionalServices.join(', ')}</li>`
            : ''
        }
      </ul>

      <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0;">
        <h2 style="color: #7bc1f4;">Next Steps:</h2>
        <ul>
          <li>Complete the payment process if you haven't already</li>
          <li>Submit all required documents as specified in your application</li>
          <li>We will begin processing your evaluation once payment is confirmed</li>
        </ul>
      </div>

      <p>
        If you have any questions or need to provide additional information, please contact us and reference your application ID: 
        <strong style="color: #7bc1f4">${applicationId}</strong>
      </p>

      <p style="margin-top: 30px;">
        Best regards,<br>
        <span >AET Services Team</span>
      </p>
    </div>
  `
}

export async function submitAETApplication(formData: FormData) {
  try {
    const client = await createClient()

    console.log('Original form data:', formData)
    const dbData = formatUtils.toDatabase(formData, 3, 'submitted')
    console.log('Converted database data:', dbData)

    // Start database transaction
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

    // Insert education records
    const educationPromises = formData.educations?.map((education) =>
      client.from('fce_educations').insert({
        application_id: application.id,
        ...formatUtils.toEducationDatabase(education),
      })
    )

    if (educationPromises) {
      await Promise.all(educationPromises)
    }

    // Send confirmation email using the new email content generator
    await sendEmail({
      to: formData.email,
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      // TODO: remove (test) after it's ready
      subject: '(test)AET Services Application Confirmation',
      html: generateApplicationConfirmationEmail(
        formData,
        application.id,
        application.submitted_at
      ),
    })

    return {
      success: true,
      applicationId: application.id,
    }
  } catch (error) {
    console.error('Failed to submit AET application:', error)
    throw new Error('Failed to submit application')
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

export async function verifyApplication(applicationId: string) {
  try {
    const client = await createClient()

    // get the application data
    const { data, error } = await client
      .from('fce_applications')
      .select(
        `
        id,
        status,
        submitted_at,
        name,
        country,
        street_address,
        street_address2,
        city,
        region,
        zip_code,
        fax,
        phone,
        email,
        office,
        purpose,
        purpose_other,
        pronouns,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        service_type,
        delivery_method,
        additional_services,
        additional_services_quantity,
        payment_status,
        payment_id,
        paid_at
      `
      )
      .eq('id', applicationId)
      .single()

    if (error) {
      console.error('Error verifying application:', error)
      return { exists: false }
    }

    // get the education data
    const { data: educationsData, error: educationsError } = await client
      .from('fce_educations')
      .select(
        `
        country_of_study,
        degree_obtained,
        school_name,
        study_start_date,
        study_end_date
      `
      )
      .eq('application_id', applicationId)

    if (educationsError) {
      console.error('Error fetching educations:', educationsError)
      return { exists: false }
    }

    // Transform database field names to frontend field names
    const formattedData = {
      // Status Info
      status: data.status,
      submitted_at: data.submitted_at,
      payment_status: data.payment_status,
      payment_id: data.payment_id,
      paid_at: data.paid_at,

      // Client Info
      name: data.name,
      country: data.country,
      streetAddress: data.street_address,
      streetAddress2: data.street_address2,
      city: data.city,
      region: data.region,
      zipCode: data.zip_code,
      fax: data.fax,
      phone: data.phone,
      office: data.office,
      email: data.email,
      purpose: data.purpose,
      purposeOther: data.purpose_other,

      // Evaluee Info
      pronouns: data.pronouns,
      firstName: data.first_name,
      middleName: data.middle_name,
      lastName: data.last_name,
      dateOfBirth: data.date_of_birth,

      // Service Info
      serviceType: data.service_type,
      deliveryMethod: data.delivery_method,
      additionalServices: data.additional_services,
      additionalServicesQuantity: data.additional_services_quantity,

      // Education Info
      educations: educationsData.map((edu: any) => ({
        countryOfStudy: edu.country_of_study,
        degreeObtained: edu.degree_obtained,
        schoolName: edu.school_name,
        studyDuration: {
          startDate: edu.study_start_date,
          endDate: edu.study_end_date,
        },
      })),
    }

    return {
      exists: true,
      application: formattedData,
    }
  } catch (error) {
    console.error('Failed to verify application:', error)
    return { exists: false }
  }
}
