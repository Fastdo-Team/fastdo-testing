# Quy trình AI Testing — Chi tiết từng bước

Sơ đồ 5 bước tổng quan đã có tại [`AI_TESTING_RULES.md`](../../AI_TESTING_RULES.md) §2 —
không lặp lại ở đây. Nội dung dưới đây bổ sung phần **ai làm gì ở từng bước**, không có ở
file gốc.

## Chi tiết từng bước

### Bước 1: Tiếp Nhận & Phân Tích
**Người thực hiện:** AI

- QC nhập thông tin Ticket (ID, Title, Requirement, Module, Branch, Environment, Date)
- AI phân tích theo loại:
  - **Ticket Update**: Đọc Requirement → Workflow → File Change → Source Code
  - **Ticket Bug**: Đọc Bug Description → Workflow → Diff File → Code thay đổi
- AI xác định vùng ảnh hưởng (Impact Matrix)
- AI phát hiện Rule mới / thay đổi trong Code → Cảnh báo cập nhật Workflow

### Bước 2: Rà Soát Kịch Bản
**Người thực hiện:** AI & QC

- AI sinh danh sách Test Scenario (11 nhóm case)
- **CỔNG KIỂM DUYỆT**: AI DỪNG lại, chờ QC Review
- QC kiểm tra:
  - AI có hiểu đúng/đủ nghiệp vụ không?
  - Có thiếu/sai scenario không?
- Nếu thiếu/sai → QC yêu cầu AI bổ sung/chỉnh sửa
- Khi đạt → QC Confirm để sang bước tiếp

### Bước 3: Sinh Test Case & Xuất File
**Người thực hiện:** AI

- AI chi tiết hóa từng Scenario thành Test Case đầy đủ
- Đúng format Template Checklist Fastdo
- Xuất file Excel (.xlsx) để QC theo dõi

### Bước 4: Kiểm Thử
**Người thực hiện:** QC

- QC thực thi test trên hệ thống thật
- Đánh giá:
  - ✅ PASS — Tính năng hoạt động chuẩn xác
  - ❌ FAIL — Phát sinh lỗi thực tế

### Bước 5: Tổng Hợp & Kết Thúc
**Người thực hiện:** AI & QC

- PASS toàn bộ → AI sinh Test Report → QC review → Done
- Có FAIL → AI sinh Bug Report → Trả lại Dev → Retest từ Bước 4
- AI xuất danh sách Cập nhật Workflow → QC cập nhật file `.md`

## Quy tắc quan trọng

1. AI KHÔNG được bỏ qua Bước 2 (Cổng kiểm duyệt)
2. AI KHÔNG được tự ý điền Trạng thái test nếu chưa chắc chắn
3. Mọi output phải đối chiếu lại với file Workflow
