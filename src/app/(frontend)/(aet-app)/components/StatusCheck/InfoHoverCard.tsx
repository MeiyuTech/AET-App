'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface InfoHoverCardProps {
  title: string
  content: React.ReactNode
}

export default function InfoHoverCard({ title, content }: InfoHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>
          <span className="inline-flex items-center gap-1 cursor-pointer text-gray-500 hover:text-blue-900 transition-colors">
            <strong>{title}</strong>
            {/* Info icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">{content}</div>
      </HoverCardContent>
    </HoverCard>
  )
}
