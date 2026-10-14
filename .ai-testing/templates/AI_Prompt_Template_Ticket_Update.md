# AI Prompt Template - Ticket Update (chạy ticket hàng tuần)

---

# PHẦN 1 — DÀNH CHO QC: CHỈ CẦN ĐIỀN KHỐI NÀY

> Mỗi ticket 1 lần: copy khối bên dưới → điền chỗ trống → gửi AI. **Chỉ điền đúng những gì có trong khối; mọi thứ còn lại (từ Phần 2 trở xuống) là việc của AI, QC không cần đọc.**
> Thiếu mục 🔴 nào AI sẽ hỏi lại, không tự đoán và không dùng lại giá trị của ticket trước (URL devtunnel, tổ chức, Sheet đều đổi theo từng ticket).

```
Đọc CLAUDE.md và AI_Prompt_Template_Ticket_Update.md rồi làm theo.

🔴 Ticket (ID – Tên):        TK<ID> – <Title>
🔴 Requirement:               <dán nội dung / link ticket>
🔴 Module:                    <VD fEvaluation / fCheckin / fProfile>
🔴 Branch + thư mục source:   <branch>  |  <đường dẫn thư mục source code / tài liệu của ticket>
🔴 Môi trường:                <Localhost / Beta / Production>
🔴 URL web cần test:          <dán URL — devtunnel đổi mỗi lần>
🔴 Tổ chức/Công ty:           <VD Water Quality - NH3T TEAM>
🔴 Link Google Sheet + Tab:   <link Sheet Checklist của ticket> | <tên tab>
🔴 QC thực hiện:              <Nhi / Giang / Hạnh>
🔴 Chế độ lần này:            [1] Phân tích + sinh Test Scenario (dừng chờ QC review)
                              [2] Sinh Test Case vào Sheet (dừng chờ QC review)
                              [3] Chạy test tự động + ghi Sheet
                              [4] Làm tuần tự 1→2→3, dừng chờ QC xác nhận sau bước 1 và 2

🔴 Quy tắc ghi Sheet (cố định, QC không cần sửa):
   - Lúc viết testcase: KHÔNG điền cột Ưu tiên và Trạng thái.
   - Khi chạy test: điền Trạng thái theo kết quả thật (DONE / Fail / Pending nếu không xác nhận được).
   - Cột Ưu tiên: CHỈ điền khi test ra bug thật (mức Quan trọng hoặc Khẩn cấp).
   - Không ghi vào cột DEV Note.

🟡 (chỉ điền nếu có) Dữ liệu/trạng thái đặc thù cần sẵn + tài khoản test thứ 2: <...>
🟡 (chỉ điền nếu có) Chỉ chạy lại 1 phần — mã testcase cần chạy: <VD TK800_003 → TK800_006>
🟡 (chỉ khi nhờ làm Test Report) Developer: <...>  |  Reviewer/Approver: <...>
```

**QC chuẩn bị trước khi gửi (1 lần/ticket):**
1. Copy file `Template Checklist .xlsx` thành Sheet mới cho ticket → điền tên ticket vào dòng `Tên ticket` (ô A3) → chia sẻ quyền **Editor** cho Service Account như các Sheet trước.
2. Chrome đang mở sẵn ở chế độ Debug (cổng 9222) — cách bật xem `QC_Dau_Vao.md` mục 4.
3. Tài khoản đăng nhập, Catbox userhash: không cần gửi lại nếu không đổi (AI lấy ở `QC_Dau_Vao.md` mục 1).

**QC nhận lại sau mỗi chế độ:**
- [1] Bảng đối chiếu Requirement ↔ Workflow ↔ Code, Impact Matrix, danh sách Test Scenario, và mục `⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT WORKFLOW` (QC chỉ cần xem mục này và quyết định có sửa file Workflow không).
- [2] Test Case đã ghi vào Sheet (xem Phần 2, mục 3 về cách ghi).
- [3] Kết quả + video + bug report (nếu Fail) trong Sheet; Test Report khi QC yêu cầu.

