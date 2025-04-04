import { test, expect } from '@playwright/test'
import { fillClientInfoForm } from './utils/form-helpers'

test.describe('FCE evaluee info form test', () => {
  test.beforeEach(async ({ page }) => {
    // navigate to the form page and complete the client info step
    await page.goto('/apply-credential-evaluation-for-uscis')
    await fillClientInfoForm(page)
    await page.getByRole('button', { name: 'Next' }).click()

    // verify the evaluee info step is visible
    await expect(page.getByText('Evaluee Information')).toBeVisible()
  })

  test('should show all required fields', async ({ page }) => {
    // verify the basic info fields are visible
    await expect(page.getByLabel(/Pronouns/)).toBeVisible()
    await expect(page.getByLabel(/First Name/)).toBeVisible()
    await expect(page.getByLabel(/Last Name/)).toBeVisible()
    await expect(page.getByLabel(/Middle Name/)).toBeVisible()

    // verify the birth date field is visible
    await expect(page.getByLabel(/Month/)).toBeVisible()
    await expect(page.getByLabel(/Date/)).toBeVisible()
    await expect(page.getByLabel(/Year/)).toBeVisible()

    // verify the education info fields are visible
    await expect(page.getByLabel(/Country of Study/)).toBeVisible()
    await expect(page.getByLabel(/School Name/)).toBeVisible()
    await expect(page.getByLabel(/Degree Obtained/)).toBeVisible()
  })

  test('should show validation error when required fields are empty', async ({ page }) => {
    // try to navigate to the next step without filling any information
    await page.getByRole('button', { name: 'Next' }).click()

    // verify the error message is visible
    await expect(page.getByText('Please fill in all required fields')).toBeVisible()

    // verify the error message for each field is visible
    await expect(page.getByText('First name is required')).toBeVisible()
    await expect(page.getByText('Last name is required')).toBeVisible()
    // other field error messages...
  })

  test('should be able to add multiple education records', async ({ page }) => {
    // verify the initial education record is visible
    await expect(page.locator('form').filter({ hasText: 'Country of Study' })).toBeVisible()

    // fill the first education record
    await page.getByLabel(/Country of Study/).click()
    await page.getByText('China').click()
    await page.getByLabel(/School Name/).fill('Beijing University')
    await page.getByLabel(/Degree Obtained/).fill('Bachelor of Science')

    // fill the study time
    await page.getByLabel(/Start Month/).click()
    await page.getByText('September').click()
    await page.getByLabel(/Start Year/).fill('2010')
    await page.getByLabel(/End Month/).click()
    await page.getByText('June').click()
    await page.getByLabel(/End Year/).fill('2014')

    // click the add another education record button
    await page.getByRole('button', { name: /Add another education/ }).click()

    // verify the new education record form is visible
    const educationForms = await page
      .locator('form')
      .filter({ hasText: 'Country of Study' })
      .count()
    expect(educationForms).toBeGreaterThan(1)

    // fill the second education record
    await page
      .getByLabel(/Country of Study/)
      .nth(1)
      .click()
    await page.getByText('United States').click()
    await page
      .getByLabel(/School Name/)
      .nth(1)
      .fill('Stanford University')
    await page
      .getByLabel(/Degree Obtained/)
      .nth(1)
      .fill('Master of Science')

    // fill the study time
    const startMonthSelectors = await page.getByLabel(/Start Month/).all()
    await startMonthSelectors[1].click()
    await page.getByText('September').click()

    const startYearInputs = await page.getByLabel(/Start Year/).all()
    await startYearInputs[1].fill('2015')

    const endMonthSelectors = await page.getByLabel(/End Month/).all()
    await endMonthSelectors[1].click()
    await page.getByText('June').click()

    const endYearInputs = await page.getByLabel(/End Year/).all()
    await endYearInputs[1].fill('2017')
  })

  test('should be able to delete education records', async ({ page }) => {
    // add two education records
    await page.getByLabel(/Country of Study/).click()
    await page.getByText('China').click()
    await page.getByLabel(/School Name/).fill('Beijing University')
    await page.getByLabel(/Degree Obtained/).fill('Bachelor')

    // click the add another education record button
    await page.getByRole('button', { name: /Add another education/ }).click()

    // verify there are two education records
    const beforeCount = await page.locator('form').filter({ hasText: 'Country of Study' }).count()
    expect(beforeCount).toBeGreaterThan(1)

    // click the delete second education record button
    await page
      .getByRole('button', { name: /Remove/ })
      .nth(1)
      .click()

    // verify there is one education record
    const afterCount = await page.locator('form').filter({ hasText: 'Country of Study' }).count()
    expect(afterCount).toBeLessThan(beforeCount)
  })

  test('should be able to navigate to the next step after filling the evaluee info', async ({
    page,
  }) => {
    // fill the basic info
    await page.getByLabel(/Pronouns/).click()
    await page.getByText('Mr.').click()
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
    await page.getByLabel(/School Name/).fill('Beijing University')
    await page.getByLabel(/Degree Obtained/).fill('Bachelor of Science')

    // fill the study time
    await page.getByLabel(/Start Month/).click()
    await page.getByText('September').click()
    await page.getByLabel(/Start Year/).fill('2010')
    await page.getByLabel(/End Month/).click()
    await page.getByText('June').click()
    await page.getByLabel(/End Year/).fill('2014')

    // click the next button
    await page.getByRole('button', { name: 'Next' }).click()

    // verify the navigation to the next step (service selection or review)
    const isServiceSelectionVisible = await page.getByText('Service Selection').isVisible()
    const isReviewVisible = await page.getByText('Review Information').isVisible()

    expect(isServiceSelectionVisible || isReviewVisible).toBeTruthy()
  })
})
