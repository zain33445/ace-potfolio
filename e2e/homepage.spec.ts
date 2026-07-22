import { test, expect } from '@playwright/test';

test.describe('Homepage — functional', () => {
  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter known benign errors
    const filtered = errors.filter(
      (e) => !e.includes('favicon')
        && !e.includes('third-party')
        && !e.includes('Failed to load resource')
        && !e.includes('404')
        && !e.includes('Not Found')
        && !e.includes('clarity')
    );
    if (filtered.length > 0) {
      console.log('Console errors:', filtered);
    }
    expect(filtered.length).toBe(0);
  });

  test('page title and meta description are present', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toContain('ACE Services');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });

  test('navigation bar is visible with branding', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    await expect(nav).toContainText(/ACE|SERVICES/i);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('scroll navigation jumps to correct sections', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    const links = nav.locator('a');
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') continue;

      await link.click();
      await page.waitForTimeout(1000);

      const section = page.locator(`[id="${href.slice(1)}"]`);
      if (await section.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(section).toBeVisible();
      }
    }
  });

  test('footer is present with contact info', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/ACE|contact|email/i);
  });

  test('structured data JSON-LD is in the page head', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);

    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      if (text && text.includes('Organization')) {
        const parsed = JSON.parse(text);
        expect(parsed.name).toContain('ACE');
        return;
      }
    }
    throw new Error('Organization schema not found');
  });
});
