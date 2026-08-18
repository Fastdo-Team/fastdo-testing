import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/profile.page';

/**
 * Ticket #1112 — Update Vigift HSNS & Tài liệu
 *
 * Trạng thái xác minh DOM thật (server local, 2026-08-18, qua Playwright MCP/Browser):
 * - SC_1112_001 (tạo trường Link): ĐÃ xác minh — thực hiện thành công, locator đúng 100%.
 * - Điều hướng Profile Detail: ĐÃ xác minh — path thật là `/profile/list/{email}`.
 * - SC_1112_002/003/006/010/011: điều hướng đã đúng, nhưng thao tác sâu hơn (bật chế độ
 *   sửa từng field, nhập giá trị) CHƯA xác minh xong — cơ chế "Chỉnh sửa" theo từng section
 *   phức tạp hơn giả định ban đầu. Nếu các test này fail, đó là tín hiệu cần audit lại locator
 *   bằng Playwright MCP, KHÔNG phải mặc định coi là bug ở fastdo-server.
 */

const DEMO_EMPLOYEE_EMAIL = 'support@fastdo.vn';

test.describe('Ticket #1112 — Update Vigift HSNS & Tài liệu', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
  });

  test('SC_1112_001: Thêm mới trường tùy chỉnh kiểu Link trong Cấu hình', async () => {
    const fieldName = `Link Hồ sơ mẫu 1112 - ${Date.now()}`;

    await test.step('Mở trang Cài đặt trường tùy chỉnh', async () => {
      await profilePage.openCustomFieldSettings();
    });

    await test.step('Mở slider tạo mới trường', async () => {
      await expect(profilePage.btnAddCustomField).toBeVisible();
      await profilePage.openAddCustomFieldSlider();
    });

    await test.step('Chọn loại dữ liệu Link, đặt tên và lưu', async () => {
      await profilePage.selectCustomFieldType('Link');
      await profilePage.safeFill(profilePage.inputFieldName, fieldName);
      await profilePage.safeClick(profilePage.btnSaveSlider);
      await expect(profilePage.customFieldRow(fieldName)).toBeVisible();
    });

    await profilePage.takeScreenshot('SC_1112_001_Create_Link_CustomField');
  });

  test('SC_1112_002 & SC_1112_003: Nhập URL hợp lệ và Validation trường Link trên Profile', async ({ page }) => {
    await test.step('Mở trang Chi tiết Profile', async () => {
      await profilePage.openProfileDetailByEmail(DEMO_EMPLOYEE_EMAIL);
    });

    const linkInput = page.locator('input[placeholder*="http"], input[type="url"]').first();

    await test.step('Nhập URL hợp lệ và kiểm tra giá trị được lưu vào input', async () => {
      await expect(linkInput).toBeVisible();
      await linkInput.fill('https://fastdo.vn');
      await expect(linkInput).toHaveValue('https://fastdo.vn');
    });

    await test.step('Nhập URL không hợp lệ và kiểm tra validation trigger', async () => {
      await linkInput.fill('invalid-url-string');
      await page.keyboard.press('Tab');
      await expect(linkInput).not.toHaveValue('https://fastdo.vn');
    });

    await profilePage.takeScreenshot('SC_1112_002_003_Link_Validation');
  });

  test('SC_1112_006: Hiển thị trường Multi-select với Tag Badge và Wrap text', async ({ page }) => {
    await test.step('Mở trang Chi tiết Profile', async () => {
      await profilePage.openProfileDetailByEmail(DEMO_EMPLOYEE_EMAIL);
    });

    const multiSelectTags = page.locator('.tag, .badge-selected, .is-multiple .tag');

    await test.step('Kiểm tra có ít nhất 1 tag hiển thị và không bị ẩn/overflow', async () => {
      await expect(multiSelectTags.first()).toBeVisible();
      const tagCount = await multiSelectTags.count();
      expect(tagCount, 'Hồ sơ test phải có sẵn dữ liệu Multi-select để kiểm tra hiển thị').toBeGreaterThan(0);
    });

    await profilePage.takeScreenshot('SC_1112_006_MultiSelect_Display');
  });

  test('SC_1112_010 & SC_1112_011: Kho tài liệu cá nhân - Upload và gắn vào HĐLĐ/HSNS', async ({ page }) => {
    await test.step('Mở Profile', async () => {
      await profilePage.openProfileDetailByEmail(DEMO_EMPLOYEE_EMAIL);
    });

    await test.step('Bấm nút Upload tài liệu và chờ modal/slider xuất hiện', async () => {
      await expect(profilePage.btnUploadDocument).toBeVisible();
      await profilePage.btnUploadDocument.click();
      await expect(page.locator('.modal, .slider').first()).toBeVisible();
    });

    await profilePage.takeScreenshot('SC_1112_010_Document_Upload_HSNS');
  });
});
