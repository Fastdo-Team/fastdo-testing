---
description: Quy tắc xuất Test Report, Bug Report, Workflow Update Notification
applies_to: Bước tổng hợp kết quả (Bước cuối)
priority: MEDIUM
---

# Report Output — Đầu ra hoàn chỉnh

## Output bắt buộc cho Ticket Update

AI phải xuất đầy đủ theo thứ tự:

1. ✅ **Workflow File Analyzed** — Tên file Workflow đã đọc
2. ✅ **⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT WORKFLOW** — Danh sách Rule mới / Tính năng mới (nếu có)
3. ✅ **Danh sách Module & Feature bị ảnh hưởng** — Dựa trên Workflow
4. ✅ **Business Logic Summary & Rule Mapping** — Bảng đối chiếu Requirement vs Workflow
5. ✅ **Regression Area & Impact Matrix** — Ma trận tác động
6. ✅ **Test Scenario** — Liệt kê đủ 11 nhóm case
7. ✅ **Checklist/Test Case** — Xuất dạng bảng đúng format Checklist
8. ✅ **Screenshot List** — Danh sách ảnh chụp cần lấy

## Output bắt buộc cho Ticket Bug

1. ✅ **Workflow File Analyzed**
2. ✅ **⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT WORKFLOW** (nếu có)
3. ✅ **Bug Summary & Root Cause Analysis**
4. ✅ **Code Fix Verification (Before vs After)**
5. ✅ **Impact Analysis & Regression Area**
6. ✅ **Regression Test Scenario** — Đủ 11 nhóm case + Bug Re-test
7. ✅ **Test Case / Checklist** — Dạng bảng
8. ✅ **Verify Result** — PASS / FAIL
9. ✅ **Bug Report** (nếu FAIL)
10. ✅ **Screenshot List**
11. ✅ **Test Summary**

## Test Report Format

Theo `AI_Test_Report_Guide.md`:

| Trường | Mô tả |
|---|---|
| Project Name | Tên dự án / Ticket |
| Project Code | Branch Github / mã ticket |
| Project Duration | Start Date → End Date |
| Developer | Người phát triển |
| Reviewer/Approver | Người review |
| Done | Số TC PASS |
| Fail | Số TC FAIL |
| Doing | Số TC đang test |
| Cancel | Số TC hủy |
| Pending | Số TC chưa test |
| Total | Done + Fail + Doing + Cancel + Pending |

## Bug Report Format (khi FAIL)

Phải có đầy đủ:
- Bug ID
- Bug Title
- Steps to Reproduce (từng bước chi tiết)
- Expected Result
- Actual Result
- Screenshot / Video evidence
- Severity & Priority
- Environment & Platform

## Quy tắc

- Không sửa format Test Report template
- Không sửa merge cell / màu / font
- Không sửa công thức
- Chỉ điền dữ liệu
- Total phải đúng: Done + Fail + Doing + Cancel + Pending = Total
