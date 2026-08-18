# AI Testing rules — index (chỉ để tra cứu, không phải nguồn tự nạp)

Rule tự nạp theo `paths` trong frontmatter, không phụ thuộc file này. Đây chỉ là danh mục cho người đọc — thêm rule mới thì thêm file `.md` mới vào thư mục này + 1 dòng ở đây.

| Rule | Nội dung |
|---|---|
| `read-only-policy.md` | Chính sách Read-Only tuyệt đối đối với Source Code — AI không được sửa/commit/refactor/rename bất kỳ file code nào |
| `workflow-first.md` | Bắt buộc đọc và đối chiếu Workflow Module trước khi sinh Test Case — phát hiện Rule mới/thay đổi để cảnh báo QC |
| `test-coverage-invariants.md` | Các bất biến về độ bao phủ kiểm thử — 11 nhóm case bắt buộc, không trùng lặp, không bỏ sót |
| `checklist-format.md` | Quy tắc format Checklist/Test Case theo đúng Template Fastdo — ID, cột, công thức, screenshot |
| `regression-analysis.md` | Quy tắc phân tích Regression Area & Impact Matrix dựa trên liên kết Workflow |
| `report-output.md` | Quy tắc xuất Test Report, Bug Report, Workflow Update Notification |

Mỗi rule file hoạt động độc lập — đọc file nào cũng đủ hiểu rule đó mà không cần đọc file khác trước.
