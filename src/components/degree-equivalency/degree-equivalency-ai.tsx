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
}

export function DegreeEquivalencyAI({ education }: DegreeEquivalencyAIProps) {
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
  }, [reload])

  const lastMessage = messages[messages.length - 1]?.content
  // console.log('DegreeEquivalencyAI: Last message:', lastMessage)

  return lastMessage || 'Evaluating...'
}
