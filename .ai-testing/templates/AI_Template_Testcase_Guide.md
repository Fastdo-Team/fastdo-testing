# AI Checklist / Test Case Template Guide

---

# PHẦN 1 — DÀNH CHO QC: CHUẨN BỊ SHEET CHECKLIST CHO MỖI TICKET

QC chỉ cần làm đúng 3 việc, không cần đọc phần còn lại:

1. **Copy `Template Checklist .xlsx`** (hoặc Sheet mẫu) thành Sheet/tab riêng cho ticket.
2. **Điền tên ticket vào dòng `Tên ticket`** (ô A3, ngay dưới dòng tiêu đề) — VD `TK800 – Cập nhật đơn nghỉ phép`.
3. **Chia sẻ quyền Editor cho Service Account** (giống các Sheet trước) rồi gửi link Sheet + tên tab cho AI trong khối điền ở `AI_Prompt_Template_Ticket_Update.md` / `AI_Prompt_Template_Ticket_Bug.md`.

**Ai điền cột nào:**

| Cột | Ai điền |
|---|---|
| ID, Function, Tiêu đề, Nền tảng, Môi trường, Note, Test Date | **AI** điền (testcase do AI sinh; kết quả do AI test) |
| Ưu tiên, Trạng thái | **AI KHÔNG điền lúc sinh testcase** (để trống). Chỉ điền khi đã chạy test: Trạng thái theo kết quả thật; Ưu tiên chỉ khi test ra bug thật |
| DEV NOTE | **Developer** (Fixed / Cannot reproduce / Need BA confirm / Waiting deploy / Duplicate bug) — AI không đụng vào |
| QC | **QC** chọn tên mình (hoặc AI điền theo tên QC đã ghi ở khối điền) |

**Quy định của QC:** lúc sinh testcase, để trống 2 cột `Ưu tiên` và `Trạng thái` (không điền cả `Pending`). Trạng thái chỉ điền sau khi chạy test; Ưu tiên chỉ điền khi test ra bug thật (mức `Quan trọng`/`Khẩn cấp`).
AI chỉ được chốt trạng thái `DONE` hoặc `Fail` khi đã tự xác nhận; không chắc → `Pending` và ghi lý do trong Note, hoặc hỏi QC.

---
---

# PHẦN 2 — DÀNH CHO AI (QC không cần đọc từ đây trở xuống)

## Mục đích

Mô tả cấu trúc **Template Checklist** (`Template Checklist .xlsx`, sheet `CheckList`) để AI sinh Test Case và ghi kết quả đúng định dạng của Fastdo. **AI không tự ý điền thông tin; không chắc thì hỏi QC.**

> Cấu trúc thực tế đọc từ `Template Checklist .xlsx` (cập nhật 2026-10-09). Mỗi Sheet có thể khác nhau → **luôn dò lại 2 dòng tiêu đề và Data Validation thật của Sheet đang ghi** (Rules_Skill B.3, C.3.6 Bước 0), không hardcode cột/giá trị theo bảng dưới.

## Bố cục sheet `CheckList`

- Dòng 1: gộp nhóm `TEST LẦN 1` … `TEST LẦN 10`. Dòng 2: tên cột. Dòng 3: `Tên ticket` (gộp A3:E3). **Testcase bắt đầu từ dòng 4**; mỗi dòng 1 testcase.
- Cột cố định (trái): `ID` (A) · `Function` (B, gộp B:C) · `Tiêu đề` (D) · `Nền tảng` (E).
- Mỗi nhóm `TEST LẦN N` gồm 6 cột: `Ưu tiên` · `Môi trường` · `Trạng thái` · `Note` · `DEV NOTE` · `Test Date` (cả 10 nhóm `TEST LẦN 1…10` đều có đủ 6 cột như nhau, kể cả `DEV NOTE`). Vị trí trong template hiện tại: lần 1 = F:K, lần 2 = L:Q, lần 3 = R:W, lần 4 = X:AC, lần 5 = AD:AI, lần 6 = AJ:AO, lần 7 = AP:AU, lần 8 = AV:BA, lần 9 = BB:BG, lần 10 = BH:BM (chỉ để minh hoạ — vẫn phải dò lại theo nhãn `TEST LẦN n` ở dòng 1; khi so khớp tên cột **bỏ khoảng trắng thừa và không phân biệt hoa/thường**).
- Cột cuối: `QC` (BN).
- Test lại (Fail → retest) ⇒ ghi vào **nhóm TEST LẦN kế tiếp**, tiếp tục đến khi Done. Không đè/nối vào lần trước.
- **Data Validation (dropdown) trong template:** `Function` (B), `Nền tảng` (E) và `QC` (BN) áp dụng dòng 4–500; `Ưu tiên`, `Môi trường`, `Trạng thái` áp dụng dòng 4–500 cho **đủ 10 nhóm TEST LẦN**. Sheet sao chép từ bản template cũ có thể còn thiếu dropdown ở các lần sau → vẫn đọc Data Validation thật của Sheet trước khi ghi (Rules_Skill B.3).

