import { test, expect } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';
import type { AddressInfo } from 'net';

/**
 * Smoke test cho CHÍNH bộ khung automation (không liên quan fastdo-server / beta).
 * Mục tiêu: chứng minh Playwright + Chrome for Testing + reporter + screenshot pipeline
 * hoạt động đúng, và quan trọng nhất — hard assertion THẬT SỰ có thể FAIL, không còn
 * bị nuốt lỗi âm thầm như spec cũ. Chạy độc lập bằng `npm run test:smoke`.
 */

const FIXTURE_HTML = fs.readFileSync(
  path.resolve(__dirname, '../../fixtures/local-smoke/index.html'),
);

let server: http.Server;
let baseUrl: string;

test.beforeAll(async () => {
  server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(FIXTURE_HTML);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('harness thật sự chạy được: load local, tương tác, và PASS đúng nghĩa', async ({ page }) => {
  await page.goto(baseUrl);

  await expect(page.locator('#hero')).toHaveText('Harness OK');
  await expect(page.locator('#hidden-message')).toBeHidden();

  await page.locator('#reveal-btn').click();
  await expect(page.locator('#hidden-message')).toBeVisible();

  await page.screenshot({ path: '../reports/screenshots/SMOKE_harness_ok.png', fullPage: true });
});

test('hard assertion phải thật sự FAIL khi phần tử không tồn tại', async ({ page }) => {
  test.fail(true, 'Minh chứng: khác với spec cũ (isVisible().catch(()=>false)), assertion ở đây không bị nuốt lỗi.');
  await page.goto(baseUrl);
  await expect(page.locator('#element-khong-ton-tai')).toBeVisible({ timeout: 2000 });
});