---
---

# PHẦN 2 — DÀNH CHO AI (QC không cần đọc từ đây trở xuống)

## 1. Mục tiêu

Hỗ trợ QC tự động phân tích ticket Update, đọc source code ở chế độ **Read Only**, đọc tài liệu **Workflow Module** từ thư mục `<AI TESTING>\WORKFLOW`, xác định phạm vi ảnh hưởng và sinh Test Case đầy đủ, bao phủ 100% luồng nghiệp vụ không bị sót trước khi Developer bàn giao cho QC. Đặc biệt, tự động phát hiện các Rule thay đổi hoặc Tính năng mới trong Code để **Cảnh báo & Đề xuất Cập nhật vào File Workflow**.

> `<AI TESTING>` = thư mục `AI TESTING/` thực tế trên máy đang chạy (hiện tại `D:\GIANG\a\Automation\AI TESTING`). AI tự xác định đường dẫn thật, không hardcode ổ đĩa khác.

## 2. Nguyên tắc

**AI chỉ được phép:** đọc source code & File Change (Read Only); đọc & đối chiếu Workflow Module; phân tích Business Logic; xác định Module bị ảnh hưởng & Regression Area; tự động cảnh báo/đề xuất cập nhật Workflow khi thấy Rule mới/đổi trong Code; sinh Checklist/Test Case, Test Report.

**AI KHÔNG được:** sửa source code, refactor, rename, format, thay đổi Business Logic, commit.

## 2a. Làm việc theo ticket tuần — mỗi ticket là một lần làm độc lập

1. **Không mang giá trị của ticket trước sang ticket mới**: URL, tổ chức, Sheet/Tab, mã testcase, dữ liệu seed, tài khoản thứ 2 — đều lấy lại từ khối QC điền ở Phần 1. Chỉ tài khoản chính/Catbox userhash lấy từ `QC_Dau_Vao.md` mục 1.
2. **Ngày test = ngày hệ thống lúc chạy** (QC không phải điền). Test Date trong Sheet theo định dạng `YYYY-MM-DD HH:mm`.
3. **Mã testcase do AI tự cấp**: `TK<TicketID>_<STT 3 số>`. STT bắt đầu từ số tiếp theo sau ID lớn nhất đã có trong Sheet của ticket đó; không trùng ID. Ghi vào dòng trống đầu tiên (từ dòng 4 trở đi, dưới dòng `Tên ticket`) — **trước khi ghi 1 dòng, đọc lại dòng đó đã có nội dung thật chưa**.
4. **Module nào → đọc đúng 1 file `WORKFLOW/<Module>.md`** (fEvaluation có 2 bản `fEvaluation - V1.md` / `fEvaluation-Huy.md`: hỏi QC nếu không rõ bản nào). Ticket chạm nhiều module → đọc file của từng module, và đưa chuỗi ảnh hưởng giữa các module vào Impact Matrix. Module chưa có file Workflow → xem mục 8.4.
5. **Ghi chú theo module** (mục 8) là kinh nghiệm đã tích luỹ — AI tự đọc phần của module liên quan, QC không phải nhắc lại.
6. **Cuối mỗi ticket**: nếu gặp bug/hạn chế kỹ thuật mới có khả năng lặp lại ở ticket sau (control không tự động hoá được, quirk của app…), **đề xuất** QC bổ sung vào `Kinh_Nghiem_Test_Tu_Dong.md` (mục 6/8b); không tự sửa `Rules_Skill.md`/`CLAUDE.md`.

## 2b. Quy tắc bắt buộc (rút kinh nghiệm từ các đợt test thực tế, áp dụng MỌI module)

