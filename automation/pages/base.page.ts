import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForNetworkIdle(timeout = 10000) {
    await this.page.waitForLoadState('networkidle', { timeout }).catch(() => {});
  }

  async takeScreenshot(name: string) {
    return await this.page.screenshot({
      path: `../reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async safeClick(locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.click();
  }

  async safeFill(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.fill(text);
  }
}
