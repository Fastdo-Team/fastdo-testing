# Kinh nghiệm test tự động fEvaluation — Tổng hợp

Tài liệu này gom lại toàn bộ kinh nghiệm, quy tắc và lỗi đã gặp trong quá trình test tự động module Đánh giá nhân sự (fEvaluation) bằng Puppeteer, để AI (hoặc người) làm việc sau này không phải học lại từ đầu.

> Đây là bản đúc kết thực chiến — mọi điều ghi ở đây đều đã xảy ra thật trong quá trình test, không phải suy đoán lý thuyết. Tài liệu gốc, chi tiết hơn: [`Rules_Skill.md`](./Rules_Skill.md) (quy tắc bắt buộc), [`QC_Dau_Vao.md`](./QC_Dau_Vao.md) (thông tin môi trường), [`WORKFLOW/fEvaluation.md`](./WORKFLOW/fEvaluation.md) (đặc tả nghiệp vụ).

---

## 1. Trước khi bắt đầu — 2 cổng bắt buộc (xem `CLAUDE.md`)

- **Cổng 1** (trước khi viết testcase mới): đọc `WORKFLOW/<module>.md` đúng module đang test + `Rules_Skill.md` mục C.6, B.4/B.5.
- **Cổng 2** (trước khi chạy bất kỳ lần test nào): đọc `QC_Dau_Vao.md` + `Rules_Skill.md` phần B, C.3–C.5.
- Tên file trong `WORKFLOW/*.md` là **thiết kế dự kiến**, không phải bằng chứng đã lập trình — phải tự Grep/Glob xác nhận file đó tồn tại thật trong source code trước khi trích dẫn làm bằng chứng.

## 2. Nguyên tắc trung thực (quan trọng nhất)

- **Không bao giờ claim PASS khi chưa xác nhận qua ảnh chụp/DOM thật.** Panel tóm tắt trên UI có thể là bug hiển thị, không phản ánh đúng dữ liệu thật.
- **Tiền đề phải được xác minh trực quan** — nếu testcase giả định "phòng ban X rỗng", "mẫu Y đang Active"... phải tự vào đúng trang quản trị/cài đặt để THẤY bằng mắt (chụp ảnh) trạng thái đó trước khi test, không suy đoán/tin theo mô tả suông.
- **Nếu phải dùng workaround để né 1 bug khác mới tới được bước cần test → đánh FAIL cho cả case đó**, không phải PASS, dù phần rule cụ thể đang test vẫn đúng. Ví dụ: case cần "Chỉ định lại" hoạt động bình thường nhưng phải né bug khác mới chỉ định được → case đó tính là FAIL, có ghi chú rõ nguyên nhân.
- **Đọc lại sau khi ghi Sheet** để xác nhận đã lưu đúng, không tin ngay theo việc "đã bấm nút".
- **So khớp chuỗi tiếng Việt PHẢI không phân biệt hoa/thường** (`.toUpperCase()` cả 2 vế trước khi so sánh) — đã gặp thật nhiều lần: header hiển thị "PHẠM CÔNG NAM" viết hoa toàn bộ trong khi hằng số lưu "Phạm Công Nam", so sánh phân biệt hoa/thường gây báo sai (false negative) case đang PASS thành FAIL.
- **"Trông giống bug" chưa phải là bug** — phải xác nhận đúng bản chất (identity) trước khi kết luận, không chỉ dựa vào tên hiển thị giống nhau. Ví dụ: Kho tiêu chí có thể có 2 bản ghi khác nhau (khác ID) nhưng trùng tên hiển thị — nhầm 2 cái này là "chọn lại đúng 1 tiêu chí" sẽ ra kết luận sai hoàn toàn.

## 3. Quay video — quy tắc bắt buộc

