'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/cn'

interface TableOfContentsProps {
  headings: Array<{
    id: string
    text: string
    level: number
  }>
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({})

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      headingElementsRef.current = entries.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement
        return map
      }, headingElementsRef.current)

      const visibleHeadings: IntersectionObserverEntry[] = []
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key]
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement)
      })

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].target.id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
    })

    const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
    headingElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="relative">
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{
              paddingLeft: `${(heading.level - 1) * 1}rem`,
              fontSize:
                heading.level === 1
                  ? '1.1em'
                  : heading.level === 2
                    ? '1em'
                    : heading.level === 3
                      ? '0.9em'
                      : '0.85em',
            }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector(`#${heading.id}`)?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
              className={cn(
                'inline-block py-1 text-muted-foreground no-underline transition-colors hover:text-foreground',
                activeId === heading.id && 'font-medium text-foreground'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
