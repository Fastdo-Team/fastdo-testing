import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Locator đã xác nhận với DOM thật (server local, 2026-08-18, qua Playwright MCP/Browser) cho:
 * - Trường dữ liệu tùy chỉnh (tạo mới, hiển thị trên Profile Detail)
 * Riêng phần Kho tài liệu (Document) CHƯA xác nhận được — không thấy section "Kho tài liệu"
 * trên bản build/tổ chức demo đang test (có thể ở tab khác hoặc chưa deploy tính năng này).
 */
export class ProfilePage extends BasePage {
  readonly settingsCustomFieldUrl: string = '/profile/settings/custom-field';

  // Custom Field Locators
  readonly btnAddCustomField: Locator;
  readonly sliderHeading: Locator;
  readonly inputFieldName: Locator;
  readonly btnSaveSlider: Locator;
  readonly btnCancelSlider: Locator;

  // Custom Field Type picker (modal "Chọn loại dữ liệu")
  readonly btnChooseFieldType: Locator;
  readonly cardTypeLink: Locator;
  readonly cardTypeMultiSelect: Locator;

  // Kho tài liệu (Document Section) — CHƯA xác nhận với DOM thật, xem ghi chú đầu file
  readonly btnUploadDocument: Locator;
  readonly fileInputDocument: Locator;
  readonly selectGroupDocument: Locator;
  readonly btnSaveDocument: Locator;

  constructor(page: Page) {
    super(page);

    // Custom Field Management Locators
    this.btnAddCustomField = page.getByRole('link', { name: 'Thêm trường', exact: true });
    this.sliderHeading = page.getByText('Tạo mới trường dữ liệu');
    this.inputFieldName = page.getByPlaceholder('Nhập nội dung');
    this.btnSaveSlider = page.locator('a.button.is-primary:has-text("Lưu")');
    this.btnCancelSlider = page.locator('a:has-text("Hủy")');

    // Chọn loại dữ liệu — click thẳng vào card, KHÔNG có nút "Sử dụng" riêng như bản cũ đoán
    this.btnChooseFieldType = page.getByText('Chọn loại dữ liệu');
    this.cardTypeLink = page.locator('.type-picker-card:has-text("Link")');
    this.cardTypeMultiSelect = page.locator('.type-picker-card:has-text("Menu chọn nhiều")');

    // Documents — CHƯA xác nhận, giữ nguyên best-effort selector cũ
    this.btnUploadDocument = page.locator('button:has-text("Tải lên tài liệu"), button:has-text("Thêm tài liệu")');
    this.fileInputDocument = page.locator('input[type="file"]');
    this.selectGroupDocument = page.locator('select[name="documentGroup"], .select select');
    this.btnSaveDocument = page.locator('button:has-text("Xác nhận"), button:has-text("Lưu tài liệu")');
  }

  async openCustomFieldSettings() {
    await this.goto(this.settingsCustomFieldUrl);
    await this.waitForNetworkIdle();
  }

  /** Trang chi tiết 1 nhân viên dùng path `/profile/list/{email}` — KHÔNG phải `/profile/detail?id=`. */
  async openProfileDetailByEmail(email: string) {
    await this.goto(`/profile/list/${email}`);
    await this.waitForNetworkIdle();
  }

  async openAddCustomFieldSlider() {
    await this.safeClick(this.btnAddCustomField);
    await expect(this.sliderHeading).toBeVisible({ timeout: 5000 });
  }

  async selectCustomFieldType(type: 'Link' | 'MultiSelect') {
    await this.safeClick(this.btnChooseFieldType);
    const card = type === 'Link' ? this.cardTypeLink : this.cardTypeMultiSelect;
    await this.safeClick(card);
  }

  async createLinkCustomField(fieldName: string) {
    await this.openAddCustomFieldSlider();
    await this.selectCustomFieldType('Link');
    await this.safeFill(this.inputFieldName, fieldName);
    await this.safeClick(this.btnSaveSlider);
    await this.waitForNetworkIdle();
  }

  /** Container Bulma thật của 1 dòng trường tùy chỉnh trên Profile Detail: `div.box.p-3.mb-3`. */
  customFieldRow(fieldName: string): Locator {
    return this.page.locator('.box.p-3.mb-3').filter({ hasText: fieldName });
  }

  async fillLinkValue(fieldName: string, url: string) {
    const input = this.customFieldRow(fieldName).locator('input');
    await this.safeFill(input, url);
  }

  async verifyMultiSelectDisplay(fieldName: string, expectedBadges: string[]) {
    const row = this.customFieldRow(fieldName);
    for (const badge of expectedBadges) {
      await expect(row.locator(`.tag:has-text("${badge}")`)).toBeVisible();
    }
  }
}
