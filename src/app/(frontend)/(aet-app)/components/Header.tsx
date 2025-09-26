'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Menu,
  Globe,
  ChevronDown,
  Home,
  GraduationCap,
  Settings,
  Mail,
  Info,
  Rss,
} from 'lucide-react'
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
  { title: 'Home', href: 'https://www.americantranslationservice.com/', icon: Home },
  {
    title: 'Evaluation',
    href: 'https://www.americantranslationservice.com/e-evaluation.php',
    icon: GraduationCap,
  },
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
  {
    title: 'Contact',
    href: 'https://www.americantranslationservice.com/e-contact.php',
    icon: Mail,
  },
  { title: 'About', href: 'https://www.americantranslationservice.com/e-aboutus.php', icon: Info },
  { title: 'Blog', href: 'https://www.americantranslationservice.com/blog', icon: Rss },
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
          <div className="flex items-center lg:hidden">
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
                  {/* Navigation Items */}
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <div key={item.title}>
                        {item.items ? (
                          // For mobile, show "Other Services" instead of individual service items
                          <Link
                            href="https://www.americantranslationservice.com/home.php#other-services-section"
                            className="flex items-center space-x-3 px-[15px] py-[12px] hover:bg-gray-50 rounded-md transition-colors"
                            style={{
                              fontFamily: 'Verdana, sans-serif',
                              color: '#00438F',
                              fontSize: '14px',
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Other Services</span>
                          </Link>
                        ) : (
                          <Link
                            href={item.href}
                            className="flex items-center space-x-3 px-[15px] py-[12px] hover:bg-gray-50 rounded-md transition-colors"
                            style={{
                              fontFamily: 'Verdana, sans-serif',
                              color: '#00438F',
                              fontSize: '14px',
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </div>
                    )
                  })}

                  {/* Language Selector in Mobile Menu */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-[15px] py-[12px] text-sm font-medium text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Language</span>
                    </div>
                    <div className="space-y-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            handleLanguageChange(language.code)
                            setIsMobileMenuOpen(false)
                          }}
                          className={`w-full text-left px-[15px] py-[8px] rounded-md transition-colors flex items-center space-x-2 ${
                            currentLanguage === language.code
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50'
                          }`}
                          style={{
                            fontFamily: 'Verdana, sans-serif',
                            color: currentLanguage === language.code ? '#00438F' : '#00438F',
                            fontSize: '14px',
                          }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              currentLanguage === language.code
                                ? 'bg-blue-600'
                                : 'border border-gray-400'
                            }`}
                          ></span>
                          <span>{language.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
