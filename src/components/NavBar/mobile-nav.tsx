'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { navigationData } from './nav-data'
import { NavSection } from './nav-section'

interface MobileNavProps {
  isOpen: boolean
  setIsOpenAction: (open: boolean) => void
}

export function MobileNav({ isOpen, setIsOpenAction }: MobileNavProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleLinkClick = () => {
    setIsOpenAction(false)
  }

  // Get current section data
  const currentSection = navigationData.find((section) => section.title === activeSection)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpenAction}>
      <SheetContent side="right" className="w-full border-none bg-background p-0">
        <SheetHeader className="border-b border-border/10 p-4">
          <SheetTitle className="flex items-center justify-between">
            {activeSection ? (
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-0 font-medium text-[15px]"
                onClick={() => setActiveSection(null)}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                返回
              </Button>
            ) : (
              <span className="text-[15px] font-medium">菜单</span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col p-4">
            {!activeSection ? (
              <>
                {navigationData.map((section) => (
                  <Button
                    key={section.title}
                    variant="ghost"
                    className="flex items-center justify-between rounded-none px-4 py-6"
                    onClick={() => setActiveSection(section.title)}
                  >
                    {section.title}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </>
            ) : (
              <div className="space-y-6">
                {currentSection?.items?.map((section) => (
                  <NavSection
                    key={section.title}
                    title={section.title}
                    items={section.items || []}
                    onLinkClick={handleLinkClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
