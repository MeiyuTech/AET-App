import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface NavSectionProps {
  title: string
  items: {
    title: string
    href?: string
    description?: string
  }[]
  onLinkClick?: () => void
}

export function NavSection({ title, items, onLinkClick }: NavSectionProps) {
  return (
    <div>
      <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-foreground/60">
        {title}
      </h3>
      <div className="grid gap-2">
        {items.map((item) => (
          <Button
            key={item.title}
            variant="ghost"
            className={`${item.description ? 'h-auto w-full' : 'justify-start'} px-0 hover:bg-foreground/5`}
            onClick={onLinkClick}
          >
            {item.href ? (
              <Link href={item.href} className={item.description ? 'w-full text-left' : ''}>
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="mt-1 text-xs text-foreground/60">{item.description}</div>
                )}
              </Link>
            ) : (
              item.title
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