> Chi tiết & ví dụ thật: [`Kinh_Nghiem_Test_Tu_Dong.md`](./Kinh_Nghiem_Test_Tu_Dong.md), [`Rules_Skill.md`](./Rules_Skill.md), [`QC_Dau_Vao.md`](./QC_Dau_Vao.md).

### A. Cổng đọc tài liệu (không bỏ qua)
- **Trước khi viết testcase**: đọc đúng `WORKFLOW/<Module>.md` + `Rules_Skill.md` mục C.6, B.4, B.5.
- **Trước khi chạy test**: đọc `QC_Dau_Vao.md` + `Rules_Skill.md` Phần B, C.3–C.5. Đã đọc rồi và file không đổi → không cần đọc lại; chuyển sang module khác → đọc lại Workflow của module mới.
- Tên file/class trong WORKFLOW là **thiết kế dự kiến**. Chỉ coi là "đã xác nhận qua đọc code" sau khi **tự Grep/Glob thấy file tồn tại và đã đọc nội dung**. Tính năng có trong spec nhưng chưa có trong code → ghi vào bảng 8b của `Kinh_Nghiem_Test_Tu_Dong.md` và viết 1 testcase `Khẩn cấp` duy nhất (Rules_Skill B.5), không suy đoán hành vi từng rule con.
- Ticket Update: **đối chiếu Requirement ↔ Workflow ↔ Code**; chỗ nào Requirement mới mâu thuẫn Workflow cũ thì đưa vào `⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT WORKFLOW`, KHÔNG tự chọn 1 bên rồi kết luận PASS/FAIL.

### B. Viết testcase (cột Tiêu đề / Note)
1. **Tiêu đề trung lập, khách quan** — mô tả mục tiêu kiểm tra. CẤM các từ định kiến lỗi: "Kiểm tra lỗi…", "Bug UI…", "Bị cắt/bị che…", "Hiển thị sai…". Chưa chạy test thì chưa được kết luận có lỗi.
2. **Các bước chỉ nêu thao tác + quan sát khách quan** ("Quan sát giá trị bộ đếm X"), không viết sẵn kết quả. Đúng/sai nằm ở **Kết quả mong đợi** — luôn là hành vi ĐÚNG theo spec, kèm mã rule/số mục (BR-xxx, D-xxx, 1.3.7…).
3. **Điều kiện cụ thể để biết seed data**: (a) tài khoản/vai trò; (b) đối tượng & trạng thái (Active/Draft/Open/Closed…); (c) số lượng bản ghi & quan hệ ràng buộc (VD "3 nhân sự thuộc phòng ban chưa có quản lý", "danh sách ≥ 15 dòng để có phân trang").
4. **Có bước xác nhận tiền đề TRƯỚC bước thao tác chính** (vào đâu xem, xem gì, đối chiếu với gì).
5. **Tách nhỏ**: mỗi rule / counter / field = 1 case riêng.
6. Định dạng nội dung testcase: `Điều kiện` → `Các bước` (đánh số, 1 hành động/bước) → `Kết quả mong đợi`. Xuống dòng thật `\n` khi ghi qua API. Template Checklist hàng tuần **không có cột Mô tả riêng** → toàn bộ khối này ghi vào ô **Note của TEST LẦN 1** (xem `AI_Template_Testcase_Guide.md`); sheet nào có cột Mô tả riêng thì ghi vào đó.
7. Case có yếu tố động (counter, trạng thái, số liệu): thiết kế bước thay đổi thật **trước/sau** để chụp/quay, không dùng 1 ảnh tĩnh.

