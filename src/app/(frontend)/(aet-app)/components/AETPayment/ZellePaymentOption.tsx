'use client'

import { useTranslations } from 'next-intl'

interface ZellePaymentOptionProps {
  office?: string
}
export default function ZellePaymentOption({ office }: ZellePaymentOptionProps) {
  const t = useTranslations('status.paymentOptions.zelle')
  // Return different bank information based on the office
  const getBankInfo = () => {
    if (office === 'Boston' || office === 'New York') {
      return {
        bankName: 'Bank of America',
        email: 'boston@aet21.com',
      }
    } else {
      return {
        bankName: 'Chase',
        email: 'info@aet21.com',
      }
    }
  }

  const { bankName, email } = getBankInfo()

  return (
    <div className="space-y-6">
      {/* Payment Steps */}
      <div className="border rounded-lg p-4 bg-white">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-list-checks"
          >
            <path d="m3 17 2 2 4-4" />
            <path d="m3 7 2 2 4-4" />
            <path d="M13 6h8" />
            <path d="M13 12h8" />
            <path d="M13 18h8" />
          </svg>
          {t('stepsTitle')}
        </h4>
        <ol className="space-y-3 pl-0">
          <li className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              1
            </div>
            <div>{t('steps.step1')}</div>
          </li>
          <li className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              2
            </div>
            <div>{t('steps.step2')}</div>
          </li>
          <li className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              3
            </div>
            <div>{t('steps.step3')}</div>
          </li>
          <li className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              4
            </div>
            <div>{t('steps.step4')}</div>
          </li>
          <li className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              5
            </div>
            <div>{t('steps.step5')}</div>
          </li>
          <li className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm">
              6
            </div>
            <div>{t('steps.step6')}</div>
          </li>
        </ol>
      </div>

      {/* Bank Information Card */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-building"
          >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M8 10h.01" />
            <path d="M16 10h.01" />
            <path d="M8 14h.01" />
            <path d="M16 14h.01" />
          </svg>
          {t('bankInfo.title')}
        </h4>
        <div className="space-y-2">
          <p>
            <span className="font-medium">{t('bankInfo.bankName')}</span> {bankName}
          </p>
          <p>
            <span className="font-medium">{t('bankInfo.businessName')}</span> American Education and
            Translation Services
          </p>
          <p>
            <span className="font-medium">{t('bankInfo.zelleEmail')}</span>{' '}
            <span className="font-bold text-blue-700">{email}</span>
          </p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm flex gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-info text-amber-600 flex-shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <div>
          {t.rich('note', {
            link: (chunks) => (
              <a
                href="https://www.zellepay.com/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {chunks}
              </a>
            ),
          })}
        </div>
      </div>
    </div>
  )
}