## Các trường

**ID** — `TK<MãTicket>_<STT 3 số>` (VD `TK1000_001`). Tăng dần, không trùng. Bỏ các ID mẫu (`TK1000_001`, `TK1000_002`) của template khi tạo testcase thật.

**Function** — chức năng/module được kiểm thử. Template có dropdown danh sách module (fTodolist, fPlan, fWorkflow, fOKRS, fGoals, fPerformance, fCFRs, fOrganization, fSetting, fData, fReport, fKaizen, finstruction, fChat, fNews, fMail, fAchievement, fReward, fRecognition, fMeeting, fOthers, fProfile, fCheckin, fPayroll) — **ô có Data Validation thì chọn đúng giá trị trong dropdown**; tên chức năng cụ thể (Tạo đơn nghỉ phép, Cập nhật bảng công…) đưa vào Tiêu đề. Ô không có Data Validation thì ghi `<Module> – <chức năng>`.

**Tiêu đề** — mô tả ngắn, **trung lập** mục tiêu kiểm tra (không dùng "Kiểm tra lỗi…", "Hiển thị sai…"). VD: `Tạo đơn nghỉ phép với số ngày vượt phép tồn`.

**Nền tảng** — theo Data Validation của template: `Web` · `App` · `Web + App`. (API → ghi `Web`/`App` theo nơi gọi và nêu rõ "API" trong Tiêu đề/Note.)

**Ưu tiên** — **để trống lúc sinh testcase; chỉ điền khi test ra bug thật** (mức độ của bug). Template: `Thấp` · `Trung bình` · `Quan trọng` · `Khẩn cấp`. Quy tắc chọn:
- `Khẩn cấp`: ảnh hưởng hệ thống, Payroll, Checkin; tính năng trong spec nhưng chưa lập trình (Rules_Skill B.5).
- `Quan trọng`: ảnh hưởng chức năng chính; bug thật phát hiện khi test.
- `Trung bình`: lỗi nghiệp vụ phụ.
- `Thấp`: UI, hiển thị.

**Môi trường** — template: `Beta` · `Localhost` · `Production`. Lấy theo Môi trường QC ghi trong khối điền.

**Trạng thái** — template: `DONE` · `Fail` · `Doing` · `Cancel` · `Pending`. AI chỉ tự chốt `DONE`/`Fail` (và `Pending` khi lần này không xác nhận được). **Sinh testcase xong chưa chạy → để trống, không điền `Pending`.** Giữ đúng chữ hoa/thường như Data Validation.

**Note** — nơi ghi nội dung của lần test đó (template **không có cột Mô tả riêng**; sheet cũ như `fEvaluation - VIBE` tách thành cột Mô tả + cột Kết quả thực hiện, còn template hàng tuần gộp cả hai vào Note). Thuật ngữ thống nhất là **"Kết quả mong đợi"** (sheet cũ có thể ghi "Kết quả mong muốn" — cùng nghĩa):
- *TEST LẦN 1, lúc sinh testcase* — khối nội dung testcase theo Rules_Skill C.6, xuống dòng thật `\n`:
  ```
  Điều kiện: <vai trò, trạng thái đối tượng, số lượng/ràng buộc dữ liệu — cụ thể>
  Các bước:
  B1: <thao tác / quan sát khách quan>
  B2: ...
  Kết quả mong đợi: <hành vi ĐÚNG theo spec, kèm mã rule BR-xxx / D-xxx / số mục>
  ```
