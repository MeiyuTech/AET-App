'use server'

import { createClient } from './supabase/server'
import { FormData, ApplicationData } from '../components/FCEApplicationForm/types'
import { formatUtils } from '../components/FCEApplicationForm/utils'
import { FormData as DegreeEquivalencyFormData } from '../components/DegreeEquivalencyForm/types'
import { formatUtils as DegreeEquivalencyFormatUtils } from '../components/DegreeEquivalencyForm/utils'
import { sendApplicationConfirmationEmail } from './email/actions'
import { Application } from '../components/ApplicationsTable/types'

export async function getFCEApplicationEmail(applicationId: string) {
  const client = await createClient()
  const { data: application, error: applicationError } = await client
    .from('fce_applications')
    .select('email')
    .eq('id', applicationId)
    .single()

  if (applicationError) {
    console.error('Error fetching application email:', applicationError)
    throw applicationError
  }

  return application.email
}

/**
 * Submit AET Core Application:
 * 1. Convert form data to database format
 * 2. Insert application data into database
 * 3. Insert education data into database
 * 4. Send confirmation email
 * @param formData - Form data
 * @returns - { success: true, applicationId: string }
 * @throws - Error if failed to submit application
 */
export async function submitAETCoreApplication(formData: DegreeEquivalencyFormData) {
  try {
    const client = await createClient()

    console.log('Original form data:', formData)
    const dbData = DegreeEquivalencyFormatUtils.toDatabase(formData, 3, 'submitted')
    console.log('Converted Core Application database data:', dbData)

    // Start database transaction
    const { data: databaseApplication, error: databaseApplicationError } = await client
      .from('aet_core_applications')
      .insert({
        ...dbData,
      })
      .select()
      .single()

    if (databaseApplicationError) {
      console.error('Core Application insert error:', databaseApplicationError)
      throw databaseApplicationError
    }

    // Insert education records
    const educationPromises = formData.educations?.map((education, idx) => {
      console.log(`[Education Insert][${idx}] Original:`, education)
      const dbEducation = DegreeEquivalencyFormatUtils.toEducationDatabase(education)
      console.log(`[Education Insert][${idx}] To DB:`, dbEducation)
      return client
        .from('aet_core_educations')
        .insert({
          application_id: databaseApplication.id,
          ...dbEducation,
        })
        .then(
          (result) => {
            console.log(`[Education Insert][${idx}] Insert result:`, result)
            return result
          },
          (err) => {
            console.error(`[Education Insert][${idx}] Insert error:`, err)
            throw err
          }
        )
    })

    if (educationPromises) {
      await Promise.all(educationPromises)
    }

    // TODO: Send confirmation email
    // console.log('Sending application confirmation email...')
    // const { success: emailSuccess, message: sendEmailMessage } =
    //   await sendApplicationConfirmationEmail(databaseApplication.id)

    // if (!emailSuccess) {
    //   console.error('Failed to send confirmation email:', sendEmailMessage)
    //   throw new Error('Failed to send confirmation email')
    // }

    return {
      success: true,
      applicationId: databaseApplication.id,
    }
  } catch (error) {
    console.error('Failed to submit AET application:', error)
    throw new Error('Failed to submit application')
  }
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
    const dbData = formatUtils.toDatabase(formData, 3, 'submitted', new Date().toISOString())
    console.log('Converted database data:', dbData)

    // Start database transaction
    const { data: databaseApplication, error: databaseApplicationError } = await client
      .from('fce_applications')
      .insert({
        ...dbData,
      })
      .select()
      .single()

    if (databaseApplicationError) {
      console.error('Application insert error:', databaseApplicationError)
      throw databaseApplicationError
    }

    // Insert education records
    const educationPromises = formData.educations?.map((education, idx) => {
      console.log(`[Education Insert][${idx}] Original:`, education)
      const dbEducation = formatUtils.toEducationDatabase(education)
      console.log(`[Education Insert][${idx}] To DB:`, dbEducation)
      return client
        .from('fce_educations')
        .insert({
          application_id: databaseApplication.id,
          ...dbEducation,
        })
        .then(
          (result) => {
            console.log(`[Education Insert][${idx}] Insert result:`, result)
            return result
          },
          (err) => {
            console.error(`[Education Insert][${idx}] Insert error:`, err)
            throw err
          }
        )
    })

    if (educationPromises) {
      await Promise.all(educationPromises)
    }

    console.log('Sending application confirmation email...')
    const { success: emailSuccess, message: sendEmailMessage } =
      await sendApplicationConfirmationEmail(databaseApplication.id)

    if (!emailSuccess) {
      console.error('Failed to send confirmation email:', sendEmailMessage)
      throw new Error('Failed to send confirmation email')
    }

    return {
      success: true,
      applicationId: databaseApplication.id,
    }
  } catch (error) {
    console.error('Failed to submit AET application:', error)
    throw new Error('Failed to submit application')
  }
}

