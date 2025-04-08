// import { test, expect } from '@playwright/test'
// import { fillCompleteForm } from './utils/form-helpers'

// test.describe('FCE Form Submission Tests', () => {
//   test.beforeEach(async ({ page }) => {
//     await page.goto('/apply-credential-evaluation-for-uscis')
//   })

//   test('should allow saving form as draft', async ({ page }) => {
//     // Fill the client info section
//     await page.getByLabel(/Company\/Individual Name/).fill('Draft Test Company')
//     await page.getByLabel(/Country/).click()
//     await page.getByText('United States').click()
//     await page
//       .getByLabel(/Street Address/)
//       .first()
//       .fill('123 Draft St')
//     await page.getByLabel(/City/).fill('Draft City')
//     await page.getByLabel(/State/).click()
//     await page.getByText('California').click()
//     await page.getByLabel(/Zip Code/).fill('12345')
//     await page.getByLabel(/Phone/).fill('123-456-7890')
//     await page.getByLabel(/Email/).fill('draft@example.com')
//     await page.getByLabel(/Office/).click()
//     await page.getByText('San Francisco').click()
//     await page.getByLabel(/Purpose/).click()
//     await page.getByText('Evaluation for Employment').click()

//     // Click save draft button
//     await page.getByRole('button', { name: 'Save Draft' }).click()

//     // Wait for success message
//     await expect(page.getByText('Draft saved successfully')).toBeVisible({ timeout: 10000 })

//     // Verify draft ID is displayed
//     await expect(page.getByText(/Draft ID:/).first()).toBeVisible()
//   })

//   test('should display terms and conditions checkbox before submission', async ({ page }) => {
//     // Fill all form steps
//     await fillCompleteForm(page)

//     // Verify we're on the review step
//     await expect(page.getByText('Review Information')).toBeVisible()

//     // Check for terms and conditions
//     await expect(page.getByText('I agree to the Terms and Conditions')).toBeVisible()
//     await expect(
//       page.getByRole('checkbox', { name: /I agree to the Terms and Conditions/ })
//     ).toBeVisible()

//     // Check for submit button
//     await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
//   })

//   test('should not allow submission without agreeing to terms', async ({ page }) => {
//     // Fill all form steps
//     await fillCompleteForm(page)

//     // Without checking the terms checkbox, try to submit
//     await page.getByRole('button', { name: 'Submit' }).click()

//     // Verify error message
//     await expect(page.getByText('Please agree to the terms and conditions')).toBeVisible()
//   })

//   test('should display confirmation dialog when submitting', async ({ page }) => {
//     // Fill all form steps
//     await fillCompleteForm(page)

//     // Check terms checkbox
//     await page.getByRole('checkbox', { name: /I agree to the Terms and Conditions/ }).check()

//     // Click submit button
//     await page.getByRole('button', { name: 'Submit' }).click()

//     // Verify confirmation dialog appears
//     await expect(page.getByRole('alertdialog')).toBeVisible()
//     await expect(page.getByText('Confirm Submission')).toBeVisible()
//     await expect(page.getByText('Are you sure you want to submit this application?')).toBeVisible()

//     // Verify dialog has Cancel and Submit buttons
//     await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
//     await expect(page.getByRole('button', { name: 'Submit' }).nth(1)).toBeVisible()
//   })

//   test('should allow cancelling the submission dialog', async ({ page }) => {
//     // Fill all form steps
//     await fillCompleteForm(page)

//     // Check terms checkbox
//     await page.getByRole('checkbox', { name: /I agree to the Terms and Conditions/ }).check()

//     // Click submit button
//     await page.getByRole('button', { name: 'Submit' }).click()

//     // Click cancel in the dialog
//     await page.getByRole('button', { name: 'Cancel' }).click()

//     // Verify we're still on the review page
//     await expect(page.getByText('Review Information')).toBeVisible()
//   })

//   test('should show confirmation after successful submission', async ({ page }) => {
//     // Mock the successful form submission response
//     await page.route('**/api/applications/fce', async (route) => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           success: true,
//           data: {
//             id: 'test-application-id',
//             status: 'submitted',
//             due_amount: 150.0,
//           },
//         }),
//       })
//     })

//     // Fill all form steps
//     await fillCompleteForm(page)

//     // Check terms checkbox
//     await page.getByRole('checkbox', { name: /I agree to the Terms and Conditions/ }).check()

//     // Click submit button
//     await page.getByRole('button', { name: 'Submit' }).click()

//     // Click submit in the confirmation dialog
//     await page.getByRole('button', { name: 'Submit' }).nth(1).click()

//     // Verify success page loads
//     await expect(page.getByText('Application Submitted Successfully')).toBeVisible({
//       timeout: 15000,
//     })
//     await expect(page.getByText('Thank you for your application')).toBeVisible()

//     // Verify application ID is shown
//     await expect(page.getByText('test-application-id')).toBeVisible()

//     // Verify payment information is shown
//     await expect(page.getByText('$150.00')).toBeVisible()
//     await expect(page.getByRole('button', { name: 'Proceed to Payment' })).toBeVisible()
//   })

//   test('should handle submission error gracefully', async ({ page }) => {
//     // Mock a failed form submission response
//     await page.route('**/api/applications/fce', async (route) => {
//       await route.fulfill({
//         status: 500,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           success: false,
//           error: 'Server error occurred',
//         }),
//       })
//     })

//     // Fill all form steps
//     await fillCompleteForm(page)

//     // Check terms checkbox
//     await page.getByRole('checkbox', { name: /I agree to the Terms and Conditions/ }).check()

//     // Click submit button
//     await page.getByRole('button', { name: 'Submit' }).click()

//     // Click submit in the confirmation dialog
//     await page.getByRole('button', { name: 'Submit' }).nth(1).click()

//     // Verify error toast appears
//     await expect(page.getByText('Failed to submit application')).toBeVisible({ timeout: 10000 })

//     // Verify we're still on the review page
//     await expect(page.getByText('Review Information')).toBeVisible()
//   })
// })