### C. Thực thi & báo cáo kết quả
1. **Không PASS nếu chưa xác nhận bằng ảnh/DOM thật.** Tự xem lại ảnh cuối trước khi tin boolean của script.
2. **Dùng workaround để né bug khác mới tới được bước cần test ⇒ FAIL cả case**, ghi rõ nguyên nhân bị chặn.
3. **Tiền đề phải được THẤY** (chụp/quay) — không tin mô tả suông.
4. **So khớp chuỗi tiếng Việt không phân biệt hoa/thường**. "Giống bug" ≠ bug: xác nhận định danh (ID) trước khi kết luận.
5. **Bằng chứng 3 loại** (Rules_Skill B.4): UI qua CDP+video > đọc code (ghi "XÁC NHẬN QUA ĐỌC CODE" + đường dẫn file đã đọc) > cần QC test tay. Control không tự động hoá được sau 2–3 cách → dừng, ghi "cần QC test tay" (B.6).
6. **Ghi Sheet chỉ qua `jwt_sheets.js`**, đúng nhóm cột `TEST LẦN N` (dò 2 dòng tiêu đề, không hardcode cột), Trạng thái phản ánh đúng lần này (lúc sinh testcase để trống `Ưu tiên` và `Trạng thái`; `Ưu tiên` chỉ điền khi test ra bug thật), **đọc lại sau khi ghi**. Dropdown (Ưu tiên/Môi trường/Trạng thái/Nền tảng/QC) tra Data Validation thật của Sheet trước khi ghi (Rules_Skill B.3).
7. **Kết quả thực hiện** (ghi trong Note của lần test đó): 2–3 câu tiếng Việt thường ngày, tự đủ nghĩa (tiền đề → hành động → kết quả quan sát → cách xác minh); không dán JSON/thuật ngữ kỹ thuật. Bug thật ⇒ Ưu tiên `Quan trọng`/`Khẩn cấp`.
8. **Video**: quay tới khi có kết quả cuối (chờ ~1.5s + chụp ảnh trước `recorder.stop()`); chỉ dùng `ctx.slowClickXY`/`ctx.safeClick` (con trỏ ảo); mỗi case 1 script = 1 video.
9. **Dọn dẹp**: xoá video local sau upload Catbox, xoá `shots/`, đóng bớt tab cũ (không đóng tab cuối).

### D. Kỹ thuật Puppeteer cho app Blazor Server (hay gặp ở mọi module)
- Chạy script cần `NODE_PATH` trỏ tới `node_modules` có `puppeteer-core` (không nằm trong `AI TESTING/`).
- Sau mỗi `goto/reload` dùng `waitForRealContent()`; **không** gọi `page.goto()` lặp ~15–20 lần trong 1 script (rớt circuit SignalR) — dùng link điều hướng nội bộ.
- Click chuột thật; **first click Blazor thường chỉ đổi active state** → vòng thử lại 2–4 lần, kiểm tra URL/dialog thật sau mỗi lần. Phần tử "đúng toạ độ nhưng không ăn" → thử `dispatchEvent(new MouseEvent('click',{bubbles:true}))`.
- **`scrollIntoView` từng dòng trước khi đọc toạ độ**; scope click trong `.modal` khi có nút trùng chữ; scope hàng chặt.
- Ô Tìm kiếm chỉ khớp **1 từ đơn** → gõ tên riêng cuối, xoá sạch (Ctrl+A, Backspace) trước mỗi lần gõ.
- **Đừng kết luận "không có dữ liệu/không có nút" khi mới đọc TAB MẶC ĐỊNH** — kiểm tra đủ các tab con.
- Bảng phân trang: đổi page-size "Tất cả" trước khi đếm/đối chiếu. Checkbox ẩn: bấm `<label>` bọc ngoài.

## 3. Quy trình AI Testing

```
Ticket Update (khối QC điền ở Phần 1)
   ▼
Đọc Requirement → Xác định Module → Đọc Workflow (<AI TESTING>\WORKFLOW\<Module>.md)
   ▼
Đọc File Change & Source Code (Read Only)
   ▼
Đối chiếu Workflow ↔ Code, phát hiện Rule mới/đổi
   ▼
⚠️ Cảnh báo QC & Danh sách Đề xuất Cập nhật Workflow
   ▼
Impact Matrix & Regression Area
   ▼
Sinh Test Scenario ................... [Chế độ 1]  → QC Review
   ▼
Sinh Test Case ra Sheet .............. [Chế độ 2]  → QC Review
   ▼
AI Testing ........................... [Chế độ 3]
   ▼
Pass hết → Test Report (theo AI_Test_Report_Guide.md) → QC Review
Có Fail  → Bug Report (cột Note + file bug) → trả QC/Dev
```

