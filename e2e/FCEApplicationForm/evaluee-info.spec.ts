import { test, expect } from '@playwright/test'
import { fillClientInfo, fillEvalueeInfo } from './utils/form-helpers'

test.describe('FCE evaluee info form test', () => {
  test.beforeEach(async ({ page }) => {
    // navigate to the form page and complete the client info step
    await page.goto('/apply-credential-evaluation-for-uscis')
    await fillClientInfo(page)
    await page.getByTestId('form-next-button').click()

    // verify the evaluee info step is visible
    await expect(page.getByText('Evaluee Information')).toBeVisible()
  })

  test('should show validation error when required fields are empty', async ({ page }) => {
    // navigate to the next step without filling any fields
    await page.getByTestId('form-next-button').click()

    // verify the error message is visible
    await expect(page.getByRole('main').getByText('Please fill in all required')).toBeVisible()

    // verify the error message is visible for each required field
    await expect(page.getByText('Please select your pronouns')).toBeVisible()
    await expect(page.getByText('First name cannot be empty ')).toBeVisible()
    await expect(page.getByText('Last name cannot be empty')).toBeVisible()
    await expect(page.getByText('Please select month')).toBeVisible()
    await expect(page.getByText('Please select date')).toBeVisible()
    await expect(page.getByText('Please select year')).toBeVisible()

    // verify the error message is visible for each required field
    await expect(page.getByText('Please fill in the school name')).toBeVisible()
    await expect(page.getByText('Please fill in the country of study')).toBeVisible()
    await expect(page.getByText('Please fill in the degree obtained')).toBeVisible()
    await expect(page.getByText('Please fill in the start month')).toBeVisible()
    await expect(page.getByText('Please fill in the start year')).toBeVisible()
    await expect(page.getByText('Please fill in the end month')).toBeVisible()
    await expect(page.getByText('Please fill in the end year')).toBeVisible()
  })

  test('should correctly fill and validate personal information fields', async ({ page }) => {
    // test pronoun selection
    await page.getByTestId('pronouns-select').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^Mr. \(he\/him\)$/ })
      .click()

    // test first name and last name fields
    await page.getByTestId('first-name-input').fill('John')
    await page.getByTestId('last-name-input').fill('Doe')
    await page.getByTestId('middle-name-input').fill('A')

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

    // click the next button, confirm there is no error message
    await page.getByTestId('form-next-button').click()
    await expect(page.getByText('Please enter first name')).not.toBeVisible()
  })

  test('should validate date of birth correctly', async ({ page }) => {
    // fill in other required fields to correctly test birthday validation
    await page.getByTestId('pronouns-select').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^Mr. \(he\/him\)$/ })
      .click()
    await page.getByTestId('first-name-input').fill('John')
    await page.getByTestId('last-name-input').fill('Doe')

    // test 1: select the month of February, ensure the correct number of days (28 days for non-leap year)
    await page.getByTestId('date-of-birth-month-select').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^February$/ })
      .click()
    await page.getByTestId('date-of-birth-year-select').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^2023$/ })
      .click()
    await page.getByTestId('date-of-birth-day-select').click()
    await expect(page.locator('div[role="option"]').filter({ hasText: /^29$/ })).not.toBeVisible()
    await expect(page.locator('div[role="option"]').filter({ hasText: /^28$/ })).toBeVisible()

    // test 2: select a leap year February, ensure 29 days are visible
    // Clicking on 'Evaluee Information' to close the dropdown
    // Using { force: true } to ensure the click action is executed even if the element is not visible or interactable
    await page.getByText('Evaluee Information').click({ force: true })
    await page.getByTestId('date-of-birth-year-select').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^2020$/ })
      .click()
    await page.getByTestId('date-of-birth-day-select').click()
    await expect(page.locator('div[role="option"]').filter({ hasText: /^29$/ })).toBeVisible()

    // test 3: select a month with 31 days
    await page.getByText('Evaluee Information').click({ force: true })
    await page.getByTestId('date-of-birth-month-select').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^January$/ })
      .click()
    await page.getByTestId('date-of-birth-day-select').click()
    await expect(page.locator('div[role="option"]').filter({ hasText: /^31$/ })).toBeVisible()
  })

  test('should handle education records correctly', async ({ page }) => {
    // fill in the first education record
    await page.getByTestId('school-name-input-0').fill('Harvard University')
    await page.getByTestId('study-country-select-0').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^United States$/ })
      .click()
    await page.getByTestId('degree-obtained-input-0').fill('Bachelor of Science')

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

    // click the add education button
    await page.getByTestId('add-education-button').click()

    // verify the new education record fields are visible
    await expect(page.getByTestId('school-name-input-1')).toBeVisible()

    // fill in the second education record
    await page.getByTestId('school-name-input-1').fill('MIT')
    await page.getByTestId('study-country-select-1').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^United States$/ })
      .click()
    await page.getByTestId('degree-obtained-input-1').fill('Master of Science')

    // fill in the study duration of the second record
    await page.getByTestId('start-date-month-select-1').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^September$/ })
      .click()
    await page.getByTestId('start-date-year-select-1').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^2017$/ })
      .click()

    await page.getByTestId('end-date-month-select-1').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^June$/ })
      .click()
    await page.getByTestId('end-date-year-select-1').click()
    await page
      .locator('div[role="option"]')
      .filter({ hasText: /^2019$/ })
      .click()

    // test the delete education record function
    await page.getByTestId('remove-education-button-1').click()

    // verify the second record has been deleted
    await expect(page.getByTestId('school-name-input-1')).not.toBeVisible()
  })

  test('should maintain state when navigating between steps', async ({ page }) => {
    // fill in the evaluee info form
    await fillEvalueeInfo(page, {
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'A',
      schoolName: 'Test University',
      degreeObtained: 'Bachelor of Science',
    })

    // navigate to the next step
    await page.getByTestId('form-next-button').click()

    // navigate back to the evaluee info page
    await page.getByTestId('form-previous-button').click()

    // verify the data is retained
    await expect(page.getByTestId('first-name-input')).toHaveValue('John')
    await expect(page.getByTestId('last-name-input')).toHaveValue('Doe')
    await expect(page.getByTestId('middle-name-input')).toHaveValue('A')
    await expect(page.getByTestId('school-name-input-0')).toHaveValue('Test University')
    await expect(page.getByTestId('degree-obtained-input-0')).toHaveValue('Bachelor of Science')
  })

  test('should reset form when refreshing browser and no draft is saved', async ({ page }) => {
    // fill in the basic info
    await page.getByTestId('first-name-input').fill('Refresh Test')
    await page.getByTestId('last-name-input').fill('User')

    // refresh the page
    await page.getByRole('button', { name: 'Reset Application' }).click()
    await page.getByRole('button', { name: 'Confirm Reset' }).click()

    // fill in the client info and navigate to the evaluee info page
    await fillClientInfo(page)
    await page.getByTestId('form-next-button').click()

    // verify the form fields are reset
    await expect(page.getByTestId('first-name-input')).toHaveValue('')
    await expect(page.getByTestId('last-name-input')).toHaveValue('')
  })

  test('should complete the form with all fields correctly filled', async ({ page }) => {
    // fill in all fields
    await fillEvalueeInfo(page)

    // submit the form and navigate to the next step
    await page.getByTestId('form-next-button').click()

    await expect(page.getByText('Service Selection')).toBeVisible()
  })
})
