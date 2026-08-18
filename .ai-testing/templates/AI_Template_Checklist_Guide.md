# AI Checklist / Test Case Template Guide

## Mục đích

Tài liệu này mô tả chi tiết cấu trúc file **Template Checklist** để AI có thể tự động sinh Test Case đúng định dạng của Fastdo.

## Sheet: CheckList

Đây là sheet chính dùng để quản lý toàn bộ testcase.
Lưu ý: AI ko tự ý điền thông tin bậy, nếu chưa chắc chắn hãy confirm với QC

### 1. ID

-   Định dạng: `TK1000_001`
-   Quy tắc:
    -   TK: Ticket 
    -   1000: Mã ticket 
    -   001: STT tăng dần
-   AI không được trùng ID.

### 2. Function

Tên chức năng cần kiểm thử.

Ví dụ: - Create Employee - Update Attendance - Leave Request - Payroll

### 3. Tiêu đề

Mô tả ngắn testcase.

Ví dụ: - Kiểm tra tạo đơn nghỉ phép thành công. - Kiểm tra check-in ngoài phạm vi GPS.

### 4. Nền tảng (Platform)

Option: - Web - Mobile Android - Mobile iOS - API 

### Các cột Test Lần 1 → Test Lần 10
Ví dụ: Lần 1 Fail => Retest sẽ điền vào cột lần 2, tiếp tục cho đến khi nào PASS
Mỗi lần kiểm thử gồm các trường sau:

### Ưu tiên (Priority)

Option:

-   Highest
-   High
-   Medium
-   Low

Quy tắc: 
- Highest: ảnh hưởng hệ thống, Payroll, Checkin 
- High: ảnh hưởng chức năng chính 
- Medium: lỗi nghiệp vụ phụ 
- Low: UI, hiển thị

### Môi trường (Environment)

Option:

-   Local
-   Beta
-   Production

### Trạng thái (Status)
Dưới đây là những trạng thái, AI chỉ được phép test Done or Fail
Nếu ko chắc chắn hãy confirm với QC

Option:

-   Done
-   Fail
-   Cancel
-   Doing
-   Pending

### Note

Ghi nhận:

-   Điều kiện test
-   Dữ liệu test, ghi rõ ràng cụ thể
-   Kết quả khác biệt
-   Expected result:
-   Link video (nếu có)
-   Link ảnh (nếu có)

### DEV NOTE

Developer cập nhật:

-   Fixed
-   Cannot reproduce
-   Need BA confirm
-   Waiting deploy
-   Duplicate bug

### Test Date

Định dạng:

YYYY-MM-DD HH:mm

Ví dụ:

2026-07-12 09:30

### QC

Tên Tester thực hiện.

Ví dụ:

-   Giang Le
-   Nguyen Van A

------------------------------------------------------------------------

# Quy trình AI cần tuân thủ

## Ticket Update

AI phải:

1.  Đọc Requirement.
2.  Phân tích Business Logic.
3.  Sinh đầy đủ testcase.
4.  Cover:

-   Happy Case
-   Validation
-   Boundary
-   Negative
-   Business Rule
-   Exception
-   Regression

Không bỏ sót case.

## Ticket Bug

AI phải:

1.  Đọc Bug Description.
2.  Đọc Steps.
3.  Phân tích nguyên nhân.
4.  Sinh testcase Regression.
5.  Sinh testcase Boundary.
6.  Sinh testcase liên quan.

------------------------------------------------------------------------

# Quy tắc sinh Testcase

Mỗi testcase phải có:

-   Function
-   Title
-   Priority
-   Platform
-   Environment
-   Expected Result
-   Actual Result (nếu bug)
-   Test Date

------------------------------------------------------------------------

# Coverage tối thiểu

AI phải luôn cover:

-   Happy Case
-   Invalid Data
-   Boundary Value
-   Empty Value
-   Null
-   Duplicate
-   Permission
-   Time
-   Date
-   Overnight Shift
-   Cross Month
-   Payroll Impact
-   Multi Shift
-   API Error
-   Database Sync
-   Network Delay
-   Refresh Browser
-   Multi User
-   Regression

Không được sinh testcase trùng lặp.
