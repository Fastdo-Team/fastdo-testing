# Rules & Skill mặc định — Automation Test qua CDP (Chrome Debug)

## Mục đích

Tài liệu này là **bộ quy tắc & skill mặc định AI phải đọc và tuân thủ trước khi viết testcase mới hoặc chạy bất kỳ lần test nào** trên ứng dụng Fastdo (qua Chrome đang mở ở chế độ debug) — quay video bằng chứng, upload lên Catbox, và tự ghi kết quả vào Google Sheet, không cần QC thao tác tay từng bước.

> Thông tin đầu vào QC cần cung cấp (tài khoản, URL, tổ chức, Sheet tab...) nằm ở file riêng: [`QC_Dau_Vao.md`](./QC_Dau_Vao.md) — QC đọc file đó, AI đọc file này.

Tài liệu này song song với:
- `AI_Prompt_Template_Ticket_Update.md` / `AI_Prompt_Template_Ticket_Bug.md` — quy trình phối hợp QC/AI theo từng loại ticket (phân tích ticket → sinh testcase → thực thi → báo cáo), gồm khối prompt QC điền và các chế độ [1] [2] [3] [4].
- `AI_Template_Testcase_Guide.md` — cấu trúc file Testcase/Checklist (`Template Checklist .xlsx`).
- `AI_Test_Report_Guide.md` — cấu trúc Test Report.
- `WORKFLOW/*.md` (VD `fEvaluation.md`, `fCheckin.md`, `fProfile.md`) — đặc tả nghiệp vụ theo module, chứa các mã rule (BR-xxx, D-xxx) và số mục (VD 1.3.7, 4.2.1) mà testcase/bug phải trích dẫn khi tham chiếu. **Bắt buộc đọc đúng file WORKFLOW của module đang test trước khi viết testcase mới** — xem mục C.6.

Tài liệu này chỉ tập trung vào phần: **thực thi kiểm thử tự động qua trình duyệt thật + ghi bằng chứng**.

## Mục lục — 3 phần

