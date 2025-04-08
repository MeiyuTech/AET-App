import { test, expect } from '@playwright/test'
import { fillClientInfoForm, fillEvalueeInfoForm } from './utils/form-helpers'

test.describe('FCE Service Selection Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the FCE application form
    await page.goto('/apply-credential-evaluation-for-uscis')

    // Fill client info form and proceed to next step
    await fillClientInfoForm(page)
    await page.getByRole('button', { name: 'Next' }).click()

    // Fill evaluee info form and proceed to service selection
    await fillEvalueeInfoForm(page)
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify we are on the service selection step
    await expect(page.getByText('Service Selection')).toBeVisible()
  })

  test('should display service selection options', async ({ page }) => {
    // Verify all service type options are displayed
    await expect(page.getByText('Foreign Credential Evaluation')).toBeVisible()
    await expect(page.getByText('Course-by-Course Evaluation')).toBeVisible()
    await expect(page.getByText('Professional Experience Evaluation')).toBeVisible()
    await expect(page.getByText('Position Evaluation')).toBeVisible()
    await expect(page.getByText('Translation')).toBeVisible()

    // Verify delivery methods section is present
    await expect(page.getByText('Delivery Method')).toBeVisible()

    // Verify additional services section is present
    await expect(page.getByText('Additional Services')).toBeVisible()
  })

  test('should show speed options when selecting a service type', async ({ page }) => {
    // Select Foreign Credential Evaluation
    await page.getByLabel(/Foreign Credential Evaluation/).check()

    // Verify speed options appear
    await expect(page.getByText('Regular (15 business days)')).toBeVisible()
    await expect(page.getByText('Rush (5 business days)')).toBeVisible()

    // Verify second degree option appears
    await expect(page.getByText('Additional Degrees')).toBeVisible()
  })

  test('should allow selecting multiple service types', async ({ page }) => {
    // Select multiple service types
    await page.getByLabel(/Foreign Credential Evaluation/).check()
    await page.getByLabel(/Course-by-Course Evaluation/).check()

    // Verify both have speed option sections
    await expect(page.getByText('Foreign Credential Evaluation - First Degree')).toBeVisible()
    await expect(page.getByText('Course-by-Course Evaluation - First Degree')).toBeVisible()
  })

  test('should update additional services quantities', async ({ page }) => {
    // Select Extra Copy service
    await page.getByLabel(/Extra Copy/).check()

    // Increase quantity to 3
    const extraCopyQuantity = page
      .getByLabel(/Extra Copy/)
      .locator('xpath=..')
      .locator('input[type="number"]')
    await extraCopyQuantity.fill('3')

    // Verify the value is updated
    await expect(extraCopyQuantity).toHaveValue('3')
  })

  test('should display validation errors if no service is selected', async ({ page }) => {
    // Try to proceed without selecting any service
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify error message
    await expect(page.getByText('Please select at least one service')).toBeVisible()
  })

  test('should proceed to review step after valid service selection', async ({ page }) => {
    // Select Foreign Credential Evaluation
    await page.getByLabel(/Foreign Credential Evaluation/).check()

    // Select speed
    await page
      .getByLabel(/Regular/)
      .first()
      .check()

    // Select a delivery method
    await page.getByLabel(/USPS Priority Domestic/).check()

    // Select PDF Only as additional service
    await page.getByLabel(/PDF Copy Only/).check()

    // Click Next button
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify we are on the review step
    await expect(page.getByText('Review Information')).toBeVisible()

    // Verify selected service appears in review
    await expect(page.getByText('Foreign Credential Evaluation')).toBeVisible()

    // Go back to service selection
    await page.getByRole('button', { name: 'Previous' }).click()

    // Verify our selections are still there
    await expect(page.getByLabel(/Foreign Credential Evaluation/)).toBeChecked()
    await expect(page.getByLabel(/USPS Priority Domestic/)).toBeChecked()
    await expect(page.getByLabel(/PDF Copy Only/)).toBeChecked()
  })
})
