import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/calculator', name: 'Calculator' },
  { path: '/about', name: 'About' },
  { path: '/blog', name: 'Blog' },
] as const;

// Chromium-only tests (Firefox/WebKit require system deps not available in this environment)
// To enable multi-browser testing, install with: sudo npx playwright install-deps

test.describe('Browser: Chromium', () => {
  for (const { path, name } of PAGES) {
    test(`${name} loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);
      const real = errors.filter(e =>
        !e.includes('Content Security Policy')
        && !e.includes('clarity.ms')
        && !e.includes('favicon')
        && !e.includes('404')
      );
      expect(real.length).toBe(0);
    });
  }
});
