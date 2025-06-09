'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect } from 'react'

interface Education {
  school_name: string
  degree_obtained: string
  country_of_study: string
  duration?: string
  study_start_date?: { year: string; month: string }
  study_end_date?: { year: string; month: string }
}

interface DegreeEquivalencyAIProps {
  education: Education
  ocrText?: string
  showReasoning?: boolean
}

export function DegreeEquivalencyAI({
  education,
  ocrText,
  showReasoning = false,
}: DegreeEquivalencyAIProps) {
  // console.log('DegreeEquivalencyAI: Received education data:', education)

  const { messages, reload, error, status } = useChat({
    api: '/api/degree-equivalency',
    body: {
      education: {
        school_name: education.school_name,
        degree_obtained: education.degree_obtained,
        country_of_study: education.country_of_study,
        duration: education.duration,
        study_start_date: education.study_start_date,
        study_end_date: education.study_end_date,
      },
      ocrText,
    },
    initialMessages: [
      {
        role: 'user',
        content: 'Evaluate degree equivalency',
        id: '1',
      },
    ],
  })

  // console.log('DegreeEquivalencyAI: Chat status:', status)
  // console.log('DegreeEquivalencyAI: Messages:', messages)
  if (error) {
    console.error('DegreeEquivalencyAI: Error:', error)
  }

  useEffect(() => {
    // console.log('DegreeEquivalencyAI: Triggering reload')
    reload()
  }, [reload, ocrText])

  // Parse result/reasoning
  let result = '',
    reasoning = ''
  const lastMessage = messages[messages.length - 1]?.content
  if (lastMessage) {
    try {
      const parsed = JSON.parse(lastMessage)
      result = parsed.result || ''
      reasoning = parsed.reasoning || ''
    } catch {
      // 更健壮的正则，兼容无换行、单换行、空格等
      const match = lastMessage.match(/RESULT:\s*([^\n\r]*)[\n\r ]*REASONING:\s*([\s\S]*)/i)
      if (match) {
        result = match[1].trim()
        reasoning = match[2].trim()
      } else {
        result = lastMessage.trim()
      }
    }
  }

  return (
    <div>
      <div className="font-bold text-blue-900 text-lg mb-2">{result || 'Evaluating...'}</div>
      {showReasoning && reasoning && (
        <div className="p-4 bg-gray-50 border rounded">
          <div className="font-bold text-purple-800 text-lg mb-1">Reasoning</div>
          <div className="text-purple-800 text-lg whitespace-pre-line">{reasoning}</div>
        </div>
      )}
    </div>
  )
}
