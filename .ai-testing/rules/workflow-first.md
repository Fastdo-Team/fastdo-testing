---
description: Bắt buộc đọc và đối chiếu Workflow Module trước khi sinh Test Case
applies_to: Mọi ticket (Update & Bug)
priority: HIGH
---

# Workflow First — Đọc Workflow trước, Code sau

## Nguyên tắc

Mọi phân tích ticket PHẢI bắt đầu từ tài liệu Workflow Module trong thư mục `WORKFLOW/`. Workflow là nguồn sự thật (source of truth) về nghiệp vụ — Code là hiện thực hóa của Workflow.

## Quy trình bắt buộc

### Bước 1: Xác định Module → Tìm file Workflow

```
Đầu vào: 🔴 Module (ví dụ: fCheckin, fProfile, Payroll, fLeave)
     ↓
Tìm file: WORKFLOW/<Module>.md
     ↓
Nếu tên không khớp 100% → Quét danh sách file trong WORKFLOW/ để tìm đúng file
```

### Bước 2: Trích xuất cấu trúc Workflow

Phải trích xuất đầy đủ:
- **Section**: Các nhóm chức năng chính (section 1, 2, 3...)
- **Rules**: Danh sách quy định hệ thống (Rules.razor, HrmRulesModel.cs...)
- **Dữ liệu đầu vào**: Đơn từ, form, import/export
- **Chức năng chính**: Bảng công, bảng phép, phân ca, báo cáo...
- **File UI/Repo liên quan**: Ánh xạ file `.razor`, `.cs` với section Workflow

### Bước 3: Đánh dấu Section liên quan đến Ticket

- **Trực tiếp**: Section/Rule mà Requirement nhắc đến rõ ràng
- **Gián tiếp**: Section/Rule có liên kết lan truyền (ví dụ: thay đổi OT → ảnh hưởng Bảng công → ảnh hưởng Bảng lương)

### Bước 4: Đối chiếu Code vs Workflow — Phát hiện Rule mới

Sau khi đọc File Change & Source Code:

⚠️ **NẾU PHÁT HIỆN RULE THAY ĐỔI HOẶC BỔ SUNG TÍNH NĂNG MỚI**:

AI phải tạo mục riêng `⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT TÀI LIỆU WORKFLOW` gồm:
1. **Tên Rule/Tính năng** thay đổi
2. **File Source Code & vị trí hàm** thay đổi
3. **Vị trí Section** cần chèn/sửa trong file `WORKFLOW/<Module>.md`

## Lỗi thường gặp (KHÔNG được mắc)

| Lỗi | Hậu quả |
|---|---|
| Bỏ qua đọc Workflow, đi thẳng vào Code | Thiếu context nghiệp vụ, sinh test case sai/thiếu |
| Chỉ đọc section trực tiếp, bỏ qua gián tiếp | Bỏ sót Regression Area |
| Không cảnh báo Rule mới phát hiện trong Code | QC không cập nhật Workflow, lần test sau bị sai |
| Đọc sai file Workflow (nhầm module) | Toàn bộ phân tích sai từ gốc |
