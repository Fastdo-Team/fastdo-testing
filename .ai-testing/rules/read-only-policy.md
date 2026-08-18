---
description: Chính sách Read-Only tuyệt đối — AI Testing không được phép thay đổi source code
applies_to: Mọi ticket (Update & Bug)
priority: CRITICAL
---

# Read-Only Policy — Bất biến an toàn #1

## Nguyên tắc tối cao

AI Testing hoạt động ở chế độ **READ ONLY** tuyệt đối đối với toàn bộ Source Code trong `fastdo-server/`.

## AI được phép

| # | Hành động | Mô tả |
|---|---|---|
| P-001 | Đọc Source Code | Đọc bất kỳ file `.cs`, `.razor`, `.resx`, `.json`, `.csproj` để phân tích |
| P-002 | Đọc File Change / Diff | Đọc git diff, git log, commit message |
| P-003 | Đọc Workflow Module | Đọc file `.md` trong thư mục `WORKFLOW/` |
| P-004 | Phân tích Business Logic | Truy vết luồng nghiệp vụ, input/output, validation, permission |
| P-005 | Xác định Impact Area | Xác định module, class, API, DB, UI bị ảnh hưởng |
| P-006 | Sinh Test Scenario & Test Case | Tạo kịch bản kiểm thử và chi tiết test case |
| P-007 | Sinh Test Report & Bug Report | Tạo báo cáo kết quả kiểm thử |
| P-008 | Cảnh báo Workflow Update | Phát hiện Rule mới/thay đổi trong Code và đề xuất cập nhật Workflow |

## AI KHÔNG được phép (vi phạm = STOP ngay lập tức)

| # | Hành động cấm | Lý do |
|---|---|---|
| X-001 | Sửa source code | Thay đổi logic hệ thống |
| X-002 | Refactor code | Thay đổi cấu trúc code |
| X-003 | Rename file/biến/class | Gây lỗi reference |
| X-004 | Format code | Tạo noise trong git diff |
| X-005 | Thay đổi Business Logic | Quyết định kiến trúc, không phải trách nhiệm QC |
| X-006 | Commit / Push code | Thay đổi repository |
| X-007 | Chạy lệnh build/deploy | Ảnh hưởng môi trường |
| X-008 | Xóa file | Mất dữ liệu |

## Checklist tự kiểm tra

Trước khi bàn giao bất kỳ output nào cho QC:
- [ ] Tuyệt đối KHÔNG có lệnh write/modify/delete nào được thực thi trên source code?
- [ ] Chỉ sử dụng `git diff`, `git log`, `cat`, `grep`, `find` — không dùng `git commit`, `git push`, `sed`, `awk` sửa file?