- **Luôn quay tới khi có kết quả cuối cùng rõ ràng rồi mới dừng** — không dừng quay giữa lúc trang còn đang tải/chuyển cảnh. Trước khi gọi `recorder.stop()`, chờ thêm ~1.5s và chụp 1 ảnh xác nhận trạng thái cuối (`_shared.js` đã có sẵn cơ chế này trong `runCase`).
- **Luôn dùng con trỏ ảo (virtual cursor)** cho MỌI thao tác click — dùng `ctx.slowClickXY`/`ctx.safeClick`, **không bao giờ tự viết hàm click riêng** (VD `page.mouse.move/down/up` viết tay) vì sẽ thiếu bước gọi `moveCursor()`, khiến video không hiện con trỏ đỏ.
- **Tốc độ vừa phải, không quá nhanh** — `slowClickXY`/`safeClick` đã có sẵn khoảng dừng ~450ms trước khi click thật + ~250-350ms sau, để người xem kịp thấy điểm sắp bấm.
- **Nếu testcase liên quan tới đối chiếu số liệu/trạng thái (VD Counter card, bộ đếm)**: phải quay CẢ quá trình thay đổi số liệu thật (trước/sau 1 hành động cụ thể), không chỉ chụp 1 ảnh số liệu tĩnh — số tĩnh không chứng minh được cơ chế đang hoạt động đúng hay chỉ là giá trị mặc định/hard-code.
- **Nếu tiền đề phụ thuộc trạng thái "chưa làm gì" của 1 bên (VD nhân viên chưa chấm)**: phải quay PHẦN CHỨNG MINH TRẠNG THÁI ĐÓ trước, rồi mới chuyển sang thao tác chính — đúng thứ tự để bằng chứng đầy đủ, không chỉ khẳng định bằng chữ.

## 4. Viết nội dung testcase & kết quả

- **QUAN TRỌNG — Không áp đặt định kiến lỗi vào Tiêu đề và Các bước khi mới viết testcase (Chưa test thì KHÔNG ĐƯỢC kết luận là lỗi)**:
  - **Tình huống thực tế (bài học `EVAL_V1_078` đến `EVAL_V1_208`)**: Khi mới viết testcase (chưa test thực tế), người viết đã đặt tiêu đề *"Kiểm tra lỗi giao diện: Bộ đếm Chưa xác định người đánh giá ở Bước 2 hiển thị 0 sau khi thêm nhân sự..."* và trong các bước ghi *"thấy số 0"*. Đây là sai lầm phương pháp — chưa chạy test thực tế thì không thể biết trước hệ thống có lỗi giao diện hay không.
  - **Quy tắc**: Các testcase cũ hoặc ghi chú lỗi cũ chỉ mang tính chất **tham khảo**. Tuyệt đối không dựa vào testcase cũ để suy đoán hệ thống hiện tại chắc chắn bị lỗi giống hệt.
  - **Cách đặt Tiêu đề (Cột C)**: Phải viết hoàn toàn **khách quan, trung lập**, phản ánh mục tiêu kiểm tra chức năng hoặc xác thực nghiệp vụ (VD: *"Kiểm tra hiển thị và cập nhật tức thời của bộ đếm 'Chưa xác định người đánh giá' tại Bước 2 khi thêm người tham gia"*). Tuyệt đối KHÔNG dùng các từ định kiến lỗi như: *"Kiểm tra lỗi giao diện...", "Kiểm tra lỗi tồn đọng...", "Bug UI...", "Bị cắt/bị che...", "Hiển thị sai..."*.
  - **Cách viết Các bước & Kết quả**: Trong các bước thực hiện, chỉ hướng dẫn thao tác và quan sát khách quan (VD: *"Quan sát giá trị hiển thị của bộ đếm 'Chưa xác định người đánh giá'"*, KHÔNG viết *"thấy số 0"* hay *"thấy không hiển thị"*). Tiêu chuẩn đúng/sai được nêu rõ ràng ở phần **Kết quả mong đợi**.
