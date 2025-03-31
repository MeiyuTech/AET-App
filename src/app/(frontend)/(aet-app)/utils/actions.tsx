'use server'

import { createClient } from './supabase/server'
import { DeliveryMethod, FormData } from '../components/FCEApplicationForm/types'
import { formatUtils } from '../components/FCEApplicationForm/utils'
import { getApplicationConfirmationEmailHTML } from './email/config'
import { sendEmail } from './email/actions'

function generateServiceDescription(serviceType: FormData['serviceType']) {
  const services: string[] = []

  // Customized Service
  if (serviceType.customizedService.required) {
    services.push('Customized Service: Delivery Time Will Be Quoted Upon Request')
  }

  // Foreign Credential Evaluation
  if (serviceType.foreignCredentialEvaluation.firstDegree.speed) {
    let service: string = 'Foreign Credential Evaluation'
    const additionalDegrees =
      serviceType.foreignCredentialEvaluation.secondDegrees > 0
        ? ` plus ${serviceType.foreignCredentialEvaluation.secondDegrees} additional degree(s)`
        : ''
    service += `${additionalDegrees} :`

    const speedMap = {
      sameday: 'same day',
      '24hour': '24 hours',
      '3day': '3 business days',
      '7day': '7 business days',
    }
    service += ` ${speedMap[serviceType.foreignCredentialEvaluation.firstDegree.speed]}`
    services.push(service)
  }

  // Course by Course
  if (serviceType.coursebyCourse.firstDegree.speed) {
    let service: string = 'Course by Course Evaluation'
    const additionalDegrees =
      serviceType.coursebyCourse.secondDegrees > 0
        ? ` plus ${serviceType.coursebyCourse.secondDegrees} additional degree(s)`
        : ''
    service += `${additionalDegrees} :`

    const speedMap = {
      '24hour': '24 hours',
      '3day': '3 business days',
      '5day': '5 business days',
      '8day': '8 business days',
    }
    service += ` ${speedMap[serviceType.coursebyCourse.firstDegree.speed]}`
    services.push(service)
  }

  // Professional Experience
  if (serviceType.professionalExperience.speed) {
    // TODO: rename to Expert Opinion Letter
    // let service: string = 'Professional Experience Evaluation'
    let service: string = 'Expert Opinion Letter'
    const speedMap = {
      '3day': '3 business days',
      '7day': '7 business days',
      '21day': '21 business days',
    }
    service += ` ${speedMap[serviceType.professionalExperience.speed]}`
    services.push(service)
  }

  // Position Evaluation
  if (serviceType.positionEvaluation.speed) {
    let service: string = 'Position Evaluation'
    const speedMap = {
      '2day': '2 business days',
      '3day': '3 business days',
      '5day': '5 business days',
      '10day': '10 business days',
    }
    service += ` ${speedMap[serviceType.positionEvaluation.speed]}`
    services.push(service)
  }

  // Document Translation
  if (serviceType.translation.required) {
    services.push('Document Translation: Delivery Time Will Be Quoted Upon Request')
  }

  return services
}

function getCCAddress(office: string) {
  switch (office) {
    case 'Boston':
      return ['boston@aet21.com', 'boston@americantranslationservice.com']
    case 'New York':
      return ['nyc@aet21.com', 'nyc@americantranslationservice.com']
    case 'San Francisco':
      return ['ca@aet21.com']
    case 'Los Angeles':
      return ['ca2@aet21.com']
    case 'Miami':
      return ['info@americantranslationservice.com']
    default:
      return ['ca2@aet21.com']
  }
}

function getDeliveryMethod(deliveryMethod: DeliveryMethod): string {
  const deliveryMethodMap: { [key: string]: string } = {
    no_delivery_needed: 'No Delivery Needed',
    usps_first_class_domestic: 'USPS First Class Domestic',
    usps_first_class_international: 'USPS First Class International',
    usps_priority_domestic: 'USPS Priority Domestic',
    usps_express_domestic: 'USPS Express Domestic',
    ups_express_domestic: 'UPS Express Domestic',
    usps_express_international: 'USPS Express International',
    fedex_express_international: 'FedEx Express International',
  }

  return deliveryMethod ? deliveryMethodMap[deliveryMethod] : 'No Delivery Method Selected'
}

/**
 * Submit AET application:
 * 1. Convert form data to database format
 * 2. Insert application data into database
 * 3. Insert education data into database
 * 4. Send confirmation email
 * @param formData - Form data
 * @returns - { success: true, applicationId: string }
 * @throws - Error if failed to submit application
 */
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
    const { success: emailSuccess, message: sendEmailMessage } = await sendEmail({
      to: formData.email,
      cc: getCCAddress(application.office),
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      subject: 'AET Services Application Confirmation',
      html: getApplicationConfirmationEmailHTML(
        formData.firstName,
        formData.lastName,
        generateServiceDescription(formData.serviceType),
        getDeliveryMethod(formData.deliveryMethod),
        // TODO: use 'additionalServicesQuantity'
        formData.additionalServices,
        application.id,
        application.submitted_at
      ),
    })

    if (!emailSuccess) {
      console.error('Failed to send confirmation email:', sendEmailMessage)
      throw new Error('Failed to send confirmation email')
    }

    return {
      success: true,
      applicationId: application.id,
    }
  } catch (error) {
    console.error('Failed to submit AET application:', error)
    throw new Error('Failed to submit application')
  }
}

/**
 * Verify AET application:
 * 1. Get application data from database
 * 2. Get education data from database
 * 3. Transform database field names to frontend field names
 * @param applicationId - Application ID
 * @returns - { exists: true, application: formattedData }
 * @throws - Error if failed to fetch application
 */
export async function fetchApplication(applicationId: string) {
  try {
    const client = await createClient()

    // get the application data
    const { data: applicationData, error: applicationError } = await client
      .from('fce_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (applicationError) {
      console.error('Error verifying application:', applicationError)
      return { exists: false }
    }

    // get the education data
    const { data: educationsData, error: educationsError } = await client
      .from('fce_educations')
      .select('*')
      .eq('application_id', applicationId)

    if (educationsError) {
      console.error('Error fetching educations:', educationsError)
      return { exists: false }
    }

    // Transform database field names to frontend field names
    const formattedData = {
      // Status Info
      status: applicationData.status,
      submitted_at: applicationData.submitted_at,
      due_amount: applicationData.due_amount,
      payment_status: applicationData.payment_status,
      payment_id: applicationData.payment_id,
      paid_at: applicationData.paid_at,
      ...formatUtils.toFormData(applicationData),
      educations: educationsData.map((edu) => formatUtils.toEducationFormData(edu)),
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
