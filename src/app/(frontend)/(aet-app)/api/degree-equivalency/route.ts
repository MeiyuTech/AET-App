import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    console.log('Degree Equivalency API: Received request')

    if (!req.body) {
      console.error('Degree Equivalency API: No request body')
      return NextResponse.json({ error: 'No request body' }, { status: 400 })
    }

    const { education } = await req.json()
    console.log('Degree Equivalency API: Received education data:', education)

    if (!education) {
      console.error('Degree Equivalency API: No education data in request')
      return NextResponse.json({ error: 'No education data provided' }, { status: 400 })
    }

    const duration =
      education.study_start_date && education.study_end_date
        ? `${education.study_start_date.year}-${education.study_start_date.month} to ${education.study_end_date.year}-${education.study_end_date.month}`
        : 'Not provided'

    const prompt = `As an education evaluation expert, please evaluate the equivalency of this degree in the United States based on the following information:

School Name: ${education.school_name}
Degree Name: ${education.degree_obtained}
Study Country: ${education.country_of_study}
Study Duration: ${duration}

Please provide:
1. The most similar US degree equivalency
2. A brief explanation of the evaluation basis
3. Any special considerations or limitations

Please just output the Equivalency name of the degree, less than 10 words, no other text.`

    console.log('Degree Equivalency API: Generated prompt:', prompt)

    const result = streamText({
      model: openai('gpt-4'),
      messages: [
        {
          role: 'system',
          content:
            'You are a professional education evaluation expert, responsible for evaluating the equivalency of international degrees to US degrees.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    console.log('Degree Equivalency API: Created stream result')
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
