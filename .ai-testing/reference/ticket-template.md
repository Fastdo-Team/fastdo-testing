# Plan & Ticket Template — AI Testing

> **Copy template này thành `plans/ticket_{id}_plan.md` khi bắt đầu tiếp nhận ticket mới.**
> File này dùng để theo dõi xuyên suốt vòng đời: từ nhật ký Prompt của QC, trạng thái duyệt Plan, tiến độ triển khai sinh Test Case, đến kết quả nghiệm thu.

---

# ticket_{id}_plan

## 1. Meta (Thông tin chung & Trạng thái)

| Field | Value |
|---|---|
| **Ticket ID** | |
| **Ticket Title** | |
| **Ticket Type** | `Update` / `Bug` |
| **Module** | |
| **Branch** | |
| **Environment** | `Local` / `Beta` / `Production` |
| **Status** | `scout-analyzing` / `scenario-review` / `implementing-tc` / `ready-for-qc` / `qc-testing` / `done` / `blocked` |
| **Workflow File** | `WORKFLOW/<Module>.md` |
| **Rules Applied** | *(Ghi các rule `.ai-testing/rules/` đã áp dụng)* |
| **Output Checklist File** | `tests/Checklist_Ticket_{id}.xlsx` |
| **Output Report File** | `reports/Test_Report_{id}.xlsx` / `reports/Bug_Report_{id}.md` |
| **Date Started** | `YYYY-MM-DD` |
| **QC Owner** | |

---

## 2. Prompts Ledger (Nhật ký Prompt của QC)

### Prompt Ledger — Nguyên văn từng lượt, KHÔNG tóm tắt
Mỗi lượt prompt từ QC (kể cả lượt đầu tiên và các lượt yêu cầu chỉnh sửa) ghi đúng 2 mục:

- `[turn 1]` **Prompt (nguyên văn 100%, copy paste):**
  > ...
  **Hiểu / Suy luận & Quyết định của AI:** AI hiểu yêu cầu thành gì, quyết định phân tích/xử lý gì dựa trên đó.

- `[turn 2]` **Prompt (nguyên văn 100%, copy paste):**
  > ...
  **Hiểu / Suy luận & Quyết định của AI:** ...

### Current Canonical Request (Yêu cầu hiện tại sau tất cả điều chỉnh)
> Tóm tắt 1-3 câu ngắn gọn yêu cầu nghiệp vụ hiện tại sau toàn bộ trao đổi với QC.

---

## 3. Scout & Analysis (Khảo sát & Phân tích)

### Files Explored (Source Code & Workflow)
- `WORKFLOW/<Module>.md`: Các section liên quan
- `fastdo-server/...`: Các file code đã đọc (Read-Only)

### ⚠️ Cảnh báo & Đề xuất Cập nhật Workflow
- **Section cần sửa**:
- **Nội dung Rule mới**:

### Scope / Impact Matrix (Ma trận tác động)
- **Vùng trực tiếp**:
- **Vùng lan truyền (Regression Area)**:

---

## 4. Test Scenarios (Kịch bản Kiểm thử)

Danh sách kịch bản bao phủ 11 nhóm:
1. **Happy Case**:
   - `SC_{id}_001`: ...
2. **Validation Case**:
   - `SC_{id}_002`: ...
3. **Boundary Case**:
   - `SC_{id}_003`: ...
4. **Negative Case**:
   - `SC_{id}_004`: ...
5. **Business Rule Case**:
   - `SC_{id}_005`: ...
6. **Permission Case**:
   - `SC_{id}_006`: ...
7. **Exception Case**:
   - `SC_{id}_007`: ...
8. **Regression Case**:
   - `SC_{id}_008`: ...
9. **Compatibility Case**:
   - `SC_{id}_009`: ...
10. **Database Case**:
    - `SC_{id}_010`: ...
11. **API Case**:
    - `SC_{id}_011`: ...

---

## 5. Progress (Tiến độ triển khai của AI & QC)

| Bước | Nội dung công việc | Người thực hiện | Trạng thái | Ghi chú |
|---|---|---|:---:|---|
| **1. Scout & Phân tích** | Đọc Workflow, File change, lập Impact Matrix & Cảnh báo | AI | `DONE` | |
| **2. Kịch bản (Scenario)** | Soạn thảo 11 nhóm Test Scenarios vào file Plan | AI | `DONE` | |
| **3. Cổng Duyệt Plan** | QC Review & Confirm kịch bản trong Plan | QC | `DONE` / `PENDING` | |
| **4. Implement Test Case** | Sinh file Excel Checklist đúng chuẩn Fastdo | AI | `DONE` / `PENDING` | Xuất file `tests/` |
| **5. Thực thi Test** | QC chạy test thực tế trên môi trường | QC | `PENDING` / `IN_PROGRESS` | Điền DONE/FAIL |
| **6. Tổng hợp & Đóng** | Xuất Test Report / Bug Report & Cập nhật Workflow | AI & QC | `PENDING` | |

### Implementation Notes (Ghi chú triển khai của AI)
- **File Test Case đã sinh**: `tests/Checklist_Ticket_{id}.xlsx`
- **Tổng số Test Case**: `X` test cases (`TK{id}_001` → `TK{id}_00X`)
- **Tình trạng Implement**: Đã sinh đầy đủ dữ liệu / Đang chờ review...

---

## 6. Wrap-up (Tổng kết & Bàn giao)

### Cases Covered
- Happy: X | Validation: X | Boundary: X | Negative: X | Business Rule: X | Permission: X | Exception: X | Regression: X | Compatibility: X | DB: X

### Remaining Risks / Ghi chú
- 

### Final Summary
> Tóm tắt 1-2 câu về kết quả nghiệm thu cuối cùng của ticket.
