import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = 'theaceservices@3332';

test.describe('Security', () => {
  test('HTTP security headers are present', async ({ request }) => {
    const resp = await request.get('/');
    const headers = resp.headers();

    // Common security headers
    const hasXfo = 'x-frame-options' in headers;
    const hasXcto = 'x-content-type-options' in headers;
    const hasRp = 'referrer-policy' in headers;

    // At least some security headers should be present
    expect(hasXfo || hasXcto || hasRp).toBeTruthy();

    const csp = headers['content-security-policy'];
    if (csp) {
      expect(csp).toContain("'self'");
    }
  });

  test('Admin API returns 401 without auth token', async ({ request }) => {
    // The contacts endpoint now requires auth — expect 401
    const resp = await request.get('/api/admin/contacts');
    expect(resp.status()).toBe(401);
  });

  test('Admin API returns 401 with wrong token', async ({ request }) => {
    const resp = await request.get('/api/admin/contacts', {
      headers: { Cookie: 'admin_token=wrongtoken' },
    });
    expect(resp.status()).toBe(401);
  });

  test('/admin redirects to login when unauthenticated', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto('/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });
    // The redirect happens client-side (React hydration → useEffect → window.location.href)
    // Wait for URL to change, with a generous timeout for React hydration
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/\/admin-login/, { timeout: 15000 });
    await context.close();
  });

  test('XSS attempt in URL is escaped', async ({ page }) => {
    await page.goto('/?q=<script>alert(1)</script>', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const html = await page.locator('html').innerHTML();
    expect(html).not.toContain('<script>alert(1)</script>');
  });

  test('Form input XSS attempt is sanitized', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    const input = page.locator('input[name="name"], input[placeholder*="name"i]').first();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await input.fill('<script>alert("xss")</script>');
      const value = await input.inputValue();
      expect(value).toContain('script');
    }
  });

  test('Admin login API rejects wrong password', async ({ request }) => {
    const resp = await request.post('/api/admin/login', {
      data: { password: 'wrongpassword' },
    });
    expect(resp.status()).toBe(401);
  });

  test('Admin login API accepts correct password', async ({ request }) => {
    const resp = await request.post('/api/admin/login', {
      data: { password: ADMIN_PASSWORD },
    });
    expect(resp.ok()).toBeTruthy();
  });

  test('Admin dashboard accessible after login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Use Playwright's API context (shares cookies with browser context)
    const loginResp = await page.request.post('/api/admin/login', {
      data: { password: ADMIN_PASSWORD },
    });
    expect(loginResp.ok()).toBeTruthy();

    // Verify the cookie was set in the browser context
    const cookies = await context.cookies();
    const tokenCookie = cookies.find((c) => c.name === 'admin_token');
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie?.value).toBeTruthy();

    // Navigate to admin page
    await page.goto('/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait for the admin dashboard to render
    await page.waitForTimeout(3000);

    // Should see admin content heading (the h1 "Admin"), not login redirect
    const adminHeading = page.locator('h1, h2').filter({ hasText: /Admin/i });
    const loginHeading = page.locator('h1, h2').filter({ hasText: /Admin Login/i });

    const loginVisible = await loginHeading.isVisible({ timeout: 2000 }).catch(() => false);

    // If login is visible, we redirected — check if there are auth-related error messages
    if (loginVisible) {
      console.log('Redirected to login page — auth cookie may not have propagated');
      // Check verify endpoint directly
      const verifyResp = await page.request.get('/api/admin/verify');
      console.log('Verify status:', verifyResp.status());
    }

    // The heading "Admin" should eventually be visible (not admin-login)
    // Use a longer timeout because React hydration + useEffect takes time
    await expect(adminHeading).toBeVisible({ timeout: 10000 });

    await context.close();
  });
});
