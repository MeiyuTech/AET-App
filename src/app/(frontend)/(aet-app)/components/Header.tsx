'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

// Navigation data based on the HTML structure
const navigationItems = [
  { title: 'Home', href: 'https://www.americantranslationservice.com/' },
  { title: 'Evaluation', href: '  https://www.americantranslationservice.com/e-evaluation.php' },
  {
    title: 'Services',
    items: [
      {
        title: 'Certified Translation',
        href: 'https://www.americantranslationservice.com/e-notarized.php',
      },
      {
        title: 'Technical Translation',
        href: 'https://www.americantranslationservice.com/e-tech-translation.php',
      },
      {
        title: 'Interpretation',
        href: 'https://www.americantranslationservice.com/e-interpretation.php',
      },
      {
        title: 'Visa Services',
        href: 'https://www.americantranslationservice.com/e-visaservice.php',
      },
      {
        title: 'Expert Opinion Letters',
        href: 'https://www.americantranslationservice.com/e-expert-opinion-letter.php',
      },
      {
        title: 'Editing/Proofreading',
        href: 'https://www.americantranslationservice.com/e-writing.php',
      },
      {
        title: 'General Translation',
        href: 'https://www.americantranslationservice.com/e-translation.php',
      },
      {
        title: 'Notarization',
        href: 'https://www.americantranslationservice.com/e-nus.php',
      },
      {
        title: 'China Consular Authentication',
        href: 'https://www.americantranslationservice.com/e-authentication.php',
      },
    ],
  },
  { title: 'Contact', href: 'https://www.americantranslationservice.com/e-contact.php' },
  { title: 'About', href: 'https://www.americantranslationservice.com/e-aboutus.php' },
  { title: 'Blog', href: 'https://www.americantranslationservice.com/blog' },
]

const languages = [
  { code: 'en', name: 'English', display: 'EN' },
  { code: 'zh', name: '中文', display: '中文' },
  { code: 'es', name: 'Español', display: 'ES' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    // Add language switching logic here
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="flex h-[100px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/aet_e_logo.png"
              alt="American Education and Translation Services Logo"
              width={400}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 px-3 py-2"
                  style={{
                    fontFamily: 'Verdana, sans-serif',
                    color: '#00438F',
                    fontSize: '16px',
                  }}
                >
                  <Globe className="h-4 w-4" />
                  <span className="font-normal">
                    {languages.find((lang) => lang.code === currentLanguage)?.display}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`px-4 py-3 ${currentLanguage === language.code ? 'bg-accent' : ''}`}
                    style={{
                      fontFamily: 'Verdana, sans-serif',
                      color: '#00438F',
                      fontSize: '16px',
                    }}
                  >
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger
                          className="h-auto px-[15px] py-[12px] text-base font-normal"
                          style={{
                            fontFamily: 'Verdana, sans-serif',
                            color: '#00438F',
                          }}
                        >
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4">
                            {item.items.map((subItem) => (
                              <NavigationMenuLink key={subItem.title} asChild>
                                <Link
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground my-[2px] mx-[8px]"
                                  style={{
                                    fontFamily: 'Verdana, sans-serif',
                                    color: '#00438F',
                                    fontSize: '14px',
                                    padding: '12px 20px',
                                  }}
                                >
                                  <div className="font-normal leading-none">{subItem.title}</div>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group inline-flex h-auto w-max items-center justify-center rounded-md bg-background px-[15px] py-[12px] text-base font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                          style={{
                            fontFamily: 'Verdana, sans-serif',
                            color: '#00438F',
                          }}
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* Mobile Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 px-2 py-1"
                  style={{
                    fontFamily: 'Verdana, sans-serif',
                    color: '#00438F',
                    fontSize: '14px',
                  }}
                >
                  <Globe className="h-4 w-4" />
                  <span className="font-normal">
                    {languages.find((lang) => lang.code === currentLanguage)?.display}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[100px]">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`px-3 py-2 ${currentLanguage === language.code ? 'bg-accent' : ''}`}
                    style={{
                      fontFamily: 'Verdana, sans-serif',
                      color: '#00438F',
                      fontSize: '14px',
                    }}
                  >
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {navigationItems.map((item) => (
                    <div key={item.title}>
                      {item.items ? (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">
                            {item.title}
                          </div>
                          <div className="ml-4 space-y-2">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className="block hover:text-primary my-[2px] mx-[8px]"
                                style={{
                                  fontFamily: 'Verdana, sans-serif',
                                  color: '#00438F',
                                  fontSize: '14px',
                                  padding: '12px 20px',
                                }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="block text-base font-normal hover:text-primary px-[15px] py-[12px]"
                          style={{
                            fontFamily: 'Verdana, sans-serif',
                            color: '#00438F',
                          }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