- **Bổ sung cụ thể dữ liệu đầu vào trong phần "Điều kiện" để AI biết tạo dữ liệu (seed data) & quay video**:
  - Khi viết testcase, phần `Điều kiện:` không được viết chung chung (như *"Đã có dữ liệu kỳ"*), mà **bắt buộc phải mô tả chi tiết tất cả các dữ liệu cần chuẩn bị trước**:
    1. **Tài khoản / Vai trò**: Quản trị viên, HR, Quản lý phòng ban, hay Nhân viên.
    2. **Đối tượng & Trạng thái**: Mẫu đánh giá (Active/Draft), Kỳ đánh giá (Draft/Open/Closed), Thang điểm, Tiêu chí...
    3. **Số lượng bản ghi & Mối quan hệ liên kết/ràng buộc**: Ví dụ cần 3 nhân sự thuộc phòng ban chưa có quản lý trực tiếp; 1 tiêu chí được Active Template tham chiếu để tạo khóa ràng buộc; danh sách ≥ 15 dòng để kích hoạt phân trang/cuộn dọc...
  - **Mục đích**: Để AI Automation khi đọc testcase biết chính xác cần khởi tạo (seed data) những bản ghi nào trong hệ thống trước khi bắt đầu, và biết phải điều hướng quay video / chụp ảnh màn hình phần chuẩn bị và xác minh dữ liệu tiền đề đó làm bằng chứng trực quan hoàn chỉnh.
- **Testcase mới**: trình bày theo khối "CÁC BƯỚC THỰC HIỆN" (danh sách đánh số, mỗi bước 1 hành động cụ thể) + khối riêng "KẾT QUẢ MONG ĐỢI" bên dưới (cách 1 dòng trống) — không viết văn xuôi gộp kiểu "Điều kiện... Các bước... Kết quả...".
- **Phải ghi rõ điều kiện đầu vào VÀ bước kiểm tra/xác nhận điều kiện đó trước khi vào bước thao tác chính** — không được nhảy thẳng vào hành động chính rồi mới xác nhận tiền đề bằng miệng. Cột Mô tả phải liệt kê cụ thể: cần vào đâu để kiểm tra, kiểm tra cái gì, đối chiếu với cái gì — không chỉ viết chung chung "Điều kiện: đã có dữ liệu X" rồi bỏ qua.
  - **Ví dụ — test Bộ lọc phòng ban**: KHÔNG viết bước 1 là "Chọn phòng ban X trong bộ lọc" ngay. Phải có bước trước đó: vào Cài đặt/Cơ cấu tổ chức (hoặc trang quản lý nhân sự) để xem và ghi nhận lại **danh sách nhân sự thực tế đang thuộc phòng ban X** — rồi bước sau mới áp bộ lọc phòng ban X trên màn hình đích và **đối chiếu 2 danh sách có khớp/đồng nhất không** (đúng người, đúng số lượng, không thiếu/thừa).
  - Lý do bắt buộc: nếu bỏ qua bước xác nhận trước, không có gì để đối chiếu khi bộ lọc trả về kết quả — dễ báo PASS nhầm khi bộ lọc ra đúng SỐ LƯỢNG nhưng SAI NGƯỜI (hoặc ngược lại, đúng người nhưng thiếu/dư 1 người mà không nhận ra vì không có danh sách gốc để so).
- **Kết quả thực hiện (viết vào Sheet)**: ngắn gọn, ~2-3 câu, nhưng vẫn phải tự đủ nghĩa để đọc hiểu không cần xem lại testcase gốc — gồm: tiền đề đã dựng, hành động đã làm, kết quả quan sát được, cách đã xác minh. Không viết dài dòng kể lại từng bước nhỏ (những cái đó để trong log/DEV note).
- **Không dùng thuật ngữ kỹ thuật/dữ liệu thô** trong cột kết quả — viết bằng tiếng Việt thường ngày, mô tả những gì thấy trên màn hình. Không dán JSON/object thô (VD `{"person":"...","countBefore":"0"}`) vào ô kết quả.
- Nếu phát hiện bug thật → đánh dấu cột **Ưu tiên** (Quan trọng/Khẩn cấp tuỳ mức độ chặn).
- Case cần test nhiều lần → ghi vào đúng khối cột "TEST LẦN N" tiếp theo (không đè lên lần trước) — xác định đúng cột bằng cách đọc dòng tiêu đề gộp, không hard-code.

## 4b. Môi trường chạy script — `node_modules` không nằm trong `AI TESTING/`

