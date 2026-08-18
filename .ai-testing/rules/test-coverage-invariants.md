---
description: Các bất biến về độ bao phủ kiểm thử — 11 nhóm case bắt buộc
applies_to: Mọi ticket (Update & Bug)
priority: HIGH
---

# Test Coverage Invariants — Bao phủ 100%, không bỏ sót

## 11 nhóm Test Scenario bắt buộc

Mọi ticket đều phải có Test Scenario bao phủ TỐI THIỂU các nhóm sau:

| # | Nhóm | Mô tả | Bắt buộc |
|---|---|---|---|
| 1 | **Happy Case** | Luồng hoạt động chuẩn theo Requirement và Workflow | ✅ Luôn có |
| 2 | **Validation Case** | Rào chắn dữ liệu, ký tự đặc biệt, định dạng, độ dài | ✅ Luôn có |
| 3 | **Boundary Case** | Ranh giới giá trị (min/max phút OT, khoảng cách GPS, ngày phép...) | ✅ Luôn có |
| 4 | **Negative Case** | Nhập sai dữ liệu, thao tác không hợp lệ | ✅ Luôn có |
| 5 | **Business Rule Case** | Quy tắc nghiệp vụ ràng buộc (bao gồm Rule mới phát hiện) | ✅ Luôn có |
| 6 | **Permission Case** | Phân quyền các cấp (Admin, Trưởng phòng, Nhân viên, Creator, Người duyệt) | ✅ Luôn có |
| 7 | **Exception Case** | Ngoại lệ kết nối, lỗi thiết bị, GPS nhiễu, lệch thời gian | ✅ Luôn có |
| 8 | **Regression Case** | Tính năng liên quan không bị ảnh hưởng sau update | ✅ Luôn có |
| 9 | **Compatibility Case** | Đa thiết bị Mobile / Web Desktop | ⚡ Nếu có UI |
| 10 | **Database Case** | Toàn vẹn dữ liệu DB | ⚡ Nếu có DB change |
| 11 | **API Case** | Status code, payload response | ⚡ Nếu có API change |

## Bổ sung cho Ticket Bug (ngoài 11 nhóm trên)

| # | Nhóm | Mô tả |
|---|---|---|
| 0 | **Bug Re-test Case** | Kịch bản tái hiện trực tiếp Bug để xác minh đã fix | 

## Coverage tối thiểu — Checklist AI phải luôn cover

Dựa trên `AI_Template_Checklist_Guide.md`:

- [ ] Happy Case
- [ ] Invalid Data
- [ ] Boundary Value
- [ ] Empty Value / Null
- [ ] Duplicate
- [ ] Permission (Admin, Manager, Employee)
- [ ] Time / Date edge cases
- [ ] Overnight Shift (nếu liên quan ca làm)
- [ ] Cross Month (nếu liên quan kỳ lương/phép)
- [ ] Payroll Impact (nếu liên quan công/lương)
- [ ] Multi Shift (nếu liên quan phân ca)
- [ ] API Error handling
- [ ] Database Sync
- [ ] Network Delay / Offline
- [ ] Refresh Browser
- [ ] Multi User concurrent
- [ ] Regression (tính năng cũ không bị ảnh hưởng)

## Anti-pattern

| Lỗi | Hậu quả |
|---|---|
| Sinh Test Case trùng lặp | QC mất thời gian, báo cáo sai số lượng |
| Chỉ có Happy Case | Bỏ sót lỗi edge case |
| Không có Regression Case | Lỗi lan truyền không được phát hiện |
| Copy test case từ ticket khác không sửa ID | Trùng ID, nhầm lẫn tracking |
