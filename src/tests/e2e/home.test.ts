import { test, expect } from '@playwright/test'

test('home page loads successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Beer Cellar/)
})

test('sign-in link is visible', async ({ page }) => {
  await page.goto('/')
  const signIn = page.getByRole('link', { name: /sign in/i })
  await expect(signIn).toBeVisible()
})

test('header displays brand name', async ({ page }) => {
  await page.goto('/')
  const brand = page.getByRole('link', { name: /beer cellar/i }).first()
  await expect(brand).toBeVisible()
})