- Chạy trực tiếp `node evalXXX_test.js` từ thư mục `Automation Scripts/` sẽ báo lỗi `Cannot find module 'puppeteer-core'` — `node_modules` thật sự nằm ở dự án khác (`Test-automation/node_modules`, thư mục làm việc phụ), không nằm trong cây `AI TESTING/` hay bất kỳ thư mục cha nào của nó, nên Node không tự resolve được theo cơ chế tìm ngược thư mục cha thông thường.
- **Cách chạy đúng**: đặt biến môi trường `NODE_PATH` trỏ tới `node_modules` đó trước khi chạy, VD (Git Bash):
  ```
  NODE_PATH="<đường dẫn tuyệt đối tới Test-automation>/node_modules" node evalXXX_test.js
  ```
  Tự xác định đường dẫn thật trên máy đang chạy (đừng hardcode) bằng cách tìm thư mục có `node_modules/puppeteer-core` gần `AI TESTING/` nhất.

## 5. Kỹ thuật Puppeteer đã kiểm chứng — nên dùng

- **`waitForRealContent(page, opts)`** (trong `_shared.js`): thay cho việc chờ timeout cố định rồi đọc DOM ngay. App Blazor Server hay bị kẹt ở "Đang tải dữ liệu"/trắng trang sau `goto()`/`reload()` — hàm này tự retry kèm reload nếu cần. Dùng ở MỌI điểm điều hướng, không chỉ bước cuối.
- **Real mouse click (`page.mouse.move/down/up`), không dùng `.click()` qua JS** cho hầu hết tương tác trong app Blazor — nhiều phần tử chỉ nhận sự kiện chuột thật.
- **Ngoại lệ đã xác nhận**: nút "+ Thêm tiêu chí" (`a.evaluation-add-row`) KHÔNG phản hồi với click chuột thật (kể cả `ElementHandle.click()` của Puppeteer đã xác nhận đúng toạ độ qua `elementFromPoint`) — chỉ phản hồi khi dispatch `MouseEvent('click', {bubbles:true})` bằng JS trực tiếp. Nếu 1 phần tử "trông đúng toạ độ nhưng bấm không ăn", thử cách này trước khi kết luận là bug.
- **Blazor "first click chỉ đổi active state, không điều hướng"** — nhiều nút (mở Mẫu gốc, Đóng kỳ, dòng danh sách...) cần bấm 2-3 lần mới thực sự chuyển trang/mở dialog. Luôn viết vòng lặp thử lại (2-4 lần), kiểm tra kết quả thật (URL đổi/dialog mở) sau mỗi lần, không tin lần bấm đầu.
- **Tìm kiếm không dấu/không phân biệt kiểu chữ**: ô "Tìm kiếm..." trong toàn bộ module chỉ khớp được **1 từ đơn**, KHÔNG khớp được cụm nhiều từ (VD gõ "Hưng" ra kết quả, gõ "Nguyễn Hữu Hưng" thì KHÔNG). Đây từng bị hiểu nhầm là "search hoàn toàn không phản hồi" — thực ra chỉ lỗi với chuỗi nhiều từ. **Luôn gõ 1 từ trong tên (thường là tên riêng ở cuối) khi cần tìm người**, không gõ cả họ tên.
- **Luôn xoá sạch ô tìm kiếm trước khi gõ từ khoá mới** (Ctrl+A rồi Backspace) nếu tái sử dụng cùng 1 input nhiều lần trong 1 script — gõ nối đuôi vào text cũ (VD "GiangNam") sẽ khiến tìm sai.
- **Bảng có phân trang** (VD danh sách Mẫu đánh giá): đọc `document.querySelectorAll('table tr')` chỉ lấy được trang hiện tại. Phải chuyển page-size sang "Tất cả" trước khi đọc nếu cần danh sách đầy đủ để đối chiếu/đếm.
- **Có nhiều phần tử trùng chữ trên cùng 1 trang** (VD nút "Hủy đánh giá" xuất hiện cả ở dòng danh sách lẫn bên trong dialog xác nhận) — nếu không giới hạn phạm vi tìm kiếm vào đúng `.modal`, dễ bấm nhầm phần tử bị modal che (không có tác dụng) thay vì nút xác nhận thật.
- **Case-sensitive/tọa độ ngoài viewport**: khi 1 phần tử nằm ở cuối trang (VD "+ Thêm nhóm"), phải `scrollIntoView` rồi mới đọc toạ độ để bấm — đọc toạ độ trước khi cuộn có thể "hợp lệ về số học" nhưng click ngoài viewport thật sẽ không trúng gì.
- **Checkbox ẩn dưới toggle tuỳ chỉnh**: input gốc có thể có `getBoundingClientRect()` rỗng — phải bấm vào `<label>` bọc ngoài, không phải input.
- **Xác định phần tử theo hàng (row) phải scope chặt** — dùng `row.textContent.includes(name)` một mình dễ khớp nhầm hàng khác chứa tên tương tự (VD "Hoàng Lệ Giang" vs "Hoàng Giang") hoặc container quá rộng. Nên kết hợp thêm điều kiện loại trừ và giới hạn độ dài text của hàng.
- **Bảng dài sau khi chuyển page-size "Tất cả": PHẢI `scrollIntoView` từng dòng trước khi đọc toạ độ, kể cả khi lặp qua bằng index trong vòng `for`** — không chỉ áp dụng cho 1 phần tử cố định ở cuối trang. Đã gặp thật (EVAL_104, script quét 33 Kỳ đánh giá): các dòng #0-12 nằm sẵn trong viewport nên bấm đúng, nhưng từ dòng #13 trở đi (ngoài khung nhìn) `getBoundingClientRect()` vẫn trả toạ độ "hợp lệ về số học" khiến `safeClick` bấm hụt vào khoảng trống mà KHÔNG báo lỗi gì — im lặng coi như "click thành công" rồi kết luận sai dữ liệu (tưởng không có bản ghi nào thoả điều kiện, trong khi thực ra có). Luôn tự hỏi: nếu vòng lặp có thể chạy tới hàng thứ 15-20+, đã chắc chắn mọi hàng đều được cuộn vào khung nhìn trước khi đọc `getBoundingClientRect()` chưa?
- **`page.goto()` lặp lại nhiều lần (~15-20 lần) trong CÙNG 1 script để "quay lại danh sách" sau mỗi vòng lặp có thể làm circuit SignalR của Blazor dần treo/rớt** — biểu hiện: `Attempted to use detached Frame`, trang "kẹt/trắng" dai dẳng dù đã retry. Ưu tiên tìm link điều hướng NỘI BỘ có sẵn trên trang (VD `<a href="/evaluation?tab=cycle">Quay lại danh sách</a>` — Blazor NavLink, điều hướng phía client, không reload) thay vì gọi `page.goto()` lại URL cũ nhiều lần; nhẹ hơn nhiều và không đụng tới kết nối.
- **QUAN TRỌNG — đừng đọc body text ngay ở TAB MẶC ĐỊNH rồi kết luận "không có dữ liệu/không có action"**: khi mở 1 bản ghi (VD "Xem" 1 Kỳ đánh giá), trang có thể có nhiều tab con (Tổng quan/Người tham gia/Tiến độ/Kết quả...) và tab mặc định hiển thị đầu tiên **chưa chắc là tab chứa hành động/dữ liệu cần tìm**. Đã gặp thật (EVAL_104): tab mặc định "Tiến độ" chỉ là dashboard thống kê (không có nút "Trả lại" dù phiếu đã "Đã gửi"), trong khi nút "Trả lại" thật sự nằm ở tab "Người tham gia" — khiến nhiều lần chạy kết luận SAI "DATA-BLOCKED: không có phiếu nào Đã gửi" dù dữ liệu thật có tồn tại. Trước khi kết luận "không tìm thấy X trong body text", phải tự hỏi: đã kiểm tra ĐÚNG tab/đúng khu vực UI chứa X chưa, hay chỉ mới đọc tab mặc định?

