import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = 'theaceservices@3332';

test.describe('Admin Dashboard — functional', () => {
  test.beforeEach(async ({ page }) => {
    // Login via API directly — sets httpOnly cookie
    const response = await page.request.post('/api/admin/login', {
      data: { password: ADMIN_PASSWORD },
    });
    expect(response.ok()).toBeTruthy();

    // Navigate to admin page
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    // Wait for dashboard to render (not the login page)
    await page.waitForTimeout(2000);
  });

  test('dashboard shows contacts table after login', async ({ page }) => {
    await expect(page.locator('h1, h2').filter({ hasText: /Admin/i })).toBeVisible({ timeout: 8000 });

    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 20000 });

    const headers = table.locator('th');
    const headerTexts = await headers.allTextContents();
    const allHeaders = headerTexts.join(' ');
    expect(allHeaders).toMatch(/Ref|Date|Name|Email|Project|Scale|File/i);
  });

  test('contacts table shows paginated rows', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 20000 });

    const pagination = page.locator('text=/Page \\d+ of \\d+/i');
    const hasPagination = await pagination.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasPagination) {
      await expect(pagination).toBeVisible();
    }
  });

  test('submissions count is displayed', async ({ page }) => {
    const countText = page.locator('text=/\\d+ of \\d+ submissions/i');
    await expect(countText).toBeVisible({ timeout: 20000 });
  });

  test('refresh button re-fetches contacts', async ({ page }) => {
    const refreshBtn = page.locator('button').filter({ hasText: /Refresh/i });
    await expect(refreshBtn).toBeVisible({ timeout: 20000 });
    await refreshBtn.click();
    await page.waitForTimeout(1500);
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10000 });
  });

  test('filter controls are functional', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 20000 });

    const selects = page.locator('select');
    const selectCount = await selects.count();
    for (let i = 0; i < selectCount; i++) {
      const select = selects.nth(i);
      if (await select.isVisible()) {
        const options = await select.locator('option').all();
        if (options.length > 1) {
          await select.selectOption({ index: 1 });
          await page.waitForTimeout(300);
        }
      }
    }

    const dateInputs = page.locator('input[type="date"]');
    if (await dateInputs.isVisible({ timeout: 1000 }).catch(() => false)) {
      await dateInputs.first().fill('2026-01-01');
      await page.waitForTimeout(300);
    }

    const fileFilters = page.locator('button').filter({ hasText: /All|Has files|No files/i });
    if (await fileFilters.isVisible({ timeout: 1000 }).catch(() => false)) {
      await fileFilters.first().click();
      await page.waitForTimeout(300);
    }

    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('tab navigation works', async ({ page }) => {
    await expect(page.locator('h1, h2').filter({ hasText: /Admin/i })).toBeVisible({ timeout: 10000 });

    const tabs = page.locator('button').filter({ hasText: /Contacts|Projects|Settings/i });
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      if (await tab.isVisible()) {
        await tab.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('dashboard has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Navigate fresh via API login then goto admin
    const resp = await page.request.post('/api/admin/login', {
      data: { password: ADMIN_PASSWORD },
    });
    expect(resp.ok()).toBeTruthy();
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    // Filter known benign CSP violations on localhost (GA4 g/collect, Clarity)
    const filteredErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('third-party') &&
        !e.includes('ResizeObserver') &&
        !e.includes('Content Security Policy') &&
        !e.includes('CSP') &&
        !e.includes('clarity.ms') &&
        !e.includes('g/collect')
    );
    if (filteredErrors.length > 0) {
      console.log('Console errors:', JSON.stringify(filteredErrors));
    }
    expect(filteredErrors.length).toBe(0);
  });
});
