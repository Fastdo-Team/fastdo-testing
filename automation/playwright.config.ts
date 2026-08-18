import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// TEST_ENV chọn file .env tương ứng: local | beta (mặc định beta, giữ hành vi cũ)
// Nạp theo lớp: .env.<TEST_ENV> (giá trị mặc định, an toàn để commit) rồi
// .env.<TEST_ENV>.local (bí mật cá nhân — mật khẩu thật, gitignored) đè lên trên.
const TEST_ENV = process.env.TEST_ENV || 'beta';
const envFile = path.resolve(__dirname, `.env.${TEST_ENV}`);
if (TEST_ENV !== 'beta' && !fs.existsSync(envFile)) {
  throw new Error(
    `Thiếu file .env.${TEST_ENV}. Chạy: cp .env.example .env.${TEST_ENV} rồi sửa BASE_URL cho đúng.`,
  );
}
dotenv.config({ path: envFile, quiet: true });
dotenv.config({ path: path.resolve(__dirname, `.env.${TEST_ENV}.local`), override: true, quiet: true });

const AUTH_FILE = path.resolve(__dirname, 'playwright/.auth/user.json');
const hasAuthCredentials = Boolean(process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD);
const hasStoredAuth = fs.existsSync(AUTH_FILE);

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../reports/playwright-report', open: 'never' }],
    ['json', { outputFile: '../reports/test-results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://beta.fastdo.vn',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    // Server local (dotnet run) dùng chứng chỉ dev tự ký — chỉ bỏ qua khi TEST_ENV=local
    ignoreHTTPSErrors: TEST_ENV === 'local',
    locale: 'vi-VN',
    // Frontend Fastdo có kiểm tra navigator.webdriver và phục vụ trang marketing thay vì
    // form login thật khi phát hiện trình duyệt tự động hoá (đã xác nhận 2026-08-18: cùng
    // 1 request nhưng navigator.webdriver=true luôn bị điều hướng khác). Tắt cờ này để
    // Chrome for Testing được đối xử như trình duyệt thật khi test nội bộ (không phải né
    // security — đây là app + tài khoản test của chính công ty).
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
  },
  projects: [
    // Project "setup" chỉ chạy khi có AUTH_USERNAME/AUTH_PASSWORD trong .env — xem tests/auth.setup.ts
    ...(hasAuthCredentials
      ? [
          {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
          },
        ]
      : []),
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        ...(hasAuthCredentials || hasStoredAuth ? { storageState: AUTH_FILE } : {}),
      },
      ...(hasAuthCredentials ? { dependencies: ['setup'] } : {}),
    },
    {
      name: 'smoke',
      testDir: './tests/smoke',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
