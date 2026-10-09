# CLAUDE.md — AI Testing (Fastdo)

Thư mục này dùng để AI tự chạy kiểm thử tự động (Puppeteer + Chrome debug + Google Sheet). Trước khi làm bất kỳ việc gì trong thư mục này, áp dụng đúng 2 cổng dưới đây — không bỏ qua, không tự suy đoán thay.

## CỔNG 1 — Trước khi viết testcase mới

Chưa đọc **cả 2 file** dưới đây trong phiên hiện tại → **dừng lại, đọc trước**:

1. [`WORKFLOW/<module tương ứng>.md`](./WORKFLOW/) (VD `fEvaluation.md`, `fCheckin.md`, `fProfile.md`) — đặc tả nghiệp vụ, chứa mã rule (BR-xxx, D-xxx) và số mục cần trích dẫn khi viết testcase/bug. Xác định đúng module đang test rồi đọc đúng file, không đọc hết cả thư mục.
2. [`Rules_Skill.md`](./Rules_Skill.md) mục **C.6 (Quy trình viết testcase mới)** và **B.4/B.5** (phân biệt bằng chứng, cách xử lý khi phát hiện module chưa lập trình).

**Lưu ý quan trọng khi đọc WORKFLOW/*.md**: các tên file được liệt kê trong đó (VD "File: EvaluationAccessPolicy.cs...") là **thiết kế dự kiến**, không phải bằng chứng đã được lập trình. Trước khi trích 1 file/class từ đây làm bằng chứng "đã xác nhận qua đọc code", phải tự Grep/Glob xác nhận file đó thật sự tồn tại trong source code — xem mục B.4.

## CỔNG 2 — Trước khi chạy 1 lần test (bất kỳ testcase nào, mới hay retest)

Chưa đọc **cả 2 file** dưới đây trong phiên hiện tại → **dừng lại, đọc trước**:

1. [`QC_Dau_Vao.md`](./QC_Dau_Vao.md) — xác nhận đã có đủ thông tin QC cung cấp (URL, tổ chức, Sheet tab, mã testcase). Thiếu mục nào → hỏi lại QC, không tự đoán hoặc dùng lại giá trị cũ khi không chắc còn đúng.
2. [`Rules_Skill.md`](./Rules_Skill.md) — toàn bộ Phần B (yêu cầu bắt buộc) và mục C.3–C.5 (kỹ thuật thực thi). Đặc biệt: B.2 (ghi Sheet qua `jwt_sheets.js`, đúng nhóm cột TEST LẦN N) và B.3 (tra Data Validation thật của Sheet trước khi ghi dropdown).

## Không có ngoại lệ

- Đã đọc trong phiên hiện tại rồi thì không cần đọc lại nếu chưa chuyển sang module/testcase khác — nhưng nếu chuyển sang module khác (VD từ fEvaluation sang fCheckin), phải đọc lại đúng file WORKFLOW của module mới.
- Nếu 2 file `QC_Dau_Vao.md` / `Rules_Skill.md` đã đổi kể từ lần đọc gần nhất trong phiên (VD user vừa yêu cầu sửa file), đọc lại bản mới nhất trước khi tiếp tục.
