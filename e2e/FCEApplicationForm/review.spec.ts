// import { test, expect } from '@playwright/test'
// import { fillCompleteForm } from './utils/form-helpers'

// test.describe('FCE Review Form Tests', () => {
//   test.beforeEach(async ({ page }) => {
//     // Navigate to the FCE application form
//     await page.goto('/apply-credential-evaluation-for-uscis')

//     // Fill all steps to reach review page
//     await fillCompleteForm(page)

//     // Verify we are on the review step
//     await expect(page.getByText('Review Information')).toBeVisible()
//   })

//   test('should display all sections in review', async ({ page }) => {
//     // Check for all section headers
//     await expect(page.getByText('Client Information')).toBeVisible()
//     await expect(page.getByText('Evaluee Information')).toBeVisible()
//     await expect(page.getByText('Service Selection')).toBeVisible()

//     // Check for summary information
//     await expect(page.getByText('Summary')).toBeVisible()
//   })

//   test('should display all client information correctly', async ({ page }) => {
//     // Verify client information section contains expected data
//     await expect(page.getByText('Test Company')).toBeVisible()
//     await expect(page.getByText('123 Test St')).toBeVisible()
//     await expect(page.getByText('Test City')).toBeVisible()
//     await expect(page.getByText('California')).toBeVisible()
//     await expect(page.getByText('12345')).toBeVisible()
//     await expect(page.getByText('test@example.com')).toBeVisible()
//   })

//   test('should display all evaluee information correctly', async ({ page }) => {
//     // Verify evaluee information section contains expected data
//     await expect(page.getByText('John')).toBeVisible()
//     await expect(page.getByText('Doe')).toBeVisible()
//     await expect(page.getByText('A')).toBeVisible() // Middle name
//     await expect(page.getByText('January 1, 1990')).toBeVisible()

//     // Verify education information
//     await expect(page.getByText('Test University')).toBeVisible()
//     await expect(page.getByText('Bachelor of Science')).toBeVisible()
//     await expect(page.getByText('China')).toBeVisible()
//     await expect(page.getByText('September 2010 - June 2014')).toBeVisible()
//   })

//   test('should display service selection information correctly', async ({ page }) => {
//     // Verify service selection information appears correctly
//     await expect(page.getByText('Foreign Credential Evaluation')).toBeVisible()

//     // Check for delivery method
//     await expect(page.getByText('USPS Priority Domestic')).toBeVisible()

//     // Check for additional services
//     await expect(page.getByText('PDF Copy Only')).toBeVisible()
//   })

//   test('should allow editing each section from review', async ({ page }) => {
//     // Edit client information section
//     await page
//       .getByRole('button', { name: 'Edit' })
//       .nth(0) // First edit button is for client info
//       .click()

//     // Verify we went back to client info step
//     await expect(page.getByText('Client Information')).toBeVisible()
//     await expect(page.getByLabel(/Company\/Individual Name/)).toBeVisible()

//     // Go back to review
//     await page.getByRole('button', { name: 'Next' }).click()
//     await page.getByRole('button', { name: 'Next' }).click()
//     if (await page.getByText('Service Selection').isVisible()) {
//       await page.getByRole('button', { name: 'Next' }).click()
//     }

//     // Edit evaluee information section
//     await page
//       .getByRole('button', { name: 'Edit' })
//       .nth(1) // Second edit button is for evaluee info
//       .click()

//     // Verify we went back to evaluee info step
//     await expect(page.getByText('Evaluee Information')).toBeVisible()
//     await expect(page.getByLabel(/First Name/)).toBeVisible()

//     // Go back to review
//     await page.getByRole('button', { name: 'Next' }).click()
//     if (await page.getByText('Service Selection').isVisible()) {
//       await page.getByRole('button', { name: 'Next' }).click()
//     }

//     // If service selection is visible, edit service selection
//     const serviceSelectionEditButton = page.getByRole('button', { name: 'Edit' }).nth(2)
//     if (await serviceSelectionEditButton.isVisible()) {
//       await serviceSelectionEditButton.click()

//       // Verify we went back to service selection step
//       await expect(page.getByText('Service Selection')).toBeVisible()

//       // Go back to review
//       await page.getByRole('button', { name: 'Next' }).click()
//     }
//   })

//   test('should calculate and display estimated cost', async ({ page }) => {
//     // Check if estimated cost section exists
//     await expect(page.getByText('Estimated Cost')).toBeVisible()

//     // Check if the cost displays some dollar amount
//     await expect(page.locator('text=/\\$\\d+\\.\\d{2}/')).toBeVisible()
//   })

//   test('should handle terms agreement properly', async ({ page }) => {
//     // Initially terms checkbox should be unchecked
//     const termsCheckbox = page.getByRole('checkbox', {
//       name: /I agree to the Terms and Conditions/,
//     })
//     await expect(termsCheckbox).not.toBeChecked()

//     // Submit without checking terms
//     await page.getByRole('button', { name: 'Submit' }).click()

//     // Error should appear
//     await expect(page.getByText('Please agree to the terms and conditions')).toBeVisible()

//     // Check terms
//     await termsCheckbox.check()
//     await expect(termsCheckbox).toBeChecked()

//     // Submit button should be enabled
//     await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled()
//   })

//   test('should handle reset button correctly', async ({ page }) => {
//     // Click on reset button
//     await page.getByRole('button', { name: 'Reset' }).click()

//     // Verify confirmation dialog appears
//     await expect(page.getByRole('alertdialog')).toBeVisible()
//     await expect(page.getByText('Reset Form')).toBeVisible()
//     await expect(page.getByText('Are you sure you want to reset the form?')).toBeVisible()

//     // Cancel the reset
//     await page.getByRole('button', { name: 'Cancel' }).click()

//     // Verify we're still on review page
//     await expect(page.getByText('Review Information')).toBeVisible()

//     // Click reset again and confirm
//     await page.getByRole('button', { name: 'Reset' }).click()
//     await page.getByRole('button', { name: 'Reset' }).nth(1).click()

//     // Verify we're back to the first step
//     await expect(page.getByText('Client Information')).toBeVisible()
//     await expect(page.getByLabel(/Company\/Individual Name/)).toHaveValue('')
//   })
// })
