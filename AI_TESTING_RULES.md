# AI TESTING SYSTEM — FASTDO

> **Hệ thống Rule & Quy trình kiểm thử chuẩn hóa dành riêng cho AI Testing.**

---

## 🏛️ 1. Cấu Trúc Hệ Thống Thư Mục Chuẩn

Toàn bộ quy trình và kết quả kiểm thử được phân định rõ ràng theo các thư mục chức năng:

```
AITESTING/
├── AI_TESTING_RULES.md                 ← [Tổng quan] Cổng tra cứu quy tắc & quy trình (nguồn duy nhất — các
│                                          file khác chỉ link về đây, không copy lại nội dung)
├── .gitignore                          ← Chặn commit nhầm source code vào Git
│
├── plans/                              ← 📁 [PLANS] Chứa file Test Plan & Test Scenario của từng ticket (.md)
│   └── ticket_1112_plan.md             ← Ví dụ: Plan phân tích, Impact Matrix & Scenarios
│
├── tests/                              ← 📁 [TEST CASES] Chỉ chứa Checklist / Test Case bảng tính Excel (.xlsx)
│   ├── _Checklist - Hoàng Lệ Giang1.xlsx ← Template mẫu chuẩn Fastdo (Sheet CheckList 2026)
│   └── Checklist_Ticket_1112.xlsx      ← Test Case chi tiết do AI sinh cho ticket
│
├── reports/                            ← 📁 [REPORTS] Test Report/Bug Report (.xlsx/.md) + evidence Playwright
│   ├── screenshots/                    ← Ảnh chụp evidence (thủ công lẫn tự động)
│   └── playwright-report/              ← Report HTML tự sinh khi chạy automation (gitignored, không phải evidence chính)
│
├── WORKFLOW/                           ← 📁 [WORKFLOW] Sơ đồ nghiệp vụ chuẩn các Module (Source of Truth)
│   ├── fCheckin.md
│   └── fProfile.md
│
├── .ai-testing/                        ← 📁 [CORE RULES] Hệ thống quy tắc & reference
│   ├── architect.md                    ← Sơ đồ actor + link về quy trình/rule (không copy lại)
│   ├── rules/                          ← 6 file Rule chi tiết (Read-only, Coverage, Format...)
│   ├── reference/                      ← 4 file Reference tra cứu (Golden rules, Workflow map...)
│   └── templates/                      ← Lưu trữ các template prompt & guide
│
├── automation/                         ← 📁 [AUTOMATION] Playwright Test — tự động hoá lại 1 phần Checklist
│   │                                      (tách riêng khỏi phần trên vì khác bản chất: đây là CODE, không
│   │                                       phải tài liệu quy trình). Xem automation/README.md để setup & chạy.
│   ├── playwright.config.ts
│   ├── pages/                          ← Page Object Model dùng chung
│   └── tests/{e2e,smoke}/              ← Test nghiệp vụ theo ticket + smoke test cho chính bộ khung
│
└── fastdo-server/                      ← 📁 [CODEBASE] Mã nguồn hệ thống (READ ONLY)
```

---

## 🔄 2. Quy Trình 5 Bước Chuẩn

```
BƯỚC 1: Tiếp Nhận & Phân Tích (AI thực hiện)
        │ - Đọc Ticket (Requirement/Bug) + Workflow + Codebase (Read-Only)
        │ - Xác định Impact Matrix & Phát hiện Rule mới cần cập nhật Workflow
        ▼
BƯỚC 2: Rà Soát Kịch Bản & Lưu Plan (AI & QC phối hợp)
        │ - AI sinh danh sách Test Scenario (11 nhóm case) và lưu vào thư mục `plans/`
        │ ⛔ [CỔNG KIỂM DUYỆT]: DỪNG LẠI chờ QC Review & Confirm
        ▼
BƯỚC 3: Sinh Test Case & Xuất File Excel (AI thực hiện)
        │ - Chi tiết hóa Scenario thành Test Case chuẩn format Fastdo (TK<ID>_001)
        │ - Xuất file bảng tính Excel (.xlsx) lưu vào thư mục `tests/`
        ▼
BƯỚC 4: Kiểm Thử Thực Tế (QC thực hiện)
        │ - QC mở file Excel trong `tests/` để thực thi test và đánh giá PASS / FAIL
        ▼
BƯỚC 5: Tổng Hợp & Nghiệm Thu (AI & QC phối hợp)
        │ - PASS toàn bộ: Xuất Test Report lưu vào `reports/` + Xuất cảnh báo Workflow
        │ - FAIL: Xuất Bug Report chi tiết lưu vào `reports/` gửi Developer
```

---

## 🏆 3. 10 Quy Tắc Vàng (Golden Rules)

1. **READ ONLY** — Tuyệt đối không sửa, commit, refactor source code trong `fastdo-server/`.
2. **Workflow First** — Đọc file Workflow Module (`WORKFLOW/<Module>.md`) TRƯỚC khi phân tích code.
3. **Cover 100%** — Bắt buộc đủ 11 nhóm Test Scenario (Happy, Validation, Boundary, Negative, Business Rule, Permission, Exception, Regression, Compatibility, Database, API).
4. **Không trùng lặp** — Mỗi test case là duy nhất, không copy trùng ID hoặc nội dung.
5. **Đúng Format Fastdo** — Format Checklist tuân thủ 100% sheet `CheckList 2026` từ template gốc.
6. **Cổng kiểm duyệt (Gating)** — Phải dừng chờ QC duyệt Test Scenario ở Bước 2 trước khi sang Bước 3.
7. **Cảnh báo Rule mới** — Code có logic mới hoặc đổi rule so với Workflow → Lập tức xuất cảnh báo cho QC.
8. **Impact Matrix** — Regression Area phải truy vết từ liên kết thật trong Workflow, không suy đoán.
9. **Tự kiểm tra (Self-Validation)** — AI tự đối chiếu checklist chất lượng trước khi bàn giao.
10. **Hỏi khi chưa rõ** — Không tự ý bịa dữ liệu test hay trạng thái test, phải confirm với QC.
