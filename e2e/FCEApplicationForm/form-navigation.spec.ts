// import { test, expect } from '@playwright/test'
// import { fillClientInfoForm, fillEvalueeInfoForm } from './utils/form-helpers'

// test.describe('FCE form navigation test', () => {
//   test.beforeEach(async ({ page }) => {
//     // navigate to the form page
//     await page.goto('/apply-credential-evaluation-for-uscis')
//   })

//   test('should show the client info step', async ({ page }) => {
//     // verify the title is visible
//     await expect(page.getByText('Client Information')).toBeVisible()

//     // verify the next button is visible
//     await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()

//     // verify the previous button is not visible or disabled
//     await expect(page.getByRole('button', { name: 'Previous' })).not.toBeVisible()
//   })

//   test('should show validation error when clicking next without filling required fields', async ({
//     page,
//   }) => {
//     // click the next button
//     await page.getByRole('button', { name: 'Next' }).click()

//     // verify the error message is visible
//     await expect(page.getByText('Please fill in all required fields')).toBeVisible()
//   })

//   test('should navigate to the evaluee info step after filling the first step', async ({
//     page,
//   }) => {
//     // fill the client info form
//     await fillClientInfoForm(page)

//     // click the next button
//     await page.getByRole('button', { name: 'Next' }).click()

//     // verify the evaluee info step is visible
//     await expect(page.getByText('Evaluee Information')).toBeVisible()

//     // verify the previous button is visible
//     await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible()
//   })

//   test('should navigate back to the client info step after clicking the previous button', async ({
//     page,
//   }) => {
//     // fill the client info and navigate to the evaluee info step
//     await fillClientInfoForm(page)
//     await page.getByRole('button', { name: 'Next' }).click()

//     // verify the evaluee info step is visible
//     await expect(page.getByText('Evaluee Information')).toBeVisible()

//     // click the previous button
//     await page.getByRole('button', { name: 'Previous' }).click()

//     // verify the client info step is visible
//     await expect(page.getByText('Client Information')).toBeVisible()
//   })

//   test('should navigate to the review info step after filling all steps', async ({ page }) => {
//     // fill the client info
//     await fillClientInfoForm(page)
//     await page.getByRole('button', { name: 'Next' }).click()

//     // fill the evaluee info
//     await fillEvalueeInfoForm(page)
//     await page.getByRole('button', { name: 'Next' }).click()

//     // if the service selection step exists, fill it and continue
//     if (await page.getByText('Service Selection').isVisible()) {
//       // select the service
//       await page.getByLabel(/Foreign Credential Evaluation/).check()
//       await page
//         .getByLabel(/Regular/)
//         .first()
//         .check()
//       await page.getByLabel(/USPS Priority Domestic/).check()

//       // click the next button
//       await page.getByRole('button', { name: 'Next' }).click()
//     }

//     // verify the review info step is visible
//     await expect(page.getByText('Review Information')).toBeVisible()
//   })
// })
