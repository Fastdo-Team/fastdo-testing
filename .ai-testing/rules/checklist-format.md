---
description: Quy tắc format Checklist/Test Case theo đúng Template Fastdo
applies_to: Bước sinh Test Case (Bước 7 Ticket Update, Bước tương ứng Ticket Bug)
priority: HIGH
---

# Checklist Format — Đúng template, không sai cấu trúc

## Nguồn Template

Căn cứ theo:
- 🔴 **Template Checklist** do QC cung cấp (file Excel mẫu)
- 🔴 **AI_Template_Checklist_Guide.md** trong thư mục gốc `AITESTING/`

## Quy tắc bất biến

| # | Rule | Mô tả |
|---|---|---|
| F-001 | Không thay đổi cấu trúc | Giữ nguyên header, merged cells, cột, thứ tự |
| F-002 | Không thêm / xóa cột | Sheet CheckList chỉ có các cột đã định sẵn |
| F-003 | Không thay đổi công thức | Nếu template có công thức (ví dụ Total), không sửa |
| F-004 | Không sửa format | Font, màu, border, merge cell giữ nguyên template |

## Cấu trúc Sheet CheckList

### Cột cố định (Row 2)

| Cột | Tên | Quy tắc |
|---|---|---|
| A | ID | `TK<TicketID>_<STT 3 chữ số>` — Ví dụ: `TK1112_001` |
| B-C | Function | Tên chức năng (merge 2 cột) |
| D | Tiêu đề | Mô tả ngắn test case |
| E | Nền tảng | `Web` / `Mobile Android` / `Mobile iOS` / `API` |

### Cột lặp theo Test Lần (1-10)

Mỗi lần test gồm 5-6 cột:

| Cột | Tên | Giá trị |
|---|---|---|
| Ưu tiên | Priority | `Highest` / `High` / `Medium` / `Low` |
| Môi trường | Environment | `Local` / `Beta` / `Production` |
| Trạng thái | Status | `Done` / `Fail` / `Cancel` / `Doing` / `Pending` |
| Note | Ghi chú | Expected result, link video/ảnh, dữ liệu test |
| DEV NOTE | Dev phản hồi | `Fixed` / `Cannot reproduce` / `Need BA confirm` / `Waiting deploy` / `Duplicate bug` |
| Test Date | Ngày test | `YYYY-MM-DD HH:mm` |

### Cột cuối

| Cột | Tên | Giá trị |
|---|---|---|
| QC | Tester | Tên người test |

## Quy tắc đặt tên ID

```
Format: TK<TicketID>_<Running Number>
Ví dụ:  TK1112_001, TK1112_002, TK1112_003
```

- Không trùng ID trong cùng ticket
- Running Number bắt đầu từ 001, tăng dần
- Prefix `TK` + mã ticket

## Quy tắc đặt tên Screenshot

```
Format: <TC_ID>_<Function>.png
Ví dụ:  TK1112_001_CreateLink.png
```

## Quy tắc Priority

| Priority | Khi nào dùng |
|---|---|
| Highest | Ảnh hưởng hệ thống, Payroll, Checkin |
| High | Ảnh hưởng chức năng chính |
| Medium | Lỗi nghiệp vụ phụ |
| Low | UI, hiển thị |

## Ticket Header Row

Mỗi nhóm test case bắt đầu bằng 1 dòng header:
- Merge cột A:E
- Nền đỏ nhạt (`#EA9999`)
- Nội dung: `[<TicketID>] - <Ticket Title>`

## AI chỉ được điền Trạng thái `Done` hoặc `Fail`

Không tự ý điền `Cancel`, `Doing`, `Pending` — nếu không chắc chắn, confirm với QC.