## 6. Các bug/hạn chế thật đã xác nhận trong app (để dev tham khảo)

| # | Mô tả | Mức độ |
|---|---|---|
| 1 | Tìm kiếm người (ô "Tìm theo người" — cả khi thêm người tham gia lẫn Chỉ định lại reviewer) chỉ khớp được 1 từ đơn, không khớp cụm họ tên đầy đủ nhiều từ | Khẩn cấp — đây là cách duy nhất để chỉ định thủ công người đánh giá |
| 2 | Khi Kích hoạt Mẫu bị chặn do 1 nhóm lỗi, banner đầu trang hiện đúng thông báo có nghĩa, nhưng bên trong thẻ của chính nhóm lỗi đó lại lộ thêm dòng text kỹ thuật thô "Lỗi: group.ErrorSummary" (binding chưa dịch) | Quan trọng (cosmetic nhưng khách hàng không hiểu được) |
| 3 | Thao tác "Chỉ định lại" người đánh giá: lần THỨ NHẤT trong 1 phiên rà soát luôn thành công, lần THỨ HAI trở đi (khi có ≥2 dòng "Chưa xác định" cùng lúc) luôn báo "Vui lòng chọn người đánh giá" dù đã bấm chọn đúng — kể cả sau khi refresh qua Bước 3 rồi quay lại Bước 2 | Cần dev kiểm tra — chặn hẳn việc chỉ định tay cho ≥2 người trong cùng 1 kỳ |
| 4 | Không thể tự chỉ định CHÍNH MÌNH làm reviewer cho chính mình (đúng thiết kế), NHƯNG nếu tài khoản đó cũng đang là 1 người tham gia của kỳ, hệ thống còn chặn LUÔN việc tài khoản đó làm reviewer cho NGƯỜI KHÁC trong cùng kỳ — có vẻ rule loại trừ tự đánh giá (mục 2.3.3) áp dụng sai phạm vi | Cần dev kiểm tra |
| 5 | Bảng overview kỳ vẫn hiện badge "Chưa bắt đầu" ở cột "Tự đánh giá" cho nhân viên dù kỳ đã tắt tự đánh giá và không hề có phiếu thật nào tồn tại (đã xác nhận qua kiểm tra "Đánh giá của tôi" trực tiếp — không có phiếu nào) | Cosmetic, nên đổi hiển thị thành "Không áp dụng"/gạch ngang |
| 6 | Dashboard tìm kiếm ("Tìm kiếm" ở trang tổng quan) không lọc được theo tên dù gõ đúng từ khoá | Quan trọng |
| 7 | Bấm "Kích hoạt"/"Đóng kỳ" đôi khi cần bấm 2-3 lần mới thực sự có tác dụng (lần đầu chỉ đổi active state) | Đã xác nhận là hành vi Blazor lặp lại nhiều nơi, không phải bug riêng lẻ 1 chỗ |

