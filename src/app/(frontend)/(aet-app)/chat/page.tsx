'use client'

import { Chatbot } from '@/app/(frontend)/(aet-app)/components/Chatbot/Chatbot'

export default function ChatPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8 px-4 md:px-6 pt-16">
        <h1 className="text-3xl font-bold text-center">AI Assistant</h1>
        <p className="text-center text-gray-600 mb-8">
          Chat with our AI assistant for help with your questions
        </p>

        <Chatbot />
      </div>
    </div>
  )
}
