'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLanguage } from '@/contexts/LanguageContext'
import { localeDisplayNames, Locale } from '@/i18n'
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

// Languages configuration
const languages = [
  { code: 'en' as Locale, name: 'English', display: 'EN' },
  { code: 'zh' as Locale, name: '中文', display: '中文' },
  { code: 'es' as Locale, name: 'Español', display: 'ES' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations()
  const { locale, setLocale } = useLanguage()

  // Create navigation items with translations
  const navigationItems = [
    {
      title: t('navigation.home'),
      href: 'https://www.americantranslationservice.com/',
      icon: Home,
    },
    {
      title: t('navigation.evaluation'),
      href: 'https://www.americantranslationservice.com/e-evaluation.php',
      icon: GraduationCap,
    },
    {
      title: t('navigation.services'),
      items: [
        {
          title: t('services.certifiedTranslation'),
          href: 'https://www.americantranslationservice.com/e-notarized.php',
        },
        {
          title: t('services.technicalTranslation'),
          href: 'https://www.americantranslationservice.com/e-tech-translation.php',
        },
        {
          title: t('services.interpretation'),
          href: 'https://www.americantranslationservice.com/e-interpretation.php',
        },
        {
          title: t('services.visaServices'),
          href: 'https://www.americantranslationservice.com/e-visaservice.php',
        },
        {
          title: t('services.expertOpinionLetters'),
          href: 'https://www.americantranslationservice.com/e-expert-opinion-letter.php',
        },
        {
          title: t('services.editingProofreading'),
          href: 'https://www.americantranslationservice.com/e-writing.php',
        },
        {
          title: t('services.generalTranslation'),
          href: 'https://www.americantranslationservice.com/e-translation.php',
        },
        {
          title: t('services.notarization'),
          href: 'https://www.americantranslationservice.com/e-nus.php',
        },
        {
          title: t('services.chinaConsularAuthentication'),
          href: 'https://www.americantranslationservice.com/e-authentication.php',
        },
      ],
    },
    {
      title: t('navigation.contact'),
      href: 'https://www.americantranslationservice.com/e-contact.php',
      icon: Mail,
    },
    {
      title: t('navigation.about'),
      href: 'https://www.americantranslationservice.com/e-aboutus.php',
      icon: Info,
    },
    {
      title: t('navigation.blog'),
      href: 'https://www.americantranslationservice.com/blog',
      icon: Rss,
    },
  ]

  const handleLanguageChange = (langCode: Locale) => {
    setLocale(langCode)
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
                  <span className="font-normal">{localeDisplayNames[locale]}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`px-4 py-3 ${locale === language.code ? 'bg-accent' : ''}`}
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
                  <span className="sr-only">{t('header.toggleMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{t('header.menu')}</SheetTitle>
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
                            <span>{t('services.otherServices')}</span>
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
                      <span>{t('navigation.language')}</span>
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
                            locale === language.code
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50'
                          }`}
                          style={{
                            fontFamily: 'Verdana, sans-serif',
                            color: locale === language.code ? '#00438F' : '#00438F',
                            fontSize: '14px',
                          }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              locale === language.code ? 'bg-blue-600' : 'border border-gray-400'
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
