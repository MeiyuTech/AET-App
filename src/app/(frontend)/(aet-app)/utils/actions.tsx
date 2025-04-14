'use server'

import { createClient } from './supabase/server'
import { FormData, ApplicationData } from '../components/FCEApplicationForm/types'
import { formatUtils } from '../components/FCEApplicationForm/utils'
import { getApplicationConfirmationEmailHTML, resendEmail } from './email/actions'
import { getCCAddress, getDeliveryMethod, getServiceDescription } from './email/utils'

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
    const { success: emailSuccess, message: sendEmailMessage } = await resendEmail({
      to: formData.email,
      cc: formData.email === 'tech@meiyugroup.org' ? undefined : getCCAddress(application.office),
      bcc: process.env.RESEND_DEFAULT_BCC_ADDRESS!,
      subject: 'AET Services Application Confirmation',
      html: await getApplicationConfirmationEmailHTML(application.id, application),
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