## 7. Những điều CẦN TRÁNH khi test (rút ra từ các lần làm sai)

- ❌ **Đừng phán xét trước là "lỗi/bug giao diện" khi mới chỉ viết testcase mà chưa chạy test thật**: Chưa test thì không thể biết chắc có lỗi hay không. Testcase cũ chỉ mang tính tham khảo, không được dựa vào đó để khẳng định lỗi và áp đặt vào tiêu đề/bước thực hiện (bài học từ `EVAL_V1_078`). Tiêu đề và các bước phải viết trung lập, khách quan.
- ❌ **Đừng viết phần "Điều kiện" sơ sài hoặc thiếu thông số dữ liệu**: Thiếu thông tin về vai trò tài khoản, trạng thái đối tượng (Active/Draft/Open/Closed), số lượng bản ghi hoặc quan hệ ràng buộc sẽ khiến AI không biết cách tạo seed data và bỏ sót việc quay video phần dựng tiền đề.
- ❌ Đừng gộp quá nhiều bước/trường thông tin vào 1 testcase — test sẽ rất lâu (nhiều phút), khó xác định đúng điểm lỗi khi fail giữa chừng. **Tách nhỏ theo từng mục cần kiểm chứng** (mỗi Counter/mỗi field/mỗi rule 1 case riêng nếu có thể).
- ❌ Đừng tự viết hàm click riêng thay vì dùng helper dùng chung — mất con trỏ ảo, mất các cơ chế chờ/thử lại đã kiểm chứng.
- ❌ Đừng tin ngay kết quả PASS/FAIL tự động khi chưa xem lại ảnh chụp — nhiều lần script tự báo sai (case-sensitive, đọc nhầm cột, panel hiển thị lỗi) mà chỉ phát hiện được khi xem ảnh thật.
- ❌ Đừng viết testcase mới/ghi dữ liệu vào 1 dòng mà không kiểm tra dòng đó đã có nội dung thật chưa — suýt ghi đè 34 testcase thật vì tưởng dòng còn trống.
- ❌ Đừng chốt kết luận "bug xác nhận" chỉ vì 2 dòng nhìn giống nhau (trùng tên) — phải xác nhận đúng bản chất/định danh trước.
- ❌ Đừng dừng quay video khi trang còn đang tải hoặc chưa ra được thao tác/kết quả cuối cùng.
- ❌ Đừng dùng workaround để né 1 bug khác rồi báo PASS cho case đang test — phải đánh FAIL và ghi rõ lý do bị chặn.
- ❌ Đừng quên đóng bớt tab/cửa sổ Chrome cũ sau mỗi lần chạy — Chrome tích luỹ nhiều tab qua 1 phiên dài dễ gây timeout/giật lag cho các lệnh chuột sau này (`mouse.move timeout`).

