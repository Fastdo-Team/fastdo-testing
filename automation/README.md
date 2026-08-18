# Automation — Playwright E2E cho AI Testing

Đây là bộ khung tự động hoá kiểm thử (Playwright Test), tách riêng khỏi tài liệu quy trình
QC ở thư mục cha (`../plans/`, `../tests/*.xlsx`, `../reports/`, `../.ai-testing/`). Hai phần
này phục vụ hai việc khác nhau:

- **Antigravity + QC Agent Skill** (`.ai-testing/`, `plans/`, `tests/*.xlsx`) → sinh Test
  Plan / Checklist Excel để QC test tay theo quy trình 5 bước trong
  [`../AI_TESTING_RULES.md`](../AI_TESTING_RULES.md).
- **Automation ở đây** (Playwright MCP để khảo sát DOM thật + Playwright Test để chạy lại tự
  động) → biến một phần Checklist thành script chạy lặp lại được, dùng cho regression.

Playwright MCP và Playwright Test **không thay thế nhau**: MCP là công cụ tương tác để AI
mở trình duyệt thật, đọc DOM, lấy đúng locator rồi viết ra spec — Playwright Test là bộ máy
chạy lại các spec đó một cách xác định (deterministic), có báo cáo, có retry, dùng trong CI.

## Cài đặt lần đầu

```bash
cd automation
npm install                # tự động cài Chrome for Testing qua postinstall
```

## Chạy test

```bash
npm run test:beta          # chạy với BASE_URL của môi trường Beta (mặc định)
npm run test:local         # chạy với BASE_URL đọc từ .env.local (tự tạo, xem bên dưới)
npm run test:smoke         # chỉ chạy smoke test của chính bộ khung (không cần mạng/site)
npm run test:ui            # mở Playwright UI mode để debug từng bước
npm run report             # mở lại report HTML lần chạy gần nhất
```

## Cấu hình môi trường (local / beta)

Không còn phải tự nhớ `export BASE_URL=...` mỗi lần. Mỗi môi trường có 1 file `.env.<tên>`:

| File | Theo dõi Git? | Vai trò |
|---|---|---|
| `.env.example` | Có | Template — copy ra rồi điền |
| `.env.beta` | Có | Giá trị mặc định cho Beta (không có bí mật) |
| `.env.beta.local` | **Không** | Ghi đè cá nhân lên `.env.beta` (ví dụ tài khoản test riêng) |
| `.env.local` | **Không** — tự tạo | `BASE_URL` trỏ vào server chạy trên máy bạn |

Muốn chạy nhắm vào máy local: copy `.env.example` thành `.env.local`, sửa `BASE_URL` cho đúng
port server đang chạy, rồi `npm run test:local`.

## Đăng nhập (nếu trang cần login)

Điền `AUTH_USERNAME` / `AUTH_PASSWORD` vào file `.env.<môi trường>.local` tương ứng.
Khi 2 biến này có giá trị, Playwright tự chạy `tests/auth.setup.ts` **1 lần** trước cả bộ
test, lưu session vào `playwright/.auth/user.json` (gitignored) — các test sau dùng lại,
không phải login lại từng cái.

> `tests/auth.setup.ts` hiện có locator **placeholder**, chưa xác nhận với DOM thật của
> trang login Fastdo. Lần đầu setup, dùng Playwright MCP mở trang `/login` thật để lấy đúng
> locator rồi thay vào.

## Vì sao test giờ có thể FAIL thật (khác trước)

Bản cũ dùng pattern `isVisible().catch(() => false)` rồi `if (...) {...}` — nếu phần tử
không có (kể cả khi cả trang lỗi/không load được), test vẫn báo PASS vì không có assertion
nào thật sự chạy. Bản hiện tại dùng `expect(locator).toBeVisible()` — assertion cứng, test
sẽ FAIL nếu tính năng thật sự lỗi hoặc trang không load được. `tests/smoke/harness.smoke.spec.ts`
minh chứng lại đúng 2 điều này bằng 1 trang tĩnh cục bộ (không phụ thuộc mạng/site thật):
1 test PASS thật, 1 test cố tình FAIL thật (đánh dấu `test.fail()` để không làm đỏ cả suite).

## Cấu trúc thư mục

```
automation/
├── playwright.config.ts   ← Config, tự chọn .env theo TEST_ENV, tự bật project "setup" khi có creds
├── tests/
│   ├── auth.setup.ts      ← Đăng nhập 1 lần, lưu session (chỉ chạy khi có AUTH_USERNAME/PASSWORD)
│   ├── e2e/                ← Test nghiệp vụ theo từng ticket
│   └── smoke/              ← Smoke test cho chính bộ khung, không phụ thuộc site thật
├── pages/                  ← Page Object Model dùng chung
└── fixtures/local-smoke/   ← Trang HTML tĩnh phục vụ smoke test
```

Output (screenshot, report HTML/JSON) vẫn đổ về `../reports/` ở thư mục cha, giữ đúng quy ước
đã có trong `AI_TESTING_RULES.md` để QC không phải tìm 2 chỗ.
