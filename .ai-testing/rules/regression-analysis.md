---
description: Quy tắc phân tích Regression Area & Impact Matrix dựa trên Workflow
applies_to: Mọi ticket (Update & Bug)
priority: HIGH
---

# Regression Analysis — Impact Matrix dựa trên Workflow

## Nguyên tắc

Regression Area KHÔNG được suy đoán — phải dựa trên **liên kết thật** ghi trong file Workflow Module (`WORKFLOW/<Module>.md`).

## Quy trình phân tích

### Bước 1: Xác định vùng thay đổi trực tiếp

Từ File Change / Diff code, xác định:
- Module bị ảnh hưởng
- Class / File thay đổi
- API endpoint thay đổi
- Database collection / field thay đổi
- UI component thay đổi

### Bước 2: Truy vết liên kết lan truyền trong Workflow

Đọc file Workflow, tìm các section có **liên kết tới section đã thay đổi**:

```
Ví dụ fCheckin:
Thay đổi Rule OT (1.3) → Ảnh hưởng Đơn OT (2.3) → Ảnh hưởng Bảng công (3.1) → Ảnh hưởng Bảng lương (fPayroll)

Ví dụ fProfile:
Thay đổi Custom Field (2.6) → Ảnh hưởng Import/Export Excel Profile → Ảnh hưởng Kho tài liệu (2.5)
```

### Bước 3: Xác định cross-module impact

Kiểm tra section "Tích hợp & Liên kết Module" trong Workflow:
- fProfile → Payroll (Lương HĐ, BHXH, Phụ cấp)
- fProfile → fCheckin (Trạng thái NV, Phòng ban/Chức danh)
- fProfile → fLeave (Ngày chính thức, Thâm niên)
- fProfile → Document Management (CompanyAllowDocument)

### Bước 4: Sinh Impact Matrix

Xuất dạng bảng hoặc diagram:

| Vùng thay đổi | Module ảnh hưởng | Section Workflow | Mức độ |
|---|---|---|---|
| Trực tiếp | ... | ... | Cao |
| Gián tiếp (cùng module) | ... | ... | Trung bình |
| Cross-module | ... | ... | Thấp |

## Anti-pattern

| Lỗi | Hậu quả |
|---|---|
| Chỉ test module trực tiếp, bỏ qua module liên kết | Lỗi lan truyền không phát hiện |
| Không đọc section Tích hợp & Liên kết Module | Bỏ sót cross-module impact |
| Suy đoán impact không dựa trên Workflow | Regression không chính xác |