/**
 * Fetch and format AET FCE application data:
 * 1. Get application data from database
 * 2. Get education data from database
 * 3. Transform database field names to frontend field names
 * @param applicationId - Application ID
 * @returns - { success: true, application: formattedData }
 * @throws - Error if failed to fetch application
 */
export async function fetchFCEApplication(applicationId: string) {
  try {
    const client = await createClient()

    // get the application data from the database
    const { data: databaseApplication, error: databaseApplicationError } = await client
      .from('fce_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (databaseApplicationError) {
      console.error(
        'Error verifying and fetching application in database:',
        databaseApplicationError
      )
      return { success: false }
    }

    // get the education data from the database
    const { data: databaseEducations, error: databaseEducationsError } = await client
      .from('fce_educations')
      .select('*')
      .eq('application_id', applicationId)

    if (databaseEducationsError) {
      console.error('Error fetching educations:', databaseEducationsError)
      return { success: false }
    }

    // Transform database field names to frontend field names
    const formattedData = {
      ...formatUtils.toFormData(
        databaseApplication,
        databaseApplication.status,
        databaseApplication.submitted_at,
        databaseApplication.due_amount,
        databaseApplication.payment_status,
        databaseApplication.payment_id,
        databaseApplication.paid_at
      ),
      educations: databaseEducations.map((edu) => formatUtils.toEducationFormData(edu)),
    } as ApplicationData

    return {
      success: true,
      applicationData: formattedData,
    }
  } catch (error) {
    console.error('Failed to fetch and format application:', error)
    return { success: false }
  }
}

interface FetchApplicationsListResult {
  success: boolean
  applications?: Application[]
  error?: string
}

/**
 * Fetch applications list with filter:
 * 1. Get applications data from database with filter
 * 2. Get related educations data
 * 3. Get external orders data
 * @param filter - SQL filter string
 * @returns - FetchApplicationsListResult
 */
export async function fetchApplicationsList(filter: string): Promise<FetchApplicationsListResult> {
  try {
    const client = await createClient()

    // Verify if filter is valid
    const isValidFilter = (filter: string) => {
      return filter && /^[a-zA-Z0-9.,= ]*$/.test(filter)
    }

    if (!isValidFilter(filter)) {
      throw new Error('Invalid filter format')
    }

    // Get fce_applications data
    const { data: applications, error: applicationsError } = await client
      .from('fce_applications')
      .select(
        `
        *,
        educations:fce_educations(*)
      `
      )
      .or(filter)
      .order('created_at', { ascending: false })

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      return { success: false, error: 'Failed to fetch applications' }
    }

    // Get fce_external_orders data
    const { data: externalOrders, error: externalOrdersError } = await client
      .from('fce_external_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (externalOrdersError) {
      console.error('Error fetching external orders:', externalOrdersError)
      return { success: false, error: 'Failed to fetch external orders' }
    }

    // Convert external orders to applications format
    const convertedOrders = externalOrders.map((order) => ({
      id: order.id,
      status: order.status,
      first_name: order.first_name,
      middle_name: order.middle_name,
      last_name: order.last_name,
      purpose: order.purpose,
      office: order.office,
      due_amount: order.due_amount,
      payment_status: 'paid', // Use db value with fallback
      payment_id: null,
      paid_at: order.paid_at,
      created_at: order.created_at,
      updated_at: order.updated_at,
      submitted_at: order.created_at,
      // Set default values for other fields
      name: `${order.first_name} ${order.last_name}`,
      country: 'United States',
      street_address: 'Imported Order',
      street_address2: null,
      city: 'Imported',
      region: 'CA',
      zip_code: '00000',
      phone: '0000000000',
      fax: null,
      email: 'noemail@aet-translation.com',
      purpose_other: null,
      pronouns: 'mx',
      date_of_birth: null,
      service_type: {
        foreignCredentialEvaluation: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        coursebyCourse: {
          firstDegree: { speed: undefined },
          secondDegrees: 0,
        },
        professionalExperience: { speed: undefined },
        positionEvaluation: { speed: undefined },
        translation: { required: false },
        customizedService: { required: false },
      },
      delivery_method: 'no_delivery_needed',
      additional_services: [],
      additional_services_quantity: {
        extra_copy: 0,
        pdf_with_hard_copy: 0,
        pdf_only: 0,
      },
      // Add a flag to distinguish the source
      source: 'external',
      notes: order.notes,
    }))

    // Merge the data from the two tables
    const allApplications = [
      ...applications.map((app) => ({ ...app, source: 'internal' })),
      ...convertedOrders,
    ]

    return {
      success: true,
      applications: allApplications || [],
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch applications',
    }
  }
}

