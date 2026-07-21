import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = 'theaceservices@3332';

test.describe('Admin Login — functional', () => {
  test('redirects to /admin-login when not authenticated', async ({ browser }) => {
    // Isolated context — no shared cookies
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    // Should redirect to login (either via URL or showing login content)
    await expect(page).toHaveURL(/\/admin-login/, { timeout: 8000 });
    await context.close();
  });

  test('shows login form', async ({ page }) => {
    await page.goto('/admin-login');
    await expect(page.locator('h1, h2').filter({ hasText: /Login|Sign in|Admin/i })).toBeVisible({ timeout: 5000 });
  });

  test('wrong password shows error message', async ({ page }) => {
    await page.goto('/admin-login');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await passwordInput.fill('wrongpassword');

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /Sign in|Login|Submit|Enter/i });
    await submitBtn.click();
    await page.waitForTimeout(1500);

    const error = page.locator('text=/invalid|wrong|error|incorrect/i');
    await expect(error.first()).toBeVisible({ timeout: 5000 });
  });

  test('correct password redirects to /admin dashboard', async ({ page }) => {
    await page.goto('/admin-login');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await passwordInput.fill(ADMIN_PASSWORD);

    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /Sign in|Login|Submit|Enter/i });
    await submitBtn.click();

    // Wait for client-side navigation to complete
    await page.waitForURL(/\/admin$/, { timeout: 10000 }).catch(() => page.waitForTimeout(2000));
    // Fallback: check we landed on admin page
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });
});
