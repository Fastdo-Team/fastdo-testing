import { test as setup, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.resolve(__dirname, '../playwright/.auth/user.json');

/**
 * Chạy 1 lần trước toàn bộ test khi có AUTH_USERNAME/AUTH_PASSWORD trong .env
 * (xem playwright.config.ts — project "setup"). Locator dưới đây đã xác nhận với DOM
 * thật (server local, 2026-08-18) qua Playwright MCP/Browser — không còn placeholder.
 * Sau khi đăng nhập, Fastdo yêu cầu chọn tổ chức — mặc định chọn "DEMO FASTDO" vì đây
 * là tổ chức demo, tránh đụng vào dữ liệu tổ chức thật/khách hàng thật.
 */
setup('authenticate', async ({ page }) => {
  const username = process.env.AUTH_USERNAME;
  const password = process.env.AUTH_PASSWORD;
  const orgName = process.env.AUTH_ORG || 'DEMO FASTDO';

  if (!username || !password) {
    setup.skip(true, 'Không có AUTH_USERNAME/AUTH_PASSWORD trong .env — bỏ qua bước đăng nhập.');
    return;
  }

  // Đi qua /logout trước để đảm bảo trạng thái sạch — đã xác nhận thật: với 1 phiên có
  // cookie dở dang (không hẳn anonymous, không hẳn đã login), root "/" có thể hiện màn
  // splash marketing thay vì form login thẳng. /logout luôn trả về đúng form login.
  await page.goto('/logout');
  await page.getByPlaceholder('Nhập email hoặc số điện thoại').fill(username);
  await page.getByPlaceholder('Nhập mật khẩu').fill(password);
  await page.locator('button:has-text("Đăng nhập")').click();

  // Sau login: nếu tài khoản thuộc nhiều tổ chức, Fastdo hiện màn "Chọn tổ chức đăng nhập"
  const orgLink = page.getByRole('link', { name: orgName, exact: true });
  if (await orgLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    await orgLink.click();
  }

  await expect(page.getByText('Ứng dụng của tôi')).toBeVisible({ timeout: 15000 });

  await page.context().storageState({ path: AUTH_FILE });
});