/**
 * Fetch and format AET application data:
 * 1. Get application data from database
 * 2. Get education data from database
 * 3. Transform database field names to frontend field names
 * @param id - Database ID
 * @returns - { success: true, payment: formattedData }
 * @throws - Error if failed to fetch payment
 */
export async function fetchPayment(id: string) {
  try {
    const client = await createClient()

    // get the application data from the database
    const { data: databasePayment, error: databasePaymentError } = await client
      .from('aet_core_payments')
      .select('*')
      .eq('id', id)
      .single()

    if (databasePaymentError) {
      console.error('Error verifying and fetching payment in database:', databasePaymentError)
      return { success: false }
    }

    return {
      success: true,
      paymentData: databasePayment,
    }
  } catch (error) {
    console.error('Failed to fetch payment:', error)
    return { success: false }
  }
}

interface Payment {
  id: string
  application_id: string
  due_amount: number
  payment_status: string
  paid_at: string
  payment_id: string
  source: string
}

interface FetchPaymentsListResult {
  success: boolean
  payments?: Payment[]
  error?: string
}

/**
 * Fetch payments list:
 * 1. Get payments data from database
 * @returns - FetchPaymentsListResult
 */
export async function fetchPaymentsList(): Promise<FetchPaymentsListResult> {
  try {
    const client = await createClient()

    // Get payments data from database
    const { data: payments, error: paymentsError } = await client
      .from('aet_core_payments')
      .select('*')
      .order('paid_at', { ascending: false })

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
      return { success: false, error: 'Failed to fetch payments' }
    }

    return {
      success: true,
      payments: payments || [],
    }
  } catch (error) {
    console.error('Failed to fetch payments:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payments',
    }
  }
}

export async function fetchAETCoreApplication(applicationId: string) {
  const client = await createClient()

  // Fetch application data
  const { data: application, error: applicationError } = await client
    .from('aet_core_applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (applicationError) {
    console.error('Error fetching degree equivalency application:', applicationError)
    return { success: false, applicationData: null }
  }

  // Fetch education data
  const { data: education, error: educationError } = await client
    .from('aet_core_educations')
    .select('*')
    .eq('application_id', applicationId)
    .single()

  if (educationError) {
    console.error('Error fetching education data:', educationError)
    return { success: false, applicationData: null }
  }

  // Combine application and education data
  const applicationData = {
    ...application,
    education,
  }

  return { success: true, applicationData }
}

export async function fetchAETCoreApplicationsList() {
  const client = await createClient()
  // 1. Fetch applications
  const { data: applications, error: appError } = await client
    .from('aet_core_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (appError || !applications) return { success: false, error: appError?.message || 'No data' }

  const appIds = applications.map((a: any) => a.id)

  // 2. Fetch educations
  const { data: educations } = await client
    .from('aet_core_educations')
    .select('*')
    .in('applicationId', appIds)

  // 3. Fetch payments
  const { data: payments } = await client
    .from('aet_core_payments')
    .select('*')
    .in('applicationId', appIds)

  // 4. Merge Data
  const merged = applications.map((app: any) => {
    const appEducations = educations?.filter((e: any) => e.applicationId === app.id) || []
    const appPayments = payments?.filter((p: any) => p.applicationId === app.id) || []
    const payment = appPayments[0] || {}
    return {
      ...app,
      educations: appEducations,
      dueAmount: payment.dueAmount ?? null,
      paymentStatus: payment.paymentStatus ?? null,
      paidAt: payment.paidAt ?? null,
      paymentId: payment.paymentId ?? null,
    }
  })
  return { success: true, applications: merged }
}
