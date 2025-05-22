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
        : '未提供'

    const prompt = `作为一个教育评估专家，请根据以下信息评估该学位在美国的等效性：

学校名称：${education.school_name}
学位名称：${education.degree_obtained}
学习国家：${education.country_of_study}
学习时长：${duration}

请提供：
1. 最接近的美国学位等效性
2. 简要解释评估依据
3. 任何需要注意的特殊情况或限制

请用专业但易懂的语言回答。`

    console.log('Degree Equivalency API: Generated prompt:', prompt)

    const result = streamText({
      model: openai('gpt-4'),
      messages: [
        {
          role: 'system',
          content: '你是一个专业的教育评估专家，专门负责评估国际学位与美国学位的等效性。',
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
