# AI Test Report Guide

---

# PHẦN 1 — DÀNH CHO QC: THÔNG TIN CẦN CUNG CẤP KHI NHỜ AI LÀM TEST REPORT

Chỉ cần gửi 2 thông tin (cùng với yêu cầu "làm Test Report cho ticket <ID>"):

```
Developer:          <tên người phát triển chức năng/fix bug>
Reviewer/Approver:  <tên người review/phê duyệt kết quả>
```

Nếu có file/Sheet Test Report mẫu riêng của tuần này, đính kèm đường dẫn; nếu không, AI dùng mẫu Test Report hiện có. Mọi thứ khác AI tự lấy từ Checklist của ticket (số liệu, Project Name, Project Code, thời gian test) — QC chỉ cần review kết quả.

> Chỉ nhờ làm Test Report **sau khi** các testcase của ticket đã chạy xong (không còn dòng đang `Doing`, hoặc QC chấp nhận để `Pending`/`Cancel` có lý do).

---
---

# PHẦN 2 — DÀNH CHO AI (QC không cần đọc từ đây trở xuống)

## Mục đích

File **Test Report** tổng hợp kết quả kiểm thử của một Ticket sau khi kiểm thử xong, là báo cáo cuối cùng cho Developer, Leader, PM và Reviewer đánh giá chất lượng trước khi phát hành. **AI chỉ điền dữ liệu, không thay đổi định dạng, merge cell hoặc công thức.**

## Làm việc theo ticket tuần

- Mỗi ticket 1 Test Report riêng, số liệu lấy **từ Sheet Checklist của ticket đó** (link + tab QC đã gửi), không dùng số liệu của ticket khác.
- Thiếu Developer hoặc Reviewer/Approver → **hỏi QC, không tự đoán/không để trống**.

## Sheet: Test Report — các trường

| Trường | Cách AI điền |
|---|---|
| **Project Name** | Tên ticket (`Tên ticket` ở ô A3 của Checklist / Ticket Title). Không để trống. |
| **Project Code** | Mã ticket (`TK<ID>`) hoặc tên branch GitHub (VD `feature/attendance-tool`) — lấy từ khối QC điền. |
| **Project Duration** | **Start Date** = ngày `Test Date` sớm nhất, **End Date** = ngày `Test Date` muộn nhất trong Checklist của ticket (không suy đoán, không dùng ngày hôm nay nếu chưa test xong). |
| **Developer** | QC cung cấp. |
| **Reviewer/Approver** | QC cung cấp. |

## Thống kê kết quả

Trạng thái đếm theo **kết quả CUỐI CÙNG của mỗi testcase** = Trạng thái ở nhóm `TEST LẦN N` có dữ liệu **mới nhất** của dòng đó (testcase Fail ở lần 1 rồi DONE ở lần 2 → tính 1 `Done`, không tính cả Fail). Không cộng dồn qua các lần test.

| Mục | Ý nghĩa |
|---|---|
| Done | Số testcase có trạng thái cuối `DONE` |
| Fail | Số testcase có trạng thái cuối `Fail` |
| Doing | Đang kiểm thử |
| Cancel | Đã huỷ |
| Pending | Chưa thực hiện / chưa xác nhận được |
| Total | Tổng số testcase |

Công thức: **Total = Done + Fail + Doing + Cancel + Pending**.

## Quy trình AI tạo Test Report

1. Đọc Checklist của ticket (dò 2 dòng tiêu đề để xác định nhóm `TEST LẦN N`, không hardcode cột; bỏ qua dòng mẫu/dòng trống).
2. Xác định trạng thái cuối của từng testcase, đếm Done/Fail/Doing/Cancel/Pending.
3. Đọc Bug Report/Note của các testcase Fail để đối chiếu — mỗi Fail phải có bug tương ứng.
4. Điền Project Name, Project Code, Project Duration, Developer, Reviewer/Approver.
5. Điền thống kê, kiểm tra Total.
6. Đọc lại file sau khi điền để xác nhận giá trị đúng.

## Quy tắc

Không sửa format, merge cell, màu, font, công thức. Chỉ điền dữ liệu.

## Validation (AI tự kiểm tra trước khi bàn giao)

- Total đúng; Done + Fail + Doing + Cancel + Pending = Total; không âm.
- Project Name không trống; có Developer; có Reviewer; có thời gian kiểm thử.
- Số lượng khớp số dòng testcase thật trong Checklist (không tính dòng mẫu/dòng trống).
- Mọi testcase `Fail` đã có Bug Report.

## Output

Test Report phản ánh: thông tin dự án · người thực hiện · người phê duyệt · thời gian kiểm thử · tổng quan kết quả. Trả QC review kèm danh sách testcase Fail/Pending (nếu có) để QC nắm nhanh.
