'use server'

import { createClient } from './supabase/server'
import { FormData, ApplicationData } from '../components/FCEApplicationForm/types'
import { formatUtils } from '../components/FCEApplicationForm/utils'
import { sendApplicationConfirmationEmail } from './email/actions'

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
    const educationPromises = formData.educations?.map((education) =>
      client.from('fce_educations').insert({
        application_id: databaseApplication.id,
        ...formatUtils.toEducationDatabase(education),
      })
    )

    if (educationPromises) {
      await Promise.all(educationPromises)
    }

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
 * Fetch and format AET application data:
 * 1. Get application data from database
 * 2. Get education data from database
 * 3. Transform database field names to frontend field names
 * @param applicationId - Application ID
 * @returns - { success: true, application: formattedData }
 * @throws - Error if failed to fetch application
 */
export async function fetchApplication(applicationId: string) {
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
