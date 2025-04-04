import { test, expect } from '@playwright/test'

test.describe('FCE client info form test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/apply-credential-evaluation-for-uscis')
  })

  test('should show validation error when required fields are empty', async ({ page }) => {
    // click the next button without filling any content
    await page.getByRole('button', { name: 'Next' }).click()

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

  test('should show state dropdown when selecting United States as country', async ({ page }) => {
    // select United States
    await page.getByLabel(/Country/).click()
    await page.getByText('United States').click()

    // verify the state label is visible
    await expect(page.getByLabel('State')).toBeVisible()

    // verify the state dropdown contains US states
    await page.getByLabel('State').click()
    await expect(page.getByText('California')).toBeVisible()
    await expect(page.getByText('New York')).toBeVisible()
    await expect(page.getByText('Texas')).toBeVisible()
  })

  test('should show province dropdown when selecting China as country', async ({ page }) => {
    // select China
    await page.getByLabel(/Country/).click()
    await page.getByText('China').click()

    // verify the region label is visible
    await expect(page.getByLabel('Province')).toBeVisible()

    // verify the province dropdown contains Chinese provinces
    await page.getByLabel('Province').click()
    await expect(page.getByText('Guangdong')).toBeVisible()
    await expect(page.getByText('Beijing')).toBeVisible()
    await expect(page.getByText('Shanghai')).toBeVisible()
  })

  test('should show Other Purpose text field when Purpose is "other"', async ({ page }) => {
    // select Purpose as "other"
    await page.getByLabel(/Purpose/).click()
    await page.getByText('Other').click()

    // verify the Other Purpose field is visible
    await expect(page.getByLabel(/Other Purpose/)).toBeVisible()
  })

  test('should show error message when phone number is invalid', async ({ page }) => {
    // fill the invalid phone number
    await page.getByLabel(/Phone/).fill('123456')

    // click other field to trigger validation
    await page.getByLabel(/Email/).click()

    // verify the error message is visible
    await expect(
      page.getByText('Please enter a valid phone number in format: 123-456-7890')
    ).toBeVisible()

    // fill the valid phone number
    await page.getByLabel(/Phone/).fill('123-456-7890')

    // verify the error message is not visible
    await expect(
      page.getByText('Please enter a valid phone number in format: 123-456-7890')
    ).not.toBeVisible()
  })

  test('should show error message when email is invalid', async ({ page }) => {
    // fill the invalid email
    await page.getByLabel(/Email/).fill('invalid-email')

    // click other field to trigger validation
    await page.getByLabel(/Phone/).click()

    // verify the error message is visible
    await expect(page.getByText('Please enter a valid email address')).toBeVisible()

    // fill the valid email
    await page.getByLabel(/Email/).fill('test@example.com')

    // verify the error message is not visible
    await expect(page.getByText('Please enter a valid email address')).not.toBeVisible()
  })

  test('should save client info and navigate to the next step', async ({ page }) => {
    // fill the complete client info
    await page.getByLabel(/Company\/Individual Name/).fill('Test Company')
    await page.getByLabel(/Country/).click()
    await page.getByText('United States').click()
    await page
      .getByLabel(/Street Address/)
      .first()
      .fill('123 Test St')
    await page.getByLabel(/City/).fill('Test City')
    await page.getByLabel(/State/).click()
    await page.getByText('California').click()
    await page.getByLabel(/Zip Code/).fill('12345')
    await page.getByLabel(/Phone/).fill('123-456-7890')
    await page.getByLabel(/Email/).fill('test@example.com')
    await page.getByLabel(/Office/).click()
    await page.getByText('San Francisco').click()
    await page.getByLabel(/Purpose/).click()
    await page.getByText('Evaluation-Employment').click()

    // click the next button
    await page.getByRole('button', { name: 'Next' }).click()

    // verify the navigation to the next step
    await expect(page.getByText('Evaluee Information')).toBeVisible()

    // return to the client info step
    await page.getByRole('button', { name: 'Previous' }).click()

    // verify the form data is retained
    await expect(page.getByLabel(/Company\/Individual Name/)).toHaveValue('Test Company')
    await expect(page.getByLabel(/Street Address/).first()).toHaveValue('123 Test St')
    await expect(page.getByLabel(/City/)).toHaveValue('Test City')
    await expect(page.getByLabel(/Zip Code/)).toHaveValue('12345')
    await expect(page.getByLabel(/Phone/)).toHaveValue('123-456-7890')
    await expect(page.getByLabel(/Email/)).toHaveValue('test@example.com')
  })
})
