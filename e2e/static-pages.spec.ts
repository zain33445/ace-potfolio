import { test, expect } from '@playwright/test';

const STATIC_PAGES = [
  { path: '/about', title: /About/i },
  { path: '/pricing', title: /Pricing|Cost/i },
  { path: '/projects', title: /Projects|Portfolio/i },
  { path: '/testimonials', title: /Testimonial|Review/i },
] as const;

test.describe('Static Pages — functional', () => {
  for (const { path, title } of STATIC_PAGES) {
    test(`${path} loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      const response = await page.goto(path, { timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });

      // Should load successfully
      if (response) {
        expect(response.status()).toBeLessThan(500);
      }

      // Title should match
      const pageTitle = await page.title();
      expect(pageTitle).toMatch(title);

      // Body renders content
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const text = await body.textContent();
      expect(text?.length).toBeGreaterThan(50);

      // No console errors (filter known benign ones)
      const filtered = errors.filter(
        (e) => !e.includes('favicon')
          && !e.includes('third-party')
          && !e.includes('Failed to load resource')
          && !e.includes('404')
          && !e.includes('Not Found')
          && !e.includes('clarity')
      );
      if (filtered.length > 0) {
        console.log(`Console errors for ${path}:`, filtered);
      }
      expect(filtered.length).toBe(0);
    });
  }
});