## 4. Prompt cho AI

**ROLE:** Bạn là Senior Software Tester của Fastdo.

**OBJECTIVE:** Phân tích Ticket Update, truy vết tài liệu Workflow tương ứng theo Module của Ticket, đối chiếu toàn bộ quy tắc nghiệp vụ để sinh đầy đủ Test Case theo đúng Template Checklist của Fastdo, đảm bảo cover 100% trường hợp. Nếu Code có Rule thay đổi hoặc tính năng mới chưa có trong Workflow, phải cảnh báo và xuất danh sách đề xuất cập nhật Workflow cho QC.

**INPUT:** lấy từ khối QC điền ở Phần 1 (mục 🔴 thiếu → hỏi lại QC) + tài khoản cố định/Catbox/link Sheet mặc định ở `QC_Dau_Vao.md` mục 1. `Workflow Directory` luôn là `<AI TESTING>\WORKFLOW\`.

### Bước 1: Đọc Requirement & tóm tắt chức năng mới
Đọc Requirement; tóm tắt chức năng mới/được cập nhật.

### Bước 2: Đọc Workflow Module
- Đọc `<AI TESTING>\WORKFLOW\<Module>.md`; nếu tên file không khớp 100%, quét danh sách file trong `WORKFLOW` để chọn đúng file.
- Trích xuất Rules hệ thống, dữ liệu đầu vào/đơn từ, chức năng chính & UI/Repo liên quan.
- Đánh dấu Section/Rule liên quan trực tiếp và gián tiếp đến Requirement.

### Bước 3: Đọc File Change & Source Code
Xác định: Module bị ảnh hưởng, Class/API/Database/UI thay đổi.

### Bước 4: Phân tích Business Logic & phát hiện cập nhật Workflow
Phân tích Business Logic, Input/Output/Validation, Permission/Workflow phê duyệt. **Đối chiếu logic code với từng quy tắc Workflow.** Nếu phát hiện Rule thay đổi hoặc tính năng mới CHƯA CÓ hoặc KHÁC Workflow → tạo mục **`⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT TÀI LIỆU WORKFLOW`** nêu rõ: (1) tên Rule/Tính năng, (2) file Source Code & vị trí hàm (đã Grep/Glob xác nhận tồn tại), (3) Section cần chèn/sửa trong `WORKFLOW/<Module>.md`.

### Bước 5: Regression Area & Impact Matrix
Phân tích ảnh hưởng lan truyền theo liên kết trong Workflow (VD fCheckin: Quy định OT 1.3 → Đơn OT 2.3 → Bảng công 3.1 → fPayroll; GPS/Wifi 1.2 → Nhật ký thiết bị 2.4 → Thống kê 3.1.4).

### Bước 6: Sinh Test Scenario (bao phủ 100% Workflow & Rule mới)
Tối thiểu các loại: Happy, Validation, Boundary, Negative, Business Rule (kể cả Rule mới phát hiện), Permission, Exception, Regression, Compatibility (nếu có), Database (nếu có), API (nếu có). Chỉ sinh nhóm áp dụng được cho ticket — nhóm bỏ qua phải ghi lý do (tránh case thừa).

### Bước 7: Sinh Test Case theo Template Checklist Fastdo
Căn cứ `Template Checklist .xlsx` và [`AI_Template_Testcase_Guide.md`](./AI_Template_Testcase_Guide.md): không đổi cấu trúc, không thêm/xoá cột, không đổi công thức. Mọi Test Case tuân thủ mục **2b.B**. Mỗi Requirement mới/đổi có ≥ 1 case; mỗi Rule Workflow bị ảnh hưởng gián tiếp có ≥ 1 Regression Case. Rule chỉ có trong spec mà code chưa có → mục 2b.A (1 case `Khẩn cấp`).

- **Test ID:** `TK<TicketID>_<Running Number>` (VD `TK800_001`).
- **Screenshot:** `<TC_ID>_<Function>.png` (VD `TK800_001_CreateLeave.png`).

## 5. Output (AI xuất đầy đủ theo chế độ QC chọn)

✅ Workflow File Analyzed · ✅ `⚠️ CẢNH BÁO & ĐỀ XUẤT CẬP NHẬT WORKFLOW` · ✅ Module & Feature bị ảnh hưởng · ✅ Business Logic Summary & Rule Mapping (Requirement ↔ Workflow) · ✅ Regression Area & Impact Matrix · ✅ Test Scenario · ✅ Checklist/Test Case đầy đủ (đã ghi vào Sheet) · ✅ Screenshot List · ✅ Test Summary · ✅ Bug Report (nếu có Fail) · ✅ Test Report (khi QC yêu cầu — xem `AI_Test_Report_Guide.md`).

## 6. Self-Validation (AI tự kiểm tra trước khi bàn giao)

- [ ] Đã đọc đúng file Workflow của từng module liên quan và đối chiếu 100% Rule liên quan Ticket?
- [ ] Đã kiểm tra Code có Rule mới / Tính năng mới cần đề xuất cập nhật Workflow?
- [ ] Cover đầy đủ Requirement; không trùng Test Case; có Regression cho module liên quan?
- [ ] Có Happy / Validation / Business Rule / Edge / Exception (hoặc ghi lý do bỏ nhóm)?
- [ ] ID không trùng, ghi đúng dòng trống, đúng nhóm cột `TEST LẦN N`, đã đọc lại Sheet sau khi ghi?
- [ ] Tuyệt đối KHÔNG sửa/mutate source code (Read Only)?

## 7. QC Review (QC làm — AI chỉ chờ)

QC review Test Scenario/Test Case, **xem danh sách Cảnh báo & Đề xuất Cập nhật Workflow để tự cập nhật file Workflow `.md`**, chỉnh sửa nếu cần, xác nhận Checklist.

---

## 8. Ghi chú theo module (AI tự đọc phần của module trong ticket)

## 8.1. fEvaluation (Đánh giá nhân sự)
```
Đọc WORKFLOW/fEvaluation - V1.md (hoặc fEvaluation-Huy.md nếu QC chỉ định).
Phạm vi hay bị ảnh hưởng: Kho tiêu chí → Mẫu đánh giá (Draft/Active/Ngừng) → Kỳ đánh giá (Draft/Open/Closed, Bước 1-3: cấu hình / người tham gia / rà soát reviewer) → Phiếu (Tự đánh giá/Reviewer/Đã gửi/Trả lại) → Kết quả/Dashboard.
- Điều kiện testcase nêu trạng thái Mẫu/Kỳ, thang điểm, số nhân sự + quan hệ quản lý trực tiếp (rule tự xác định reviewer cần có quan hệ này).
- Tìm người: gõ 1 từ (tên riêng). Ô tìm kiếm dashboard đã ghi nhận lỗi lọc theo tên — kiểm tra lại, đừng suy đoán.
- Nút "Trả lại" nằm ở tab "Người tham gia" (không phải tab mặc định "Tiến độ").
- Kích hoạt/Đóng kỳ/Chỉ định lại có thể cần bấm 2–3 lần; "+ Thêm tiêu chí" cần dispatch click JS.
- Chỉ định lại reviewer: kiểm tra cả lần 1 VÀ lần ≥ 2 trong cùng phiên rà soát; rule loại trừ tự đánh giá (mục 2.3.3) — kiểm tra phạm vi áp dụng.
- Counter (Chưa xác định người đánh giá, …): quay trước/sau khi thêm/bớt nhân sự. Badge "Tự đánh giá" khi kỳ tắt tự đánh giá: đối chiếu "Đánh giá của tôi".
- Trùng tên tiêu chí ≠ cùng bản ghi: xác nhận ID. Sắp xếp thứ tự nhóm tiêu chí (1.3.3) chưa lập trình (EVAL_090) — không viết case suy đoán.
- Đối chiếu bảng "bug đã xác nhận" mục 6 của Kinh_Nghiem_Test_Tu_Dong.md để tránh báo trùng / nhận biết regression.
```

## 8.2. fCheckin (Chấm công)
```
Đọc WORKFLOW/fCheckin.md.
Chuỗi ảnh hưởng: Quy định (vị trí GPS/Wifi 1.2, OT 1.3, ca, hệ số công) → Đơn từ (phép, OT, giải trình 2.x) → Nhật ký thiết bị (2.4) → Bảng công/Thống kê (3.1.x) → fPayroll.
- Boundary Case ở cả 2 phía biên: khoảng cách GPS (mét), phút OT tối thiểu/tối đa, ngày phép.
- Cần ≥ 2 tài khoản (người tạo đơn + người duyệt) → dùng tài khoản thứ 2 QC cung cấp; quay cả 2 phía nếu case là thông báo/duyệt.
- GPS/Wifi/thiết bị thật không giả lập được trên web desktop → ghi rõ phần "cần QC test tay trên mobile", không PASS suông.
- Case phụ thuộc ngày/giờ: nêu rõ ngày giả định ở Điều kiện, tránh case chỉ đúng vào đúng ngày chạy.
- Date-picker/lịch: không điều hướng được sang tháng khác (Rules_Skill D.2) → chọn dữ liệu trong tháng hiện tại hoặc ghi "cần QC test tay".
- Coverage đặc thù cần cân nhắc: Overnight Shift, Cross Month, Multi Shift, Payroll Impact.
```

## 8.3. fProfile (Hồ sơ nhân sự)
```
Đọc WORKFLOW/fProfile.md.
Chuỗi ảnh hưởng: Hồ sơ/Cơ cấu tổ chức/Quản lý trực tiếp → các module dùng dữ liệu nhân sự (fEvaluation: reviewer & bộ lọc phòng ban; fCheckin: người duyệt).
- Mọi thay đổi phòng ban/quản lý trực tiếp: sinh Regression Case sang fEvaluation (danh sách người tham gia, rule reviewer) và fCheckin (người duyệt đơn).
- Test bộ lọc/danh sách: bước 1 ghi nhận danh sách gốc ở trang quản lý nhân sự, bước sau mới lọc và đối chiếu đúng người + đúng số lượng.
- Validate trường (họ tên, email, SĐT, ngày sinh, CCCD…): so khớp không phân biệt hoa/thường (header có thể hiển thị IN HOA).
- Phân quyền: Admin / HR / Quản lý phòng ban / Nhân viên — mỗi vai trò 1 case riêng.
- Dữ liệu cá nhân: dùng nhân sự test của tổ chức test, không ghi thông tin nhạy cảm vào Sheet/ảnh.
```

## 8.4. Module khác (chưa có WORKFLOW)
```
Chưa có WORKFLOW/<Module>.md → dừng, báo QC (không suy đoán nghiệp vụ). Nếu QC yêu cầu tiếp tục: dựa vào Requirement + code đọc thật, đánh dấu mọi rule là "chưa có trong Workflow", và đưa toàn bộ vào ⚠️ ĐỀ XUẤT CẬP NHẬT WORKFLOW.
Áp dụng đầy đủ 2b (A–D) và các lưu ý chung: Boundary 2 phía, ≥ 2 tài khoản khi có phía người nhận/người duyệt, dữ liệu cá nhân không đưa vào Sheet/ảnh.
```
