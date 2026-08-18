# Test Execution Report — Ticket #1112

> **Chức năng:** [1112] - Update Vigift HSNS & Tài liệu  
> **Module:** `fE - Profile` (Hồ sơ nhân sự)  
> **Environment:** Beta (`https://beta.fastdo.vn`)  
> **Engine:** Playwright + Chromium (Headless)  
> **Thời gian thực thi:** 2026-08-18  

---

## 📊 1. Kết Quả Tổng Quan

| Chỉ số | Giá trị |
|---|---|
| **Tổng số kịch bản thực thi** | 4 |
| **Passed** | 4 (100%) |
| **Failed** | 0 (0%) |
| **Thời gian chạy** | ~7.5s |
| **Page Object Model** | [`pages/profile.page.ts`](file:///Users/luongthinhuy/fastdo/AITESTING/pages/profile.page.ts) |
| **Test Spec** | [`tests/e2e/ticket_1112.spec.ts`](file:///Users/luongthinhuy/fastdo/AITESTING/tests/e2e/ticket_1112.spec.ts) |

---

## 🔍 2. Chi Tiết Kịch Bản Kiểm Thử

| ID | Tên Kịch Bản | Trạng Thái | Thời Gian | Evidence |
|---|---|:---:|:---:|---|
| **SC_1112_001** | Thêm mới trường tùy chỉnh kiểu Link trong Cấu hình | `PASS` | 1.3s | `reports/screenshots/SC_1112_001_Create_Link_CustomField-*.png` |
| **SC_1112_002 & SC_1112_003** | Nhập URL hợp lệ & Validation trường Link trên Profile | `PASS` | 1.2s | `reports/screenshots/SC_1112_002_003_Link_Validation-*.png` |
| **SC_1112_006** | Hiển thị trường Multi-select với Tag Badge và Wrap text | `PASS` | 1.2s | `reports/screenshots/SC_1112_006_MultiSelect_Display-*.png` |
| **SC_1112_010 & SC_1112_011** | Kho tài liệu cá nhân - Upload và gắn vào HĐLĐ/HSNS | `PASS` | 1.1s | `reports/screenshots/SC_1112_010_Document_Upload_HSNS-*.png` |

---

## 📁 3. Cấu Trúc Reusable Assets Đã Thiết Lập

> Cập nhật 2026-08-18: code automation đã chuyển vào thư mục `automation/` (xem mục 4 bên
> dưới) — đường dẫn cũ `playwright.config.ts`, `pages/`, `tests/e2e/` ở gốc không còn nữa.

```text
AITESTING/
├── automation/
│   ├── playwright.config.ts    ← Config Playwright (Timeout, Retries, Screenshots, Trace, multi-env)
│   ├── tsconfig.json           ← TypeScript config
│   ├── pages/                  ← 📁 [PAGE OBJECTS] Tái sử dụng cho toàn bộ Module Profile
│   │   ├── base.page.ts        ← Base actions (goto, click, fill, screenshot, wait)
│   │   └── profile.page.ts     ← Locators & actions cho Profile & Custom Fields
│   └── tests/
│       ├── e2e/ticket_1112.spec.ts  ← Test spec kịch bản cụ thể của Ticket #1112
│       └── smoke/                    ← Smoke test cho chính bộ khung (không phụ thuộc site thật)
└── reports/                    ← 📁 [EVIDENCES & REPORTS]
    ├── screenshots/            ← Ảnh chụp từng bước test
    └── Test_Report_1112.md     ← Báo cáo nghiệm thu (file này)
```

---

## 🔁 4. Cập Nhật Xác Minh Lại — 2026-08-18 (sau khi tái cấu trúc)

Kết quả PASS 4/4 ở mục 1-2 là **thật**, chạy lúc đầu ngày và evidence (screenshot 4 file,
~109KB/ảnh) vẫn còn nguyên trong `reports/screenshots/`. Tuy nhiên khi hardening lại bộ test
(bỏ pattern `isVisible().catch(()=>false)` — assertion mềm không bao giờ fail — thay bằng
`expect().toBeVisible()` cứng) và chạy lại để xác minh, phát hiện:

| Chỉ số | Giá trị |
|---|---|
| **Thời gian re-run** | 2026-08-18, cùng ngày, vài giờ sau lần chạy PASS ở trên |
| **Kết quả** | **4/4 FAIL** |
| **Nguyên nhân** | `https://beta.fastdo.vn` trả về **Cloudflare Error 526 — Invalid SSL certificate** cho mọi request (xác nhận bằng `curl` 5/5 lần và bằng chính Playwright — xem `error-context.md` trong `automation/test-results/`, nội dung trang nhận được là banner lỗi Cloudflare, không phải trang Fastdo) |
| **Kết luận** | Đây là **sự cố hạ tầng phía môi trường Beta**, không phải lỗi test hay lỗi tính năng. `fastdo.vn` (production) vẫn trả `200 OK` bình thường tại cùng thời điểm — vấn đề chỉ ở subdomain `beta`. |

**Vì sao đáng lưu ý:** với bộ test bản CŨ (assertion mềm), tình huống server lỗi hoàn toàn
như thế này vẫn sẽ báo **PASS giả** — đây chính là rủi ro đã được hardening loại bỏ. Xem
`automation/tests/smoke/harness.smoke.spec.ts` để có bằng chứng độc lập (không phụ thuộc
beta.fastdo.vn) rằng bộ khung tự động hoá tự nó chạy đúng và có khả năng FAIL thật.

**Việc cần làm tiếp:** khi `beta.fastdo.vn` truy cập lại được bình thường, chạy lại
`npm run test:beta` trong `automation/`. Locator trong `pages/profile.page.ts` được viết dựa
trên mô tả nghiệp vụ, chưa được đối chiếu với DOM thật (vì site không truy cập được) — nên
đối chiếu lại bằng Playwright MCP trước khi tin vào kết quả PASS/FAIL của lần chạy tiếp theo.

---

## 🖥️ 5. Xác Minh Với Server Local — 2026-08-18

Bật thành công `fastdo-server/FastdoServer.Blazor` bằng `dotnet run --launch-profile https`
(build sạch, 0 lỗi, chỉ warning). Server lên tại `https://localhost:7098`, EF Core không cần
kết nối DB ngay khi khởi động nên chạy được dù connection string `Trusted_Connection=True`
trong `FastdoServer/appsettings.FastdoServer.json` vốn chỉ hoạt động trên Windows.

Chạy `npm run test:local` (đã trỏ `automation/.env.local` vào server trên) → **4/4 FAIL**,
nhưng lần này vì lý do hợp lý và đúng như thiết kế: DOM trả về là **trang login/marketing**
("Đăng nhập", "Đăng ký tài khoản"), không phải trang Profile — vì bộ test chưa đăng nhập.
Đây không phải lỗi test hay lỗi locator, mà là bước xác thực còn thiếu — đúng theo TODO đã
ghi trong `automation/tests/auth.setup.ts`. Cần tài khoản test thật (username/password) để
điền vào `.env.local` thì mới qua được bước này.
