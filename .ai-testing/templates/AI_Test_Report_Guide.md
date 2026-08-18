
# AI Test Report Guide

## Mục đích
File **Test Report** dùng để tổng hợp kết quả kiểm thử của một Ticket/Feature sau khi QC hoàn thành kiểm thử. Đây là báo cáo cuối cùng để Developer, Leader, PM và Reviewer đánh giá chất lượng chức năng trước khi phát hành.

AI chỉ được điền dữ liệu, không được thay đổi định dạng, merge cell hoặc công thức (nếu có).

## Sheet: Test Report

### 1. Project Name
- Mô tả: Tên dự án hoặc tên Ticket.
- Kiểu dữ liệu: Text.
- Ví dụ: Update Attendance Management Tool.

### 2. Project Code
- Mô tả: Tên branch Github hoặc mã ticket.
- Kiểu dữ liệu: Text.
- Ví dụ: feature/attendance-tool.

### 3. Project Duration
- Mô tả: Khoảng thời gian kiểm thử.
- Gồm:
  - Start Date
  - End Date

### 4. Developer
- Người phát triển chức năng.

### 5. Reviewer/Approver
- Người review hoặc phê duyệt kết quả kiểm thử.

## Thống kê kết quả

### Done
Số lượng testcase PASS.

### Fail
Số lượng testcase FAIL.

### Doing
Số testcase đang được kiểm thử.

### Cancel
Số testcase hủy.

### Pending
Số testcase chưa thực hiện.

### Total
Tổng số testcase.

Công thức:

Total = Done + Fail + Doing + Cancel + Pending

## Quy trình AI tạo Test Report

1. Đọc Checklist/Testcase.
2. Đếm số testcase theo từng trạng thái.
3. Đọc Bug Report để đối chiếu testcase Fail.
4. Điền thông tin Project.
5. Điền Developer và Reviewer.
6. Điền thời gian kiểm thử.
7. Điền thống kê Done/Fail/Doing/Cancel/Pending.
8. Kiểm tra Total.

## Quy tắc

- Không sửa format.
- Không sửa merge cell.
- Không sửa màu.
- Không sửa font.
- Không sửa công thức.
- Chỉ điền dữ liệu.

## Validation

AI phải kiểm tra:

- Total đúng.
- Done + Fail + Doing + Cancel + Pending = Total.
- Không âm.
- Không để trống Project Name.
- Có Developer.
- Có Reviewer.
- Có thời gian kiểm thử.

## Output

Sau khi hoàn thành, Test Report phản ánh:
- Thông tin dự án.
- Người thực hiện.
- Người phê duyệt.
- Thời gian kiểm thử.
- Tổng quan kết quả kiểm thử.