- *Sau khi chạy test* — nối thêm vào **cùng ô Note của lần đó**: `[Kết quả thực hiện YYYY-MM-DD qua CDP trình duyệt thật]: <2–3 câu quan sát thực tế, nêu loại bằng chứng> - Video Test Record: <link Catbox>` (+ link ảnh nếu có). Không lặp lại nguyên văn "Kết quả mong đợi".
- *TEST LẦN ≥ 2 (retest)* — Note chỉ chứa kết quả lần retest đó theo định dạng trên (không copy lại điều kiện/bước từ lần 1); video cũ chỉ dẫn lại kèm ghi chú "không phải bằng chứng lần này".
- Bug thật: Note nêu rõ Actual vs Expected; Ưu tiên `Quan trọng`/`Khẩn cấp`.

**DEV NOTE** — Developer điền (Fixed / Cannot reproduce / Need BA confirm / Waiting deploy / Duplicate bug). **AI không ghi.**

**Test Date** — `YYYY-MM-DD HH:mm` (VD `2026-07-12 09:30`). Các cột Test Date của template đã định dạng `yyyy-mm-dd hh:mm`; ghi qua `jwt_sheets.js` (USER_ENTERED) thì Sheet tự nhận là ngày–giờ. Để trống đến khi thực sự chạy test.

**QC** — dropdown của template: `Nhi` · `Giang` · `Hạnh`; lấy theo QC ghi trong khối điền. QC chưa có trong dropdown → Leader thêm tên vào Data Validation cột `BN` của `Template Checklist .xlsx` (Dữ liệu → Xác thực dữ liệu); AI không tự thêm tên và không ghi giá trị ngoài danh sách.

## Quy trình sinh testcase

**Ticket Update:** đọc Requirement → phân tích Business Logic (đã đối chiếu Workflow) → sinh đủ testcase các nhóm: Happy, Validation, Boundary, Negative, Business Rule, Exception, Permission, Regression.

**Ticket Bug:** đọc Bug Description & Steps → phân tích nguyên nhân → sinh testcase Re-test (đúng kịch bản & dữ liệu gốc), Regression, Boundary, và các case liên quan cùng root cause.

Quy tắc viết nội dung: xem `AI_Prompt_Template_Ticket_Update.md` mục 2b.B (tiêu đề trung lập, điều kiện cụ thể, bước xác nhận tiền đề, tách nhỏ 1 rule = 1 case). Mỗi testcase phải có: Function · Tiêu đề · Nền tảng · Môi trường · Kết quả mong đợi (trong Note hoặc cột Mô tả) · Test Date (khi đã chạy) · Actual result (nếu bug). Ưu tiên chỉ có khi là bug thật; Trạng thái chỉ có sau khi chạy test.

## Coverage — chọn theo ticket, không sinh thừa

Danh sách dưới là **kho gợi ý**; chỉ sinh nhóm **áp dụng được** cho Requirement/Bug của ticket (VD ticket về UI hồ sơ không cần Overnight Shift / Payroll Impact). Nhóm bỏ qua → ghi một dòng lý do trong phần Test Scenario gửi QC.

- Chung: Happy Case · Invalid Data · Boundary Value (2 phía biên) · Empty Value · Null · Duplicate · Permission (mỗi vai trò 1 case) · Refresh Browser · Multi User · Network Delay · API Error · Database Sync · Regression.
- Thời gian (module có ngày/giờ/ca): Time · Date · Overnight Shift · Cross Month · Multi Shift.
- Liên module: Payroll Impact (khi chạm fCheckin/fPayroll) · các module phụ thuộc theo Impact Matrix.

Không được sinh testcase trùng lặp; không ghi đè dòng đã có nội dung thật.
