# Thông tin QC cần cung cấp — Automation Test qua CDP (Chrome Debug)

> File này dành cho **QC đọc trước khi nhờ AI chạy test**. Toàn bộ quy tắc/kỹ thuật AI phải tuân thủ khi thực thi nằm ở file riêng: [`Rules_Skill.md`](./Rules_Skill.md) (AI đọc, QC không cần đọc file đó).

## 1. Cố định (chỉ cần cung cấp 1 lần đầu tiên, AI dùng lại cho mọi lần sau)

| # | Thông tin | Ví dụ |
|---|---|---|
| 1 | Tài khoản đăng nhập FastDo chính (Reviewer/Cycle Owner - email + password) | `tester01.fastdo@gmail.com` / `fastdo@123` (Hoàng Lệ Giang) |
| 1b | Tài khoản test THỨ 2 (dùng khi case cần kiểm tra phía người NHẬN - VD nhắc hạn, thông báo, phân quyền - mở song song 2 tài khoản) | `lezanghoang@gmail.com` / `fastdo@123` (Hoàng Giang) |
| 2 | Catbox Userhash (để video lưu vĩnh viễn vào đúng tài khoản Catbox của bạn) | `4a19dc82f364ca72eaace47e3` |
| 3 | Link Google Sheet dùng để theo dõi testcase (nếu mọi module đều dùng chung 1 Sheet) | link dạng `https://docs.google.com/spreadsheets/d/xxxxx/edit` |

Nếu các mục trên **chưa từng đổi** so với lần gần nhất, QC không cần nhắc lại — chỉ cần báo "dùng thông tin cũ".

## 2. Thay đổi theo từng lần yêu cầu test — PHẢI điền mỗi lần

Copy khối dưới đây, điền vào chỗ trống rồi gửi cho AI:

```
- URL Web cần test:            [dán URL — VD link devtunnel, đổi mỗi lần mở lại dev server]
- Tổ chức/Công ty cần chọn:     [VD: Water Quality - NH3T TEAM]
- Sheet Tab tương ứng module:   [VD: fEvaluation - VIBE / fCheckin - VIBE / fProfile - VIBE]
- Mã Testcase cần test:         [VD: EVAL_008, hoặc khoảng EVAL_012 → EVAL_036]
```

**Vì sao 4 mục này bắt buộc phải điền mỗi lần:**
- **URL Web**: môi trường test (thường là devtunnel) đổi liên tục mỗi khi dev server được bật lại — AI không thể tự đoán hay dùng lại URL cũ.
- **Tổ chức**: mỗi module/ticket có thể test trên tổ chức test khác nhau.
- **Mã Testcase**: xác định chính xác dòng cần cập nhật kết quả, tránh ghi nhầm testcase khác.

## 3. Điều kiện cần chuẩn bị sẵn trước khi nhờ AI chạy

- Chrome phải đang **mở sẵn ở chế độ Debug** (cổng `9222`) — xem cách bật ở mục 4. Nếu AI báo không kết nối được, mở lại Chrome debug rồi báo AI thử lại — không cần cung cấp thêm thông tin gì khác.
- Nếu testcase liên quan tới dữ liệu đặc thù (VD: cần sẵn 1 bản ghi X đã tồn tại, cần 1 nhân sự có sẵn quan hệ quản lý trực tiếp...), QC nên ghi chú trong lúc yêu cầu, tránh AI phải tự đoán hoặc tự tạo dữ liệu không đúng ý — hoặc phát hiện ra giữa chừng là bị chặn vì thiếu dữ liệu (xem `Rules_Skill.md` Phần D).

## 4. Cách bật "Chrome chế độ Debug" (chỉ cần thiết lập 1 lần)

Không cần cài thêm phần mềm — Chrome đã hỗ trợ sẵn, chỉ cần mở kèm 1 tham số đặc biệt thay vì mở bằng icon thường.

**Thiết lập lần đầu (Windows):**
1. Đóng **toàn bộ** cửa sổ Chrome đang mở.
2. Chuột phải ngoài Desktop → **New → Shortcut**.
3. Dán vào ô location (sửa lại đường dẫn `chrome.exe` nếu Chrome cài ở ổ/thư mục khác):
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\ChromeDebugProfile"
   ```
4. Đặt tên (VD "Chrome Debug") → Finish.

**Từ lần sau:** luôn mở Chrome bằng đúng shortcut này khi cần AI chạy test (không dùng icon Chrome thường — Chrome thường không có cổng debug).

**Lưu ý quan trọng:**
- `--user-data-dir="C:\ChromeDebugProfile"` tạo 1 hồ sơ Chrome **riêng biệt**, tách khỏi Chrome dùng hàng ngày. Lần đầu cần đăng nhập FastDo lại, các lần sau tự nhớ đăng nhập — **đừng xoá thư mục `C:\ChromeDebugProfile`**.
- Không đóng hết tab trong cửa sổ debug này khi đang test — đóng tab cuối cùng sẽ làm tắt cả Chrome debug, phải mở lại từ đầu.
- Kiểm tra đã bật đúng chưa: mở tab mới, vào `http://localhost:9222`, thấy danh sách JSON các tab là đúng. Hoặc đơn giản cứ báo AI, AI tự kiểm tra kết nối trước khi chạy.
