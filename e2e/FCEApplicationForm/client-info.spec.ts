import { test, expect } from '@playwright/test'
import { fillClientInfo } from './utils/form-helpers'

test.describe('FCE client info form test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply-credential-evaluation-for-uscis')
    // verify the client info step is visible
    await expect(page.getByText('Client Information')).toBeVisible()
  })

  test('should show validation error when required fields are empty', async ({ page }) => {
    // click the next button without filling any content
    await page.getByRole('button', { name: /Next/ }).click()

    // verify the error message is visible
    await expect(page.getByRole('main').getByText('Please fill in all required')).toBeVisible()

    // check the error message for each field
    await expect(page.getByText('Please enter company/individual name')).toBeVisible()
    await expect(page.getByText('Please select country')).toBeVisible()
    await expect(page.getByText('Please enter street address')).toBeVisible()
    await expect(page.getByText('Please enter city name')).toBeVisible()
    await expect(page.getByText('Please select region')).toBeVisible()
    await expect(page.getByText('Please enter a valid ZIP code')).toBeVisible()
    await expect(page.getByText('Please enter a valid phone number')).toBeVisible()
    await expect(page.getByText('Please enter a valid email address')).toBeVisible()
    await expect(page.getByText('Please select office')).toBeVisible()
    await expect(page.getByText('Please select evaluation purpose')).toBeVisible()
  })

  test('should handle region fields correctly for different countries', async ({ page }) => {
    // Test 1: United States should show "State"
    await page.getByLabel(/Country/).click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^United States$/ })
      .click()
    await expect(page.getByText('State*')).toBeVisible()
    await page.getByLabel(/State/).click()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'California' })).toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'New York' })).toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Texas' })).toBeVisible()
    await page.locator('div[role="option"]').filter({ hasText: 'Texas' }).click()

    // Test 2: China should show "Province"
    await page.getByLabel(/Country/).click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^China$/ })
      .click()
    await expect(page.getByText('Province*')).toBeVisible()
    await page.getByLabel(/Province/).click()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Guangdong' })).toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Beijing' })).toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Shanghai' })).toBeVisible()
    await page.locator('div[role="option"]').filter({ hasText: 'Shanghai' }).click()

    // Test 3: Canada should show "Province"
    await page.getByLabel(/Country/).click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^Canada$/ })
      .click()
    await expect(page.getByText('Province*')).toBeVisible()
    await page.getByLabel(/Province/).click()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Ontario' })).toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Quebec' })).toBeVisible()
    await page.locator('div[role="option"]').filter({ hasText: 'Quebec' }).click()

    // Test 4: UK should show "County"
    await page.getByLabel(/Country/).click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^United Kingdom$/ })
      .click()
    await expect(page.getByText('County*')).toBeVisible()
    await page.getByLabel(/County/).click()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Manchester' })).toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: 'Birmingham' })).toBeVisible()
    await page.locator('div[role="option"]').filter({ hasText: 'Birmingham' }).click()
  })

  test('should handle countries without regions correctly', async ({ page }) => {
    // Fill in basic info
    await page.getByLabel(/Company\/Individual Name/).fill('Test Company')

    // Select country without regions (Wallis and Futuna)
    await page.getByLabel(/Country/).click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: 'Wallis and Futuna Islands' })
      .click()

    // Check if region field shows "Not Applicable" option
    await page.getByLabel(/Region/).click()
    await expect(
      page.locator('div[role="option"]').filter({ hasText: 'Not Applicable' })
    ).toBeVisible()

    // Select "Not Applicable" option
    await page.locator('div[role="option"]').filter({ hasText: 'Not Applicable' }).click()
    // Clicking on 'Client Information' to close the dropdown
    // Using { force: true } to ensure the click action is executed even if the element is not visible or interactable
    await page.getByText('Client Information').click({ force: true })

    // Fill remaining required fields and test submission
    await page.getByTestId('street-address-input').fill('123 Test St')
    await page.getByTestId('city-input').fill('Mata-Utu')
    await page.getByTestId('zip-code-input').fill('12345')
    await page.getByTestId('phone-input').fill('123-456-7890')
    await page.getByTestId('email-input').fill('test@example.com')
    await page.getByTestId('office-select').click()
    await page.locator('div[role="option"]').filter({ hasText: 'San Francisco' }).click()
    await page.getByLabel(/Service Type/).click()
    await page.locator('div[role="option"]').filter({ hasText: 'Evaluation-USCIS' }).click()

    // Click next and verify it proceeds to the next step
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Evaluee Information')).toBeVisible()
  })

  test('should validate input fields and show appropriate error messages', async ({ page }) => {
    // Test 1: Phone number validation
    await page.getByTestId('phone-input').fill('123456')
    await page.getByTestId('form-next-button').click()
    await expect(
      page.getByText('Please enter a valid phone number in format: 123-456-7890')
    ).toBeVisible()
    await page.getByTestId('phone-input').fill('123-456-7890')
    await page.getByTestId('form-next-button').click()
    await expect(
      page.getByText('Please enter a valid phone number in format: 123-456-7890')
    ).not.toBeVisible()

    // Test 2: Email validation
    await page.getByTestId('email-input').fill('invalid-email')
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Please enter a valid email address')).toBeVisible()
    await page.getByTestId('email-input').fill('test@example.com')
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Please enter a valid email address')).not.toBeVisible()

    // Test 3: ZIP code validation
    await fillClientInfo(page, { zipCode: '123' })
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Please enter a valid ZIP code')).toBeVisible()

    // wait for the client info page to be ready
    await expect(page.getByText('Client Information')).toBeVisible()

    // ensure the form is in a stable state
    await page.waitForLoadState('networkidle')

    // Test valid 5-digit format
    const zipCodeInput = page.getByTestId('zip-code-input')
    await expect(zipCodeInput).toBeVisible()
    await zipCodeInput.fill('12345')
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Please enter a valid ZIP code')).not.toBeVisible()
    await page.getByTestId('form-previous-button').click()

    // wait for the client info page to be ready
    await expect(page.getByText('Client Information')).toBeVisible()

    // Test valid extended format
    await expect(zipCodeInput).toBeVisible()
    await zipCodeInput.fill('12345-6789')
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Please enter a valid ZIP code')).not.toBeVisible()
  })

  test('should handle form data persistence and navigation', async ({ page }) => {
    // Test 1: Basic form completion and navigation
    await fillClientInfo(page)
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Evaluee Information')).toBeVisible()
    await page.getByTestId('form-previous-button').click()
    await expect(page.getByTestId('client-name-input')).toHaveValue('Test Company')
    await expect(page.getByTestId('street-address-input')).toHaveValue('123 Test St')
    await expect(page.getByTestId('city-input')).toHaveValue('Test City')
    await expect(page.getByTestId('zip-code-input')).toHaveValue('12345')
    await expect(page.getByTestId('phone-input')).toHaveValue('123-456-7890')
    await expect(page.getByTestId('email-input')).toHaveValue('test@example.com')

    // Test 2: Complete form with additional fields
    await fillClientInfo(page, {
      companyName: 'Data Persistence Test',
      address: '456 Persistence Ave',
      city: 'Persistence City',
      region: 'New York',
      zipCode: '54321',
      phone: '987-654-3210',
      email: 'persistence@example.com',
      office: 'Los Angeles',
    })
    await page.getByTestId('street-address2-input').fill('Suite 789')
    await page.getByTestId('fax-input').fill('123-456-7890')
    const testNote = 'This is a test note for data persistence checking'
    await page.getByTestId('service-notes-input').fill(testNote)

    // Navigate and check persistence
    await page.getByTestId('form-next-button').click()

    // wait for the next page to load
    await expect(page.getByText('Evaluee Information')).toBeVisible()
    await page.waitForLoadState('networkidle')

    // ensure the previous button is visible and interactive
    const previousButton = page.getByTestId('form-previous-button')
    await previousButton.scrollIntoViewIfNeeded()
    await previousButton.waitFor({ state: 'visible', timeout: 5000 })
    await previousButton.click({ force: true })

    // wait for the client info page to load and be interactive
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Client Information')).toBeVisible()

    // verify the form data persistence
    await expect(page.getByTestId('client-name-input')).toHaveValue('Data Persistence Test')
    await expect(page.getByTestId('street-address-input')).toHaveValue('456 Persistence Ave')
    await expect(page.getByTestId('street-address2-input')).toHaveValue('Suite 789')
    await expect(page.getByTestId('city-input')).toHaveValue('Persistence City')
    await expect(page.getByTestId('zip-code-input')).toHaveValue('54321')
    await expect(page.getByTestId('phone-input')).toHaveValue('987-654-3210')
    await expect(page.getByTestId('fax-input')).toHaveValue('123-456-7890')
    await expect(page.getByTestId('email-input')).toHaveValue('persistence@example.com')
    await expect(page.getByTestId('service-notes-input')).toHaveValue(testNote)

    // Test 3: Long service notes persistence
    const longNote =
      'This is a detailed note about the evaluation needed. I am applying for employment at a tech company and need my Computer Science degree from Beijing University evaluated. I graduated in 2015 with honors and need this verification for my employer.'
    await page.getByTestId('service-notes-input').fill(longNote)
    await page.getByTestId('form-next-button').click()

    // wait for the next page to load
    await expect(page.getByText('Evaluee Information')).toBeVisible()

    // ensure the previous button is visible and interactive
    const previousButton2 = page.getByTestId('form-previous-button')
    await previousButton2.waitFor({ state: 'visible' })
    // add a short delay to ensure the button is fully interactive
    await previousButton2.click()

    // wait for the client info page to load
    await expect(page.getByText('Client Information')).toBeVisible()

    await expect(page.getByTestId('service-notes-input')).toHaveValue(longNote)
  })

  test('should reset form when refreshing browser and no draft is saved', async ({ page }) => {
    // Fill in basic information
    await page.getByLabel(/Company\/Individual Name/).fill('Refresh Test Company')
    await page.getByLabel(/Phone/).fill('123-456-7890')
    await page.getByLabel(/Email/).fill('refresh@example.com')

    // Refresh the page
    await page.reload()

    // Check that form fields are reset
    await expect(page.getByLabel(/Company\/Individual Name/)).toHaveValue('')
    await expect(page.getByLabel(/Phone/)).toHaveValue('')
    await expect(page.getByLabel(/Email/)).toHaveValue('')
  })

  test('should display sample reports links with correct URLs', async ({ page }) => {
    // Verify both sample report links are visible
    await expect(page.getByText('Degree Credential Evaluation Report')).toBeVisible()
    await expect(page.getByText('Course by Course Evaluation Report')).toBeVisible()

    // Verify links have correct URLs
    await expect(
      page.getByRole('link', { name: 'Degree Credential Evaluation Report' })
    ).toHaveAttribute('href', 'https://www.americantranslationservice.com/evaluation_report.pdf')

    await expect(
      page.getByRole('link', { name: 'Course by Course Evaluation Report' })
    ).toHaveAttribute('href', 'https://www.americantranslationservice.com/cbcevaluation_report.pdf')
  })

  test('should handle different service type selections', async ({ page }) => {
    // Fill in required fields except purpose
    await fillClientInfo(page, { serviceType: undefined }) // Skip service type selection

    // Try different service types
    // 1. USCIS Evaluation
    await page.getByLabel(/Service Type/).click()
    await page.locator('div[role="option"]').filter({ hasText: 'Evaluation-USCIS' }).click()
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Evaluee Information')).toBeVisible()
    await page.getByTestId('form-previous-button').click()

    // 2. Employment Evaluation
    await page.getByLabel(/Service Type/).click()
    await page.locator('div[role="option"]').filter({ hasText: 'Evaluation-Employment' }).click()
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Evaluee Information')).toBeVisible()
    await page.getByTestId('form-previous-button').click()

    // 3. Education Evaluation
    await page.getByLabel(/Service Type/).click()
    await page.locator('div[role="option"]').filter({ hasText: 'Evaluation-Education' }).click()
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Evaluee Information')).toBeVisible()
  })
})