| Phần | Nội dung |
|---|---|
| **[B. YÊU CẦU BẮT BUỘC](#phần-b--yêu-cầu-bắt-buộc-không-được-vi-phạm)** | Các nguyên tắc "phải làm / không được làm", áp dụng cho mọi lần chạy |
| **[C. SKILL KỸ THUẬT MẶC ĐỊNH](#phần-c--skill-kỹ-thuật-mặc-định-quy-trình-thực-thi)** | Quy trình/kỹ thuật thực thi chi tiết (kết nối, quay video, upload, ghi Sheet, viết script, viết testcase) |
| **[D. THAM KHẢO](#phần-d--tham-khảo-vấn-đề-đã-gặp--giới-hạn-hiện-tại)** | Lỗi/vấn đề đã từng gặp và cách xử lý, giới hạn hiện tại chưa giải quyết được |

---

# PHẦN B — YÊU CẦU BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM)

> Nhóm này gom lại **toàn bộ nguyên tắc "phải làm / không được làm"** áp dụng cho mọi lần chạy, bất kể testcase cụ thể là gì. Đọc phần này trước khi bắt đầu bất kỳ phiên làm việc nào — vi phạm 1 trong các mục dưới đây là lỗi nghiêm trọng, không phải tiểu tiết.

## B.1. Trung thực khi báo cáo kết quả

1. **Không bao giờ báo PASS nếu chưa thực sự xác nhận được qua DOM/giá trị thật** (không suy đoán, không dùng kết quả tự động hoá bị lỗi làm bằng chứng).
2. Nếu 1 bước tự động hoá thất bại (không mở được form, không set được giá trị...) → viết rõ **"cần QC kiểm tra thủ công lại"**, kèm lý do kỹ thuật ngắn gọn. Không viết ghi chú mơ hồ khiến người đọc tưởng đã test xong.
3. Nếu phát hiện mình vừa ghi sai/ghi nhầm dữ liệu rác vào Sheet → **đọc lại giá trị cũ, revert về đúng nội dung gốc**, rồi ghi lại đúng. Không để lại rác trong lịch sử Sheet.
4. Nếu 1 hành động tự động hoá vô tình làm thay đổi trạng thái dữ liệu ngoài ý muốn (VD: kích hoạt nhầm 1 Mẫu đánh giá vì rule chặn không hoạt động) → ghi nhận đúng sự thật đó vào ghi chú, không che giấu, không tự ý hoàn tác nếu việc hoàn tác có thể gây thêm rủi ro.
5. Mỗi ghi chú retest nên có định dạng thống nhất:
   ```
   [Retest YYYY-MM-DD qua CDP trình duyệt thật]: <mô tả ngắn gọn thao tác + kết quả thật quan sát được>
   - Video Test Record: https://files.catbox.moe/xxxxxx.mp4
   ```

## B.2. Ghi Google Sheet — chỉ qua `jwt_sheets.js`, không mô phỏng thao tác UI

- **Luôn ghi Sheet qua Service Account (`jwt_sheets.js`, chi tiết ở mục C.3.5)** — không mô phỏng thao tác chuột/bàn phím trực tiếp trên giao diện Google Sheets. Google Sheets vẽ lưới ô bằng canvas, không phải DOM thường — rất dễ gặp tình trạng: click/gõ "trông như" thành công (giá trị hiện ra ngay trên màn hình) nhưng **không thực sự lưu lên server**, chỉ phát hiện ra khi tải lại trang. Nếu vì lý do nào đó bắt buộc phải thao tác qua giao diện, **bắt buộc tải lại trang và đọc lại giá trị ô đã sửa** trước khi báo đã ghi xong.
- **Nếu 1 testcase được test lại nhiều lần (lần 2, 3, 4...), KHÔNG được nối chuỗi "[Retest ...]" vào chung 1 ô Kết quả thực hiện của lần đầu.** Nhiều sheet checklist của Fastdo đã có sẵn cấu trúc cột lặp lại theo nhóm **TEST LẦN 1 / TEST LẦN 2 / TEST LẦN 3...** (mỗi nhóm gồm các cột Ưu tiên/Môi trường/Trạng thái/Kết quả thực hiện — ở `Template Checklist .xlsx` hàng tuần cột này tên là `Note`/DEV NOTE/Test Date riêng) — mỗi lần test mới phải ghi vào đúng nhóm cột của lần đó, không đè/nối vào lần trước. Chi tiết cách dò và ghi đúng nhóm cột → xem mục C.3.6.
  - **Vì sao bắt buộc phải tách riêng**: từng gặp thực tế trong dự án fEvaluation — nhiều testcase bị dồn chung "lần 1 + lần 2 + lần 3" vào 1 ô, khiến (a) không phân biệt được đâu là kết quả gốc/đâu là kết quả retest, (b) 1 video của lần chạy gốc bị dán lặp lại làm "bằng chứng" cho nhiều lần retest sau đó dù retest đó không hề tạo video mới (thậm chí retest đã thất bại), và (c) cột Trạng thái bị "đóng băng" ở giá trị của lần đầu tiên — dù ghi chú retest sau đó thừa nhận chưa xác nhận lại được, Trạng thái vẫn hiển thị DONE vì không ai cập nhật cột Trạng thái riêng cho lần retest đó.
- **Luôn đọc giá trị cũ trước khi ghi vào cùng 1 ô** (không áp dụng cho việc thêm 1 lần test mới — lần test mới ghi vào cột riêng như trên, không cần đọc giá trị cũ của ô đó vì nó phải đang trống). Chỉ áp dụng append-không-ghi-đè khi thực sự ghi tiếp vào **cùng 1 ô** (VD do bị gọi 2 lần cho cùng 1 lần test).
- **Sau khi ghi xong, đọc lại (`readSheetCell`) ngay** để xác nhận giá trị đã thực sự lưu đúng như ý — không chỉ tin vào việc lệnh `updateSheetCell` không báo lỗi (API có thể trả về thành công nhưng giá trị ghi sai định dạng/sai range do lỗi logic trong script).

## B.3. Giá trị dropdown — không đoán, không dùng mẫu cố định, luôn đọc từ Sheet thật

Mỗi QC/mỗi dự án có thể dùng 1 mẫu Sheet checklist khác nhau (khác tên cột, khác danh sách giá trị dropdown, khác cả ngôn ngữ Việt/Anh). **Không quy định sẵn 1 bảng giá trị cố định dùng chung cho mọi nơi** trong tài liệu này — làm vậy sẽ sai ngay khi đổi sang Sheet của QC khác.

1. **Trước khi ghi bất kỳ giá trị nào vào cột có dropdown**, đọc Data Validation thật của đúng cột đó trên đúng Sheet/tab đang dùng — qua Sheets API (`spreadsheets.get` kèm `fields=sheets.data.rowData.values.dataValidation`) hoặc nếu có sẵn file `.xlsx` gốc thì dùng `openpyxl` đọc `ws.data_validations.dataValidation`. Không suy đoán dựa trên tên cột hay dựa trên lần làm việc trước với Sheet khác.
2. Nếu không chắc Sheet hiện tại có Data Validation hay không / không đọc được, **hỏi lại QC** xin xác nhận danh sách giá trị hợp lệ của các cột liên quan trước khi ghi, thay vì tự bịa hoặc tự suy ra từ ngữ cảnh.
3. Việc dò/xác nhận này chỉ cần làm **1 lần cho mỗi Sheet mới** (không phải mỗi lần ghi 1 ô) — sau khi đã xác nhận đúng cho Sheet đang dùng trong phiên làm việc, có thể dùng lại kết quả đó cho các lần ghi tiếp theo cùng Sheet, cùng phiên.
4. Các lỗi thường gặp cần đặc biệt cẩn thận vì rất dễ đoán sai nếu không tra: khác biệt hoa/thường (VD `Done` vs `DONE`), tên viết tắt/đầy đủ khác nhau (VD `Local` vs `Localhost`), và ngôn ngữ Việt/Anh khác nhau cho cùng 1 khái niệm (VD mức độ ưu tiên có thể là tiếng Việt `Thấp/Trung bình/...` ở Sheet này nhưng tiếng Anh `Low/Medium/...` ở Sheet khác).

## B.4. Bằng chứng — phân biệt rõ 3 loại, không lẫn lộn

Mỗi testcase khi ghi "Kết quả thực hiện" phải nêu rõ **loại bằng chứng** đứng sau kết luận PASS/FAIL:

1. **Test trực tiếp trên UI (qua CDP/trình duyệt thật)** — bằng chứng là video Catbox + log/DOM đọc được lúc chạy. Mức tin cậy cao nhất, dùng khi tính năng đã hoạt động được trên môi trường test.
2. **Xác nhận qua đọc code** — chỉ dùng khi **không thể** test trực tiếp (tính năng chưa hoàn thiện, thiếu dữ liệu test, bug chặn luồng...). Ghi rõ "XÁC NHẬN QUA ĐỌC CODE" ở đầu kết quả, và **bắt buộc**:
   - Nêu đường dẫn file thật đã đọc (VD `Entities/ReviewModel.cs`).
   - **Trước khi trích tên 1 class/file làm bằng chứng, PHẢI tự Grep/Glob xác nhận file đó thật sự tồn tại trong source code** — không được chỉ dựa vào tên nhắc tới trong tài liệu spec/workflow (`WORKFLOW/*.md`). Tài liệu spec mô tả thiết kế **dự kiến**, không đảm bảo đã được lập trình. Đã từng xảy ra lỗi nghiêm trọng: ghi nhận 1 rule "đã xác nhận qua đọc code file X.cs" trong khi file đó **không hề tồn tại** trong repo, chỉ được nhắc tên trong tài liệu spec — khiến báo cáo QA sai sự thật. Luôn tự hỏi: "mình đã thực sự mở/đọc được nội dung file này chưa, hay chỉ đang suy luận từ tên gọi?"
3. **Không xác nhận được / cần QC test tay** — dùng khi cả 2 cách trên đều không khả thi (thiếu tài khoản test phù hợp, control không tự động hoá được sau 2-3 lần thử). Không được để trống hoặc viết PASS "cho có" khi thực chất chưa kiểm chứng được gì.

## B.5. Khi phát hiện cả 1 module/tính năng CHƯA được lập trình

Nếu qua đọc code phát hiện cả 1 module/luồng nghiệp vụ hoàn toàn chưa có service/API/logic (chỉ có model rỗng hoặc UI hard-code dữ liệu mẫu):
- **Không** viết nhiều testcase nhỏ lẻ suy đoán hành vi cho từng rule con của module đó — chưa có gì để test, chỉ tổ tốn công và gây nhiễu báo cáo.
- Viết **1 testcase duy nhất, mức Ưu tiên `Khẩn cấp`**, mô tả rõ: đã thử tái hiện luồng thật trên UI dẫn đến bị chặn ở đâu, kèm bằng chứng đọc code xác nhận chưa có implementation, liệt kê ngắn gọn những nghiệp vụ con nào sẽ không test được vì lý do này (để BA/dev biết phạm vi ảnh hưởng).
- Nếu trước đó đã lỡ viết các testcase nhỏ lẻ dựa trên giả định sai (module đã có code) → phải **sửa lại** các testcase đó (không xoá âm thầm), ghi rõ đã rút lại claim sai và trỏ về testcase tổng hợp mới.

## B.6. Không lặp vô hạn khi 1 control không tự động hoá được

Thử tối đa **2-3 cách khác nhau** (đổi selector, đổi cách trigger event, đổi đối tượng test...) rồi **dừng lại** — không lặp vô hạn, rất tốn thời gian mà không chắc đổi được kết quả. Ghi nhận trung thực là control này chưa tự động hoá được, đề xuất QC test tay (xem thêm bảng lỗi thường gặp ở Phần D).

## B.7. Quản lý tài nguyên máy — dọn dẹp sau khi xong

- **Video `.mp4` local**: xoá ngay sau khi upload Catbox thành công. Nếu upload lỗi → giữ lại để retry/debug.
- **Ảnh chụp (`shots/`)**: xoá cả thư mục sau khi đã kiểm chứng xong kết quả trong phiên làm việc — không để ảnh tồn đọng chiếm ổ đĩa của user. Nếu cần cho user xem lại 1 ảnh cụ thể: **không** gửi file ảnh local qua `SendUserFile`, mà upload lên Catbox rồi gửi link.
- **Tab Chrome debug**: không đóng tab nếu không chắc còn tab khác — đóng tab cuối cùng sẽ tắt cả Chrome debug. Luôn đếm số tab trước khi đóng (`curl http://localhost:9222/json/list`), chỉ đóng khi còn ≥ 2 tab.

---

# PHẦN C — SKILL KỸ THUẬT MẶC ĐỊNH (QUY TRÌNH THỰC THI)

> Phần này là "sổ tay kỹ thuật" — quy trình, code mẫu, cấu trúc chuẩn để AI thực thi. Không phải nguyên tắc bắt buộc (đã tách ở Phần B), mà là *cách làm* mặc định nên theo để nhất quán giữa các lần chạy.

## C.1. Cấu trúc thư mục

> Cấu trúc dưới đây là **tương đối**, tính từ thư mục `AI TESTING/`. Thư mục gốc của dự án (nơi chứa `AI TESTING/`, `credentials.json`, `jwt_sheets.js`...) có thể nằm ở vị trí khác nhau tuỳ máy mỗi QC (khác ổ đĩa, khác tên thư mục). **AI không được giả định cố định 1 đường dẫn tuyệt đối** — trước khi chạy, hãy tự xác định đường dẫn gốc thực tế trên máy đang chạy (ví dụ: tìm thư mục chứa `credentials.json` và `jwt_sheets.js`, thường là thư mục cha của `AI TESTING/`), rồi dùng đường dẫn đó cho mọi thao tác đọc/ghi file.

```
<gốc dự án>/
  credentials.json           <- Service Account key để đọc/ghi Google Sheet
  jwt_sheets.js               <- Hàm readSheetCell/updateSheetCell dùng chung
  AI TESTING/
    WORKFLOW/                  <- CHỈ chứa tài liệu nghiệp vụ (không đụng vào)
      fCheckin.md
      fEvaluation.md
      fProfile.md
    Automation Scripts/        <- Toàn bộ script test, log, kết quả JSON, ảnh chụp
      eval008_test.js
      eval0xx_..._test.js
      shots/
      *.log
      *_result.json
    Rules_Skill.md              <- File này
    AI_Prompt_Template_Ticket_*.md
    AI_Template_Testcase_Guide.md
    AI_Test_Report_Guide.md
```

**Quy tắc:** Không tạo file script/log/kết quả trong `WORKFLOW/`. Mọi file AI sinh ra khi chạy automation đều để trong `Automation Scripts/`. `WORKFLOW/` chỉ chứa tài liệu nghiệp vụ do người viết.

## C.2. Quy trình 5 bước (tổng quan)

1. **Kết nối** — Kết nối vào Chrome đang mở ở chế độ Debug qua `localhost:9222`, đăng nhập (nếu cần), chọn đúng tổ chức, điều hướng tới trang cần test.
2. **Bật quay video** — Dùng `puppeteer-screen-recorder` để quay toàn bộ thao tác test (có con trỏ ảo hiển thị rõ vị trí click).
3. **Chạy test** — Thao tác nhập liệu/tương tác theo đúng mô tả testcase, kiểm tra kết quả/lỗi hiển thị.
4. **Upload video lên Catbox** — Dừng quay, upload file `.mp4` lên `https://catbox.moe/user/api.php` bằng userhash, lấy link vĩnh viễn.
5. **Cập nhật Google Sheet** — Tìm đúng dòng testcase, **nối thêm** (không ghi đè) link video + ghi chú retest vào cột "Kết quả thực hiện" (sheet cũ như `fEvaluation - VIBE`) hoặc cột "Note" của nhóm TEST LẦN tương ứng (`Template Checklist .xlsx` hàng tuần) (xem quy tắc bắt buộc ở mục B.2).

**Trước khi chạy bất kỳ testcase nào:** đọc dòng tương ứng trong Sheet để lấy Mô tả/Các bước/Kết quả cũ. Không bịa nội dung testcase.

## C.3. Chi tiết kỹ thuật từng bước

### C.3.1. Kết nối Chrome debug (Puppeteer)

```js
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222', defaultViewport: null });
const page = await browser.newPage();       // LUÔN mở tab MỚI, không tái sử dụng tab cũ
await page.setViewport({ width: 1280, height: 900 });
```

**Vì sao phải mở tab mới mỗi lần:** tab cũ từng bị `puppeteer.connect()`/`recorder.start()`/`recorder.stop()` nhiều lần sẽ dần "hư" — `page.screenshot()` bắt đầu bị treo/timeout ngẫu nhiên dù các lệnh khác vẫn chạy. Mở tab mới cho mỗi lần chạy script tránh hoàn toàn vấn đề này.

**Devtunnel warning:** nếu URL là link devtunnel (`*.devtunnels.ms`), lần điều hướng đầu luôn hiện màn hình cảnh báo của Microsoft ("You are about to connect to a developer tunnel"). `page.evaluate()` trên trang này **hay bị treo** — phải bấm nút "Continue" bằng toạ độ chuột cố định (không dùng evaluate để tìm nút), ví dụ `page.mouse.click(687, 487)` với viewport 1280×900.

### C.3.2. Đăng nhập & chọn tổ chức

- Nếu phiên đã đăng nhập sẵn (cookie còn), trang sẽ nhảy thẳng tới màn "Chào mừng!" + "Chọn tổ chức đăng nhập" hoặc thẳng vào `homepage` — **bỏ qua bước điền form đăng nhập**.
- Nếu chưa đăng nhập: bấm "Đăng nhập" ở trang marketing → form login đã tự điền sẵn email/password (do trình duyệt nhớ) → bấm nút "Log in".
- Sau đăng nhập có thể gặp 1 trong 2 trạng thái:
  - Màn "Chọn tổ chức đăng nhập" (danh sách tổ chức) → bấm đúng tên tổ chức cần.
  - Tự nhảy thẳng vào 1 tổ chức mặc định (không phải tổ chức cần) → phải mở dropdown tổ chức ở góc trên (chứa text `arrow_drop_down`) rồi chọn lại đúng tên.
- Luôn xác nhận lại bằng cách đọc body text có chứa đúng tên tổ chức trước khi đi tiếp.
- Có thể xuất hiện popup "Bật thông báo đẩy" — bấm "Từ chối" nếu có, không bắt buộc phải có (bỏ qua nếu không tìm thấy).

### C.3.3. Quay video (PuppeteerScreenRecorder)

```js
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const recorder = new PuppeteerScreenRecorder(page, {
  followNewTab: false, fps: 30,
  videoFrame: { width: 1280, height: 900 },
  videoCrf: 20, videoCodec: 'libx264', videoPreset: 'ultrafast',
  videoBitrate: 1500, aspectRatio: '16:9',
});
await recorder.start(VIDEO_PATH);   // bắt đầu quay NGAY TRƯỚC bước thao tác test thật
// ... thao tác test ...
await recorder.stop();
```

**Con trỏ ảo (bắt buộc để user nhìn được vị trí click):** trước khi bắt đầu quay, inject 1 đoạn CSS/JS tạo 1 chấm tròn đỏ `position:fixed` + hiệu ứng gợn sóng khi click. Mọi hàm click trong script phải gọi `window.__setCursor(x,y)` + `window.__pulseCursor()` trước khi thực sự bấm chuột. Code mẫu đã có sẵn trong các file `eval0XX_test.js` (hàm `injectCursor` + `safeClick`).

### C.3.4. Ảnh chụp màn hình (screenshots)

Trong lúc chạy, script vẫn chụp ảnh (`shot()`) vào thư mục `Automation Scripts/shots/` để AI tự kiểm chứng từng bước (đọc lại ảnh để xác nhận UI đúng như log mô tả trước khi báo kết quả). Quy tắc dọn dẹp/không gửi file ảnh local trực tiếp → xem mục B.7.

### C.3.5. Upload Catbox

```js
const form = new FormData();
form.append('reqtype', 'fileupload');
form.append('userhash', CATBOX_USERHASH);
form.append('fileToUpload', new Blob([fs.readFileSync(VIDEO_PATH)], { type: 'video/mp4' }), path.basename(VIDEO_PATH));
const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form, signal: AbortSignal.timeout(120000) });
const catboxUrl = (await res.text()).trim();   // dạng https://files.catbox.moe/xxxxxx.mp4
```

Quy tắc xoá file sau khi upload → xem mục B.7.

### C.3.6. Cập nhật Google Sheet

Dùng JWT Service Account (không cần OAuth tương tác), hàm sẵn có ở `<gốc dự án>/jwt_sheets.js` (xem mục C.1 — tự xác định đường dẫn gốc thực tế trên máy đang chạy, không hardcode).

**Bước 0 — bắt buộc, chỉ cần làm 1 lần cho mỗi Sheet mới: dò cấu trúc cột "TEST LẦN N"**

Nhiều sheet checklist của Fastdo (không phải tất cả — phải tự kiểm tra, không giả định) có 2 dòng tiêu đề: dòng 1 gộp nhóm ("TEST LẦN 1", "TEST LẦN 2", "TEST LẦN 3"...), dòng 2 là tên cột con lặp lại theo từng nhóm (Ưu tiên / Môi trường / Trạng thái / Kết quả thực hiện — hoặc `Note` ở `Template Checklist .xlsx` hàng tuần / DEV NOTE / Test Date). Trước khi ghi bất kỳ kết quả test nào, đọc 2 dòng đầu của Sheet để xác định:
- Nhóm cột của "TEST LẦN 1" nằm ở đâu (thường là lần test/ghi nhận gốc, có sẵn từ trước).
- Lần test **mới nhất mà AI sắp ghi là lần thứ mấy** (đếm xem các nhóm TEST LẦN 2, 3, 4... phía sau đã có dữ liệu ở dòng đó chưa — nhóm đầu tiên còn trống ứng với lần test này).

Ví dụ cấu trúc thực tế đã gặp ở tab `fEvaluation - VIBE` (chỉ là ví dụ minh hoạ, **phải tự đọc lại cho đúng sheet đang dùng**, không hardcode):

| Nhóm | Ưu tiên | Môi trường | Trạng thái | Kết quả thực hiện (= `Note` ở Template tuần) | DEV NOTE | Test Date |
|---|---|---|---|---|---|---|
| TEST LẦN 1 | F | G | H | I | J | K |
| TEST LẦN 2 | L | M | N | O | P | Q |
| TEST LẦN 3 | R | S | T | U | V | W |
| TEST LẦN 4 | X | Y | Z | AA | AB | AC |
| TEST LẦN 5 | AD | AE | AF | AG | AH | AI |

> Quy ước chung cho mọi sheet: (a) so khớp tên cột **bỏ khoảng trắng thừa, không phân biệt hoa/thường** (`DEV NOTE` = `DEV Note`); (b) ở `Template Checklist .xlsx` hàng tuần, cả 10 nhóm TEST LẦN đều có đủ 6 cột giống nhau (Ưu tiên, Môi trường, Trạng thái, Note, DEV NOTE, Test Date), cột `QC` nằm cuối cùng — vị trí cột chi tiết xem `AI_Template_Testcase_Guide.md`; (c) **Test Date** ghi `YYYY-MM-DD HH:mm` (cột trong template đã định dạng `yyyy-mm-dd hh:mm`; `updateSheetCell` dùng USER_ENTERED nên Sheet tự nhận là ngày–giờ).

**Bước 1 — ghi kết quả vào đúng nhóm cột của lần test đó**, không đụng vào nhóm cột của các lần trước:
- Cột Trạng thái của lần đó phải phản ánh đúng những gì lần test **này** xác nhận được — DONE chỉ khi lần test này thực sự tự xác nhận được, không copy nguyên trạng thái từ lần trước sang. Nếu lần test này không xác nhận lại được (bị chặn giữa chừng, timeout, thiếu dữ liệu...), Trạng thái của lần đó phải thể hiện đúng điều đó (VD `Pending`), **tuyệt đối không để trống rồi coi như "vẫn giữ nguyên DONE của lần trước"**.
- Nếu video/bằng chứng của lần test này chính là video cũ (do lần này bị chặn sớm, chưa kịp quay được cảnh mới, nhưng vẫn muốn dẫn lại video gốc để tiện xem bối cảnh) → phải ghi chú rõ trong Kết quả thực hiện rằng video đó **không phải bằng chứng cho lần test này**, tránh gây hiểu nhầm là mỗi lần test đều có video riêng.

```js
const { updateSheetCell } = require('../../jwt_sheets.js'); // đường dẫn tương đối từ Automation Scripts/ tới gốc dự án
// Ví dụ ghi kết quả LẦN 2 cho 1 testcase ở dòng 17, sau khi đã xác định qua Bước 0 rằng
// nhóm "TEST LẦN 2" của sheet này nằm ở cột L-Q:
await updateSheetCell(spreadsheetId, "'Tên Tab'!N17", "Pending"); // Trạng thái lần 2
await updateSheetCell(spreadsheetId, "'Tên Tab'!O17",              // Kết quả thực hiện lần 2
  "<mô tả đúng những gì lần test này quan sát được>\n- Video Test Record: " + catboxUrl);
await updateSheetCell(spreadsheetId, "'Tên Tab'!Q17", "YYYY-MM-DD"); // Test Date lần 2
```

**Chỉ áp dụng append-không-ghi-đè (đọc giá trị cũ rồi nối thêm) khi ghi tiếp vào đúng 1 ô đã có sẵn nội dung của chính lần test đó** (VD script bị gọi lại 2 lần cho cùng 1 lần test) — không dùng append để nhét lần test mới vào ô của lần test cũ.

Quy tắc bắt buộc liên quan (không ghi đè sai lần, đọc lại để xác minh, không mô phỏng UI) → xem mục B.2.

## C.4. Cấu trúc chuẩn của 1 script test

Mỗi script `evalXXX_test.js` nên có các phần theo đúng thứ tự:

1. Cấu hình đầu file: `TARGET_URL`, `CATBOX_USERHASH`, `SPREADSHEET_ID`, `SHEET_TAB`, mapping `CELLS` (mã testcase → range ô Sheet).
2. Hàm tiện ích dùng chung: `log()` (ghi ra cả console lẫn file `progress_*.log` để theo dõi real-time), `withTimeout()`, `safeEval()`, `injectCursor()`, `safeClick()`, `clickByText()`/`clickElByText()`, `shot()`, `getBodyText()`, `waitForCondition()`.
3. Hàm tương tác Google Sheets (JWT) + Catbox upload.
4. `main()`:
   - Kết nối → devtunnel → đăng nhập → chọn tổ chức → điều hướng tới màn hình cần test.
   - `injectCursor(page)` → bắt đầu quay.
   - Thực hiện các bước test, thu thập kết quả vào object `results`.
   - Dừng quay → disconnect browser.
   - Upload Catbox → xoá video local nếu thành công.
   - Với mỗi testcase liên quan: đọc ô Sheet cũ, ghép ghi chú mới + video, ghi lại.
   - Ghi file `*_result.json` để lưu lại toàn bộ dữ liệu thô của lần chạy (phục vụ debug/audit sau).
5. `main().catch(...)` — log lỗi rõ ràng ra cả console và file log, `process.exit(1)`.

**Nếu 1 luồng nghiệp vụ dài (VD nhiều testcase liên tiếp cùng thao tác trên 1 màn hình/1 đối tượng) → gộp vào 1 script, quay 1 video duy nhất cho cả nhóm, tiết kiệm thời gian & số lần upload.**

## C.5. Quy trình chạy 1 lần kiểm thử (checklist thao tác cho AI)

1. Đọc nội dung testcase từ Sheet (Mô tả, Các bước, Kết quả thực hiện hiện tại).
2. Kiểm tra Chrome debug đang chạy (`curl http://localhost:9222/json/version`).
3. Viết/tái sử dụng script theo cấu trúc ở mục C.4.
4. Chạy script ở **background** (`run_in_background: true`), vì quá trình có quay video + upload sẽ mất vài phút.
5. Theo dõi qua file `progress_*.log` (ghi đồng bộ, đáng tin hơn log console redirect) — không poll liên tục, dùng cơ chế chờ thông báo hoàn tất.
6. Khi xong: đọc `*_result.json` + ảnh chụp trong `shots/` để **tự kiểm chứng lại** kết quả trước khi báo cáo — không tin mù quáng vào boolean tự script tính (script có thể tính sai do lỗi selector).
7. Nếu phát hiện sai sót → sửa, revert Sheet nếu cần, chạy lại.
8. Gửi video cho user (`SendUserFile`), tóm tắt kết quả ngắn gọn kèm link.
9. Xoá video local + thư mục `shots/` sau khi đã upload/kiểm chứng xong (xem mục B.7).

## C.6. Quy trình viết testcase mới

Tuân theo `AI_Template_Testcase_Guide.md` (cấu trúc cột chuẩn của Fastdo) và `AI_Prompt_Template_Ticket_Update.md` / `AI_Prompt_Template_Ticket_Bug.md` (2 luồng: Ticket Update — sinh Scenario rồi mới sinh Test Case chi tiết; Ticket Bug — sinh trực tiếp Test Case kiểm chứng bug + Regression).

Khi sinh testcase mới cho mục đích automation hoá (chạy được bằng script như trong tài liệu này), ưu tiên viết Test Steps rõ ràng theo dạng có thể ánh xạ trực tiếp thành thao tác DOM (VD: "Bấm nút X", "Nhập giá trị Y vào ô Z", "Kiểm tra text W xuất hiện") thay vì mô tả chung chung — giúp lần sau AI viết script nhanh hơn, ít đoán mò hơn.

**Định dạng nội dung testcase (cột Mô tả ở sheet cũ; ở `Template Checklist .xlsx` hàng tuần ghi vào cột Note của TEST LẦN 1) — Điều kiện + Các bước + Kết quả mong đợi, cả 3 phần đều bắt buộc** (sheet cũ dùng tên "Kết quả mong đợi" — cùng nghĩa; testcase mới viết là "Kết quả mong đợi"):
```
Điều kiện: <tiền điều kiện, dữ liệu/trạng thái cần có sẵn>
Các bước:
B1: <thao tác 1>
B2: <thao tác 2>
...
Kết quả mong đợi: <mô tả kỳ vọng đúng theo spec/nghiệp vụ — KHÔNG phải kết quả quan sát được lúc test>
```

**"Kết quả mong đợi" là bắt buộc với mọi testcase mới**, kể cả testcase mô tả 1 bug đã biết. Đây là điểm dễ nhầm nhất:
- Với testcase Happy/Validate/Business rule: Kết quả mong đợi = hành vi đúng mà hệ thống phải có.
- Với testcase mô tả 1 Bug: Kết quả mong đợi **vẫn phải là hành vi ĐÚNG theo spec** (VD "phải copy cả Tên nhóm"), **không phải** hành vi lỗi đang xảy ra (VD không viết "Tên nhóm bị để trống" làm kết quả mong muốn — đó là mô tả bug, phải đặt trong Kết quả thực hiện lúc test).
- Ưu tiên trích dẫn đúng mã rule/số mục từ `WORKFLOW/<module>.md` (VD "Theo BR-14 mục 1.3.5...", "Theo D-036...") khi testcase gắn với 1 rule cụ thể đã có trong tài liệu — tăng khả năng truy vết, tránh suy đoán khác với spec thật.
- Cột "Kết quả thực hiện" (ghi sau khi chạy test, xem C.3.6) là nơi ghi **những gì quan sát được thực tế** — không lặp lại y nguyên "Kết quả mong đợi" vào đó, trừ khi thực tế đúng khớp và muốn xác nhận lại.
Khi ghi qua `jwt_sheets.js`/Sheets API, dùng ký tự xuống dòng thật (`\n`) giữa các dòng — API ghi trực tiếp vào giá trị cell nên xuống dòng thật hoạt động đúng (khác với gõ trực tiếp qua UI trình duyệt, nơi phím Enter/Alt+Enter mô phỏng qua tool điều khiển chuột/bàn phím thường **không** tạo được xuống dòng thật trong ô — chỉ dồn thành 1 dòng liền. Đây cũng là lý do vì sao mục B.2 yêu cầu luôn ghi Sheet qua `jwt_sheets.js`).

Các nguyên tắc bắt buộc khi viết testcase (giá trị dropdown, phân biệt loại bằng chứng, xử lý khi phát hiện module chưa lập trình) đã tách riêng ở **Phần B** (mục B.3, B.4, B.5) — đọc ở đó, không lặp lại tại đây.

---

# PHẦN D — THAM KHẢO: VẤN ĐỀ ĐÃ GẶP & GIỚI HẠN HIỆN TẠI

## D.1. Các vấn đề đã gặp & cách xử lý

| Vấn đề | Nguyên nhân | Cách xử lý |
|---|---|---|
| `page.evaluate()`/`page.screenshot()` treo ngẫu nhiên, không báo lỗi | Flakiness của CDP khi tab sống lâu / nhiều lần reconnect | Bọc **mọi** lệnh Puppeteer bằng `withTimeout(fn, ms, label)` — không bao giờ để 1 lệnh chờ vô hạn. Nếu treo, log warning và **tiếp tục** thay vì dừng cả script. |
| Click vào nút không có phản ứng dù toạ độ đúng | Bulma dropdown kiểu `is-hoverable` (mở khi hover chuột thật, không phải khi click) — ví dụ menu "..." (Nhân bản/Ngừng sử dụng) trong danh sách Mẫu đánh giá | Ưu tiên tìm cách khác để đến đúng chức năng (VD dùng nút "Sửa" có sẵn thay vì phải mở menu "..." trước). Nếu bắt buộc phải dùng, thử dispatch `mouseenter`/`pointerenter` event thay vì click — không đảm bảo 100%. |
| Dropdown chọn giá trị (VD "Chọn thang điểm", "Chọn mẫu đánh giá") không tìm thấy bằng `clickByText` | Có 2 loại control khác nhau: (1) `<select>` native — clickByText **không hoạt động**, phải dùng `page.select()` hoặc set `HTMLSelectElement.value` qua native setter + dispatch `change`/`input` event; (2) custom search-box (Bulma) — click mở list rồi `clickByText` tên mục bình thường | Luôn kiểm tra DOM trước (`el.tagName`) để biết là `<select>` hay `<div>` custom trước khi viết logic. |
| Calendar chọn ngày/tháng: click mũi tên `›`, click dropdown "Tháng N", phím `PageDown` — **đều không đáng tin cậy** | Chưa xác định được nguyên nhân gốc (có thể do element bị nhầm/nested SVG, hoặc mất focus). Chỉ chắc chắn: click trực tiếp vào **1 ngày đang hiển thị sẵn trong tháng mặc định** khi vừa mở lịch thì hoạt động tốt. | Nếu testcase cần ngày kết thúc khác tháng mặc định: chấp nhận không tự động hoá được 100%, ghi chú trung thực "cần QC test tay" thay vì cố gắng vô hạn (xem mục B.6). |
| Banner "Đang khôi phục phiên làm việc của bạn..." xuất hiện | Reconnect CDP nhiều lần liên tiếp (nhiều lệnh `node -e` riêng lẻ) làm socket real-time của app bị gián đoạn | Viết TOÀN BỘ luồng test trong **1 script chạy 1 lần duy nhất** (1 lần `puppeteer.connect()`), tránh chia nhỏ thành nhiều lệnh `node -e` thăm dò riêng lẻ khi đã vào giai đoạn thao tác thật. Việc thăm dò/debug UI mới thì làm ở ngoài, không ảnh hưởng đến lần chạy chính thức. |
| Đóng nhầm tab cuối cùng làm Chrome debug tắt hẳn | Chrome ở chế độ debug này tắt khi đóng tab cuối | Xem quy tắc bắt buộc ở mục B.7. Nếu lỡ tắt: báo user mở lại Chrome debug, không tự ý làm gì khác. |
| Devtunnel URL thỉnh thoảng không phản hồi (mất mạng tạm thời) | Tunnel cục bộ của user bị gián đoạn, không phải lỗi script | Test bằng `curl --max-time 15 -o /dev/null -w "%{http_code}" <url>` trước khi kết luận là lỗi hạ tầng. Báo user kiểm tra dev server/devtunnel, không tự sửa. |
| Nhiều tab rác tích tụ qua các lần chạy | Mỗi lần script chạy mở tab mới, không tự đóng | Định kỳ dọn: liệt kê tab, đóng các tab cũ không cần (giữ lại ≥ 1 tab an toàn), KHÔNG đóng khi chỉ còn 1 tab. |
| Cả 1 nhóm testcase bị chặn hoàn toàn vì thiếu dữ liệu test (VD: không nhân sự nào trong tổ chức test có sẵn quan hệ "quản lý trực tiếp" nên rule tự xác định người đánh giá không bao giờ resolve được) hoặc vì 1 control tự động hoá không được (VD ô tìm kiếm không phản hồi bất kỳ input nào dù đã thử `type`, dispatch native event, set value trực tiếp) | Giới hạn của dữ liệu seed/môi trường test, hoặc bug thật của ứng dụng — không phải lỗi script | Xem mục B.6 (không lặp vô hạn) và B.5 (nếu chặn cả 1 luồng nghiệp vụ lớn hơn). Không cố "lách" bằng cách sửa dữ liệu hệ thống ngoài phạm vi testcase đang chạy. |

## D.2. Giới hạn hiện tại (chưa giải quyết được)

- Calendar/date-picker của module Kỳ đánh giá: không tự động điều hướng sang tháng khác được. Các testcase phụ thuộc bước "chọn khoảng thời gian khác tháng hiện tại" cần QC làm tay hoặc cần điều tra thêm (xem cấu trúc HTML thực tế của thư viện date-picker đang dùng để viết selector chính xác hơn).
- Menu dạng hover (`.dropdown.is-hoverable`) không có cách click 100% ổn định qua Puppeteer.
