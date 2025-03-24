'use server'

import { createClient } from './supabase/server'
import { FormData } from '../components/ApplicationForm/types'
import { formatUtils } from '../components/ApplicationForm/utils'
import { getApplicationConfirmationEmailHTML } from './email/config'
import { sendEmail } from './email/actions'

export async function createAETSubmission(formData: FormData) {
  const client = await createClient()
  const { error } = await client.from('fce_applications').insert(formData)
  if (error) throw error
}

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
    let service: string = 'Professional Experience Evaluation'
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
      return ['info@americantranslationservice.com', 'ca2@aet21.com']
    default:
      return ['ca2@aet21.com']
  }
}

function getDeliveryMethod(
  deliveryMethod:
    | 'no_delivery_needed'
    | 'usps_first_class_domestic'
    | 'usps_first_class_international'
    | 'usps_priority_domestic'
    | 'usps_express_domestic'
    | 'ups_express_domestic'
    | 'usps_express_international'
    | 'fedex_express_international'
    | undefined
): string {
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
        paid_at,
        due_amount
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
      due_amount: data.due_amount,
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
