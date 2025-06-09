import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    // console.log('Degree Equivalency API: Received request')

    if (!req.body) {
      console.error('Degree Equivalency API: No request body')
      return NextResponse.json({ error: 'No request body' }, { status: 400 })
    }

    const { education, ocrText } = await req.json()
    // console.log('Degree Equivalency API: Received education data:', education)

    if (!education) {
      console.error('Degree Equivalency API: No education data in request')
      return NextResponse.json({ error: 'No education data provided' }, { status: 400 })
    }

    const duration =
      education.study_start_date && education.study_end_date
        ? `${education.study_start_date.year}-${education.study_start_date.month} to ${education.study_end_date.year}-${education.study_end_date.month}`
        : 'Not provided'

    let prompt = `As an education evaluation expert, please evaluate the equivalency of this degree in the United States.`

    if (ocrText) {
      prompt += `\n\nBased on the OCR text from the diploma:\n${ocrText}\n\nPlease use this as the primary source of information.`
    }

    prompt += `\n\nAdditional information from the application form:\nSchool Name: ${education.school_name}\nDegree Name: ${education.degree_obtained}\nStudy Country: ${education.country_of_study}\nStudy Duration: ${duration}`
    prompt += `\n\nPlease provide:\n1. The most similar US degree equivalency (less than 10 words)\n2. A brief explanation of the evaluation basis (up to 200 words)\n\nPlease output in the following format:\nRESULT: <equivalency name>\n\nREASONING: <detailed explanation>`

    console.log('Degree Equivalency API: Generated prompt:', prompt)

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content:
            'You are a professional education evaluation expert, responsible for evaluating the equivalency of international degrees to US degrees. When OCR text is provided, prioritize the information from the diploma over the application form data.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Degree Equivalency API: Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to evaluate degree equivalency',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
