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
  await page.getByTestId('client-name-input').fill(companyName)

  // Select country
  await page.getByTestId('country-select').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: new RegExp(`^${country}$`) })
    .click()

  // Fill address
  await page.getByTestId('street-address-input').fill(address)
  await page.getByTestId('city-input').fill(city)

  // Select region if provided
  if (region) {
    // match all possible region labels
    await page.getByTestId('region-select').click()
    await page.locator('div[role="option"]').filter({ hasText: region }).click()
  }

  // Fill other fields
  await page.getByTestId('zip-code-input').fill(zipCode)
  await page.getByTestId('phone-input').fill(phone)
  await page.getByTestId('email-input').fill(email)

  // Select office
  await page.getByTestId('office-select').click()
  await page.locator('div[role="option"]').filter({ hasText: office }).click()

  // Select service type
  await page.getByTestId('purpose-select').click()
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
  await page.getByTestId('pronouns-select').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^Mr. \(he\/him\)$/ })
    .click()

  // test first name and last name fields
  await page.getByTestId('first-name-input').fill(firstName)
  await page.getByTestId('last-name-input').fill(lastName)
  await page.getByTestId('middle-name-input').fill(middleName)

  // test birthday information
  await page.getByTestId('date-of-birth-month-select').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^January$/ })
    .click()

  // after selecting the month, the date should be visible
  await page.getByTestId('date-of-birth-day-select').click()
  await page.locator('div[role="option"]').filter({ hasText: /^15$/ }).click()

  await page.getByTestId('date-of-birth-year-select').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^1990$/ })
    .click()

  // fill the education info
  // fill in the first education record
  await page.getByTestId('school-name-input-0').fill(schoolName)
  await page.getByTestId('study-country-select-0').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^United States$/ })
    .click()
  await page.getByTestId('degree-obtained-input-0').fill(degreeObtained)

  // fill in the study duration
  await page.getByTestId('start-date-month-select-0').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^September$/ })
    .click()
  await page.getByTestId('start-date-year-select-0').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^2014$/ })
    .click()

  await page.getByTestId('end-date-month-select-0').click()
  await page
    .locator('div[role="option"]')
    .filter({ hasText: /^June$/ })
    .click()
  await page.getByTestId('end-date-year-select-0').click()
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
