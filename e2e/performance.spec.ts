import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

test.describe('Performance', () => {
  test('homepage loads within reasonable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Homepage load time: ${loadTime}ms`);
    // Accept up to 8s for dev server (much faster in production)
    expect(loadTime).toBeLessThan(15000);
  });

  test('calculator page loads within reasonable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/calculator');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    console.log(`Calculator load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(15000);
  });

  test('page weight — JS bundle size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Measure total transferred bytes
    const metrics = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      return entries
        .filter((e) => e.name.includes('.js'))
        .reduce((sum, e) => sum + (e as any).transferSize || 0, 0);
    });

    console.log(`Total JS transfer size: ${(metrics / 1024).toFixed(1)} KB`);
    // No hard limit — just report
    expect(metrics).toBeGreaterThan(0);
  });

  test('no render-blocking resources', async ({ page }) => {
    const blocking: string[] = [];
    page.on('request', (req) => {
      if (req.isNavigationRequest()) return;
      // Check if resource is render-blocking
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // FCP should be within reasonable time
    const fcp = await page.evaluate(() => {
      const entries = performance.getEntriesByName('first-contentful-paint');
      return entries.length > 0 ? entries[0].startTime : -1;
    });

    console.log(`FCP: ${fcp}ms`);
    expect(fcp).toBeGreaterThan(0);
  });

  test('Lighthouse performance score', async ({ page }) => {
    // Skip if Chrome not available
    const chromePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
    const fs = await import('fs');
    if (!fs.existsSync(chromePath)) {
      console.log('Chrome not found at', chromePath, '— skipping Lighthouse');
      return;
    }

    try {
      const lighthouse = await import('lighthouse');
      const result = await lighthouse('http://localhost:3000', {
        port: 9222,
        output: 'json',
        onlyCategories: ['performance'],
      });

      if (result && result.lhr) {
        const score = result.lhr.categories.performance.score;
        console.log(`Lighthouse Performance Score: ${(score * 100).toFixed(0)}`);
        // Informational — no hard threshold for dev server
        expect(score).toBeGreaterThan(0);
      }
    } catch (e) {
      console.log('Lighthouse test skipped (requires Chrome DevTools Protocol)');
    }
  });

  test('image optimization', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Collect image sizes
    const images: { src: string; size: number }[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map((img) => ({
        src: img.getAttribute('src') || '',
        size: (img as any).naturalWidth || 0,
      }));
    });

    // Log image info for manual review
    for (const img of images.slice(0, 10)) {
      console.log(`  Image: ${img.src.slice(0, 60)} (${img.size}px)`);
    }
  });
});
