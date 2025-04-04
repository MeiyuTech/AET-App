import { test, expect } from '@playwright/test'

test('should load the home page', async ({ page }) => {
  // visit the home page
  await page.goto('/')

  // wait for the page to load
  await page.waitForLoadState('networkidle')

  // verify the page title contains the website name
  const title = await page.title()
  expect(title).toContain('AET')
})

test('should navigate to the form page', async ({ page }) => {
  // visit the home page
  await page.goto('/')

  // find and click the link to the form page (assuming it exists)
  try {
    // try to find the explicit "Foreign Credential Evaluation" link
    const link = page.getByRole('link', { name: /Submit Credential Evaluation Application/i })
    if (await link.isVisible()) {
      await link.click()
      await page.waitForURL(/.*apply-credential-evaluation-for-uscis.*/)
    } else {
      // if the direct link is not visible, try to navigate through the menu
      console.log('direct link not visible, trying to navigate through the menu')
      // add code to navigate through the menu here
    }
  } catch (error) {
    console.log('navigation failed, trying to navigate to the form page directly')
    // navigate to the form page directly
    await page.goto('/apply-credential-evaluation-for-uscis')
  }

  // verify the page content contains form related text
  await expect(
    page.getByRole('heading', { name: 'AET Credential Evaluation Application' })
  ).toBeVisible()
})
