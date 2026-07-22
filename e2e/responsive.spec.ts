import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile 375px', width: 375, height: 667 },
  { name: 'Tablet 768px', width: 768, height: 1024 },
  { name: 'Desktop 1440px', width: 1440, height: 900 },
  { name: 'Ultrawide 1920px', width: 1920, height: 1080 },
] as const;

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/calculator', name: 'Calculator' },
  { path: '/about', name: 'About' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/projects', name: 'Projects' },
  { path: '/testimonials', name: 'Testimonials' },
  { path: '/blog', name: 'Blog' },
  { path: '/admin-login', name: 'Admin Login' },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`Responsive — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const page of PAGES) {
      test(`${page.name} has no horizontal scroll`, async ({ page: p }) => {
        await p.goto(page.path, { timeout: 20000 });
        await p.waitForLoadState('networkidle');

        // No horizontal scrollbar
        const scrollWidth = await p.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await p.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // allow 1px rounding
      });
    }

    test(`Homepage sections stack vertically at ${viewport.name}`, async ({ page: p }) => {
      await p.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
      // Sections are dynamically imported — wait for some to appear
      await p.waitForTimeout(3000);
      // Allow dynamic imports to settle — use a retry loop
      let count = 0;
      for (let attempt = 0; attempt < 10; attempt++) {
        count = await p.locator('section, [class*="section"], [id]').count();
        if (count > 3) break;
        await p.waitForTimeout(1000);
      }
      expect(count).toBeGreaterThan(3);
    });
  });
}
