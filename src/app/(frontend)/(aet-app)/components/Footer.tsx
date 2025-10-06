'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

/**
 * Footer Component
 *
 * A responsive website footer that provides:
 * - Service links and popular links
 * - Office location information
 * - Social media icons
 * - Copyright and policy links
 *
 * Used as the main footer for all pages in the application.
 */

export default function Footer() {
  const t = useTranslations()
  return (
    <footer
      className="bg-white text-center py-8 px-4 shadow-2xl border-t border-gray-200"
      style={{ fontFamily: 'Verdana, sans-serif' }}
      id="footer"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* TOP SERVICE Column */}
          <div className="text-center">
            <h3 className="text-base font-bold text-[#1a4d8c] mb-3 uppercase tracking-wide">
              {t('footer.topService')}
            </h3>
            <div className="space-y-1 mb-6">
              <p className="mb-2">
                <a
                  href="https://www.americantranslationservice.com/e-evaluation.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.foreignCredentialEvaluation')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
            </div>

            <h3 className="text-base font-bold text-[#1a4d8c] mb-3 uppercase tracking-wide">
              {t('footer.moreServices')}
            </h3>
            <div className="space-y-1">
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-notarized.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.certifiedTranslation')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-interpretation.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.interpretation')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-visaservice.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.visa')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-authentication.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.consularAuthentication')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
            </div>
          </div>

          {/* POPULAR LINKS Column */}
          <div className="text-center">
            <h3 className="text-base font-bold text-[#1a4d8c] mb-3 uppercase tracking-wide">
              {t('footer.popularLinks')}
            </h3>
            <div className="space-y-1">
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-fee.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.serviceFee')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-contact.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.contactUs')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-aboutus.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.aboutAET')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-careers.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.career')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
            </div>
          </div>

          {/* OFFICE Column */}
          <div className="text-center">
            <h3 className="text-base font-bold text-[#1a4d8c] mb-3 uppercase tracking-wide">
              {t('footer.office')}
            </h3>
            <div className="space-y-1">
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-office-miami.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.miami')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-office-boston.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.boston')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-office-san-francisco.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.sanFrancisco')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-office-los-angeles.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.losAngeles')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-office-nyc.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.newYork')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
              <p className="mb-1">
                <a
                  href="https://www.americantranslationservice.com/e-office-beijing.php"
                  className="text-[#3366cc] hover:text-[#1a4d8c] transition-colors text-sm relative group font-medium"
                >
                  {t('footer.beijing')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-gray-300 pt-6 mb-6">
          <div className="flex justify-center items-center space-x-6">
            <a
              href="https://www.linkedin.com/company/american-education-&-translation-services-aet-"
              target="_blank"
              rel="noopener noreferrer"
              title={t('footer.followLinkedIn')}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/LinkedIn Logo.svg"
                alt="LinkedIn"
                width={40}
                height={28}
                className="w-10 h-7"
              />
            </a>
            <a
              href="https://www.yelp.com/biz/american-education-and-translation-services-malden"
              target="_blank"
              rel="noopener noreferrer"
              title={t('footer.readYelpReviews')}
              className="text-[#d32323] text-2xl hover:opacity-80 transition-opacity"
            >
              {/* Yelp SVG Logo */}
              <Image
                src="/yelp-color-svgrepo-com.svg"
                alt="Yelp"
                width={40}
                height={28}
                className="w-10 h-7"
              />
            </a>
            <a
              href="https://www.facebook.com/MiamiAET/"
              target="_blank"
              rel="noopener noreferrer"
              title={t('footer.followFacebook')}
              className="text-blue-600 text-2xl hover:opacity-80 transition-opacity"
            >
              <Image
                src="/facebook-color-svgrepo-com.svg"
                alt="Facebook"
                width={40}
                height={28}
                className="w-10 h-7"
              />
            </a>
            <a
              href="https://www.google.com/search?q=american+education+translation+services&oq=american+education+translation+services&aqs=chrome..69i57j69i60l2j35i39i362l3j46i39i362j35i39i362.213j0j7&sourceid=chrome&ie=UTF-8"
              target="_blank"
              rel="noopener noreferrer"
              title={t('footer.readGoogleReviews')}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/google-reviews.png"
                alt="Google Reviews"
                width={70}
                height={40}
                className="w-16 h-9"
              />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-[#3366cc] text-xs relative group font-medium">
            {t('footer.copyright')}
          </p>
          <div className="space-x-4">
            <a
              href="https://www.americantranslationservice.com/blog"
              className="text-[#3366cc] text-xs relative group font-medium"
            >
              {t('footer.blog')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="https://www.americantranslationservice.com/e-terms-of-use.php"
              className="text-[#3366cc] text-xs relative group font-medium"
            >
              {t('footer.termsOfUse')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="https://www.americantranslationservice.com/e-privacy-policy.php"
              className="text-[#3366cc] text-xs relative group font-medium"
            >
              {t('footer.privacyPolicy')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a4d8c] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
