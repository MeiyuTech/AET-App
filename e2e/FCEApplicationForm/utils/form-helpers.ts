import { Page } from '@playwright/test'

/**
 * fill the client info form
 */
export async function fillClientInfoForm(page: Page) {
  // fill the company/individual name
  await page.getByLabel(/Company\/Individual Name/).fill('Test Company')

  // select the country
  await page.getByLabel(/Country/).click()
  await page.getByText('United States').click()

  // fill the address info
  await page
    .getByLabel(/Street Address/)
    .first()
    .fill('123 Test St')
  await page.getByLabel(/City/).fill('Test City')

  // select the state/province
  await page.getByLabel(/State/).click()
  await page.getByText('California').click()

  // fill the zip code, phone and email
  await page.getByLabel(/Zip Code/).fill('12345')
  await page.getByLabel(/Phone/).fill('1234567890')
  await page.getByLabel(/Email/).fill('test@example.com')

  // select the office
  await page.getByLabel(/Office/).click()
  await page.getByText('San Francisco').click()

  // select the purpose
  await page.getByLabel(/Purpose/).click()
  await page.getByText('Evaluation for Employment').click()
}

/**
 * fill the evaluee info form
 */
export async function fillEvalueeInfoForm(page: Page) {
  // select the pronouns
  await page.getByLabel(/Pronouns/).click()
  await page.getByText('Mr.').click()

  // fill the name
  await page.getByLabel(/First Name/).fill('John')
  await page.getByLabel(/Last Name/).fill('Doe')
  await page.getByLabel(/Middle Name/).fill('A')

  // fill the birth date
  await page.getByLabel(/Month/).click()
  await page.getByText('January').click()
  await page.getByLabel(/Date/).fill('1')
  await page.getByLabel(/Year/).fill('1990')

  // fill the education info
  await page.getByLabel(/Country of Study/).click()
  await page.getByText('China').click()
  await page.getByLabel(/School Name/).fill('Test University')
  await page.getByLabel(/Degree Obtained/).fill('Bachelor of Science')

  // fill the study time
  await page.getByLabel(/Start Month/).click()
  await page.getByText('September').click()
  await page.getByLabel(/Start Year/).fill('2010')
  await page.getByLabel(/End Month/).click()
  await page.getByText('June').click()
  await page.getByLabel(/End Year/).fill('2014')
}

/**
 * fill the service selection form
 */
export async function fillServiceSelectionForm(page: Page) {
  // select the service type
  await page.getByLabel(/Foreign Credential Evaluation/).check()

  // select the speed (if visible)
  await page
    .getByLabel(/Regular/)
    .first()
    .check()

  // select the delivery method
  await page.getByLabel(/USPS Priority Domestic/).check()

  // select the additional service
  await page.getByLabel(/PDF Copy Only/).check()
}

/**
 * fill the complete form (all steps)
 */
export async function fillCompleteForm(page: Page) {
  // fill the client info
  await fillClientInfoForm(page)
  await page.getByRole('button', { name: 'Next' }).click()

  // fill the evaluee info
  await fillEvalueeInfoForm(page)
  await page.getByRole('button', { name: 'Next' }).click()

  // fill the service selection (if the step exists)
  if (await page.getByText('Service Selection').isVisible()) {
    await fillServiceSelectionForm(page)
    await page.getByRole('button', { name: 'Next' }).click()
  }
}