## 8b. Đối chiếu WORKFLOW spec vs Code thực tế — tính năng có trong tài liệu nhưng CHƯA có trong code

> Nhắc lại mục 1: tên file/mô tả trong `WORKFLOW/*.md` là **thiết kế dự kiến**, không phải bằng chứng đã lập trình. Mỗi khi phát hiện 1 mục cụ thể trong WORKFLOW được mô tả nhưng qua Grep/Glob + đọc code thật xác nhận **chưa được implement** (không có UI control, không có hàm xử lý tương ứng), ghi lại 1 dòng vào bảng dưới đây — để lần sau không mất công điều tra lại, và để tránh viết nhầm testcase suy đoán hành vi cho tính năng chưa tồn tại (xem `Rules_Skill.md` mục B.5).

**Cách xác nhận trước khi ghi vào bảng** (bắt buộc đủ 2 bước, không ghi khi chỉ mới nghi ngờ qua UI):
1. Test trực tiếp trên UI không thấy control tương ứng (hoặc mô phỏng thao tác không có tác dụng).
2. Grep/Glob tìm đúng file `.razor`/`.cs` được nêu trong WORKFLOW (hoặc file thực tế thay thế nếu tên khác), đọc toàn bộ phần liên quan, xác nhận không có hàm/handler nào xử lý hành vi đó.

| # | Mục WORKFLOW (mã số + tên) | Testcase liên quan | File code đã đọc để xác nhận | Kết luận |
|---|---|---|---|---|
| 1 | `fEvaluation.md` mục 1.3.3 "Quản lý Nhóm tiêu chí trong Mẫu" — nhánh "Sắp xếp thứ tự" | EVAL_090 | `TemplateGroupSection.razor` (không có `draggable`/nút mũi tên), `TemplateEditor.razor` (chỉ có `AddGroup()`/`RemoveGroup()`, không có `MoveGroup`/reorder), `TemplateEditorModels.cs` (`Order` chỉ gán 1 lần lúc tạo nhóm, không có logic cập nhật lại khi đổi thứ tự) | CHƯA lập trình — chỉ có ở spec, code không có cơ chế kéo-thả/nút đổi thứ tự nhóm nào |

## 8. Quy trình chuẩn 1 lần chạy test (tóm tắt)

1. Đọc đúng 2 cổng bắt buộc nếu chưa đọc trong phiên.
2. Xác nhận môi trường: Chrome debug port `9222` phản hồi (`curl http://localhost:9222/json/version`), đóng bớt tab cũ nếu quá nhiều.
3. Viết/sửa script riêng cho từng case (1 script = 1 video = 1 kết quả) trong `Automation Scripts/`.
4. Chạy, kiểm tra log + ảnh chụp cuối cùng bằng mắt trước khi tin kết luận.
5. Nếu cần đối chiếu số liệu động (Counter, trạng thái đổi theo hành động) — chủ động tạo hành động thật, chụp TRƯỚC/SAU, không chỉ 1 ảnh tĩnh.
6. Ghi vào đúng cột "TEST LẦN N" tương ứng qua `_sheet_helpers2.js` (`writeCaseResultRound`), đọc lại xác nhận đã lưu đúng.
7. Gửi video + ảnh minh chứng cho QC, dọn dẹp file tạm (script `_...js`, screenshot trung gian) sau khi xong.
