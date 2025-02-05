'use server'

import { createClient } from '@/app/(frontend)/(fce-form)/utils/supabase/server'
import { FormData } from '@/app/(frontend)/(fce-form)/components/FCE-Form/types'
import { formatUtils } from '@/app/(frontend)/(fce-form)/components/FCE-Form/utils'

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
    const dbData = formatUtils.toDatabase(formData, 3, 'completed')
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

    return { success: true, applicationId: application.id }
  } catch (error) {
    console.error('Failed to submit FCE application:', error)
    throw new Error('Failed to submit application')
  }
}
