/**
 * Static prerender script for MoneyTrekApp
 * Runs after `npm run build` to generate real HTML for public pages.
 * Uses Playwright (already a devDependency) to render pages and save HTML.
 * This means AI crawlers and search engines see actual content, not an empty SPA shell.
 */

import { chromium } from '@playwright/test';
import { preview } from 'vite';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

// Public routes to prerender (no auth required)
const ROUTES = [
  '/',
  '/features',
  '/faq',
  '/how-it-works',
  '/privacy',
  '/terms',
  '/refund-policy',
  '/demo',
];

async function run() {
  console.log('🔄 Starting static prerender...\n');

  let server;
  try {
    server = await preview({
      root: ROOT,
      preview: { port: 4173, open: false },
    });
    console.log('  ✓ Preview server started on port 4173\n');
  } catch (err) {
    console.error('  ✗ Failed to start preview server:', err.message);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Suppress console errors from the app (e.g. network calls in preview env)
  page.on('console', () => {});
  page.on('pageerror', () => {});

  let succeeded = 0;
  let failed = 0;

  for (const route of ROUTES) {
    try {
      await page.goto(`http://localhost:4173${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      // Wait for React to render content into #root
      await page.waitForSelector('#root > *', { timeout: 8000 }).catch(() => {});
      // Extra wait for useEffect hooks (JSON-LD injection, etc.)
      await page.waitForTimeout(800);

      const html = await page.content();

      // Build output path: /faq -> dist/faq/index.html, / -> dist/index.html
      const parts = route === '/' ? [] : route.split('/').filter(Boolean);
      const outDir = join(DIST, ...parts);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, 'index.html'), html, 'utf8');

      console.log(`  ✓ ${route}`);
      succeeded++;
    } catch (err) {
      console.warn(`  ⚠ ${route}: ${err.message} (skipped — will use SPA fallback)`);
      failed++;
    }
  }

  await browser.close();
  server.httpServer?.close();

  console.log(`\n✅ Prerender complete: ${succeeded} succeeded, ${failed} skipped`);
}

run().catch(err => {
  console.error('\n✗ Prerender failed:', err.message);
  // Don't exit with error — deploy should still succeed with SPA fallback
});
