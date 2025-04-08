import { Page } from '@playwright/test'

/**
 * fill the client info form
 */
export async function fillClientInfo(
  page,
  options: {
    companyName?: string
    country?: string
    address?: string
    city?: string
    region?: string
    zipCode?: string
    phone?: string
    email?: string
    office?: string
    serviceType?: string
  } = {}
) {
  const {
    companyName = 'Test Company',
    country = 'United States',
    address = '123 Test St',
    city = 'Test City',
    region = 'California',
    zipCode = '12345',
    phone = '123-456-7890',
    email = 'test@example.com',
    office = 'Los Angeles',
    serviceType = 'Evaluation-USCIS',
  } = options

  // Fill company name
  await page.getByLabel(/Company\/Individual Name/).fill(companyName)

  // Select country
  await page.getByLabel(/Country/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: new RegExp(`^${country}$`) })
    .click()

  // Fill address
  await page
    .getByLabel(/Street Address/)
    .first()
    .fill(address)
  await page.getByLabel(/City/).fill(city)

  // Select region if provided
  if (region) {
    // match all possible region labels
    await page.getByLabel(/(State|Province|County|Region)\*/).click()
    await page.locator('div[role="option"]').filter({ hasText: region }).click()
  }

  // Fill other fields
  await page.getByLabel(/Zip Code/).fill(zipCode)
  await page.getByLabel(/Phone/).fill(phone)
  await page.getByLabel(/Email/).fill(email)

  // Select office
  await page.getByLabel(/Office/).click()
  await page.locator('div[role="option"]').filter({ hasText: office }).click()

  // Select service type
  await page.getByLabel(/Service Type/).click()
  await page.locator('div[role="option"]').filter({ hasText: serviceType }).click()
}

/**
 * fill the evaluee info form
 */
export async function fillEvalueeInfo(
  page: Page,
  options: {
    firstName?: string
    lastName?: string
    middleName?: string
    schoolName?: string
    degreeObtained?: string
  } = {}
) {
  const {
    firstName = 'John',
    lastName = 'Doe',
    middleName = 'A',
    schoolName = 'Harvard University',
    degreeObtained = 'Bachelor of Science',
  } = options
  // test pronoun selection
  await page.getByLabel(/Pronouns/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^Mr. \(he\/him\)$/ })
    .click()

  // test first name and last name fields
  await page.getByLabel(/First Name/).fill(firstName)
  await page.getByLabel(/Last Name/).fill(lastName)
  await page.getByLabel(/Middle Name/).fill(middleName)

  // test birthday information
  await page.getByLabel(/Birth Month/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^January$/ })
    .click()

  // after selecting the month, the date should be visible
  await page.getByLabel(/Birth Day/).click()
  await page.locator('div[role="option"]').filter({ hasText: /^15$/ }).click()

  await page.getByLabel(/Birth Year/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^1990$/ })
    .click()

  // fill the education info
  // fill in the first education record
  await page.getByLabel(/School Name/).fill(schoolName)
  await page.getByLabel(/Study Country/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^United States$/ })
    .click()
  await page.getByLabel(/Degree Obtained/).fill(degreeObtained)

  // fill in the study duration
  await page.getByLabel(/Start Month/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^September$/ })
    .click()
  await page.getByLabel(/Start Year/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^2014$/ })
    .click()

  await page.getByLabel(/End Month/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^June$/ })
    .click()
  await page.getByLabel(/End Year/).click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^2016$/ })
    .click()
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
  await fillClientInfo(page)
  await page.getByTestId('form-next-button').click()

  // fill the evaluee info
  await fillEvalueeInfo(page)
  await page.getByTestId('form-next-button').click()

  // fill the service selection (if the step exists)
  if (await page.getByText('Service Selection').isVisible()) {
    await fillServiceSelectionForm(page)
    await page.getByTestId('form-next-button').click()
  }
}
