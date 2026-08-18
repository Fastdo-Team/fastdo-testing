# Module — Workflow File Map

_Ánh xạ giữa tên Module trong Ticket và file Workflow tương ứng._

## Danh sách ánh xạ

| Module (trong Ticket) | Tên thay thế | File Workflow | Trạng thái |
|---|---|---|---|
| fCheckin | Chấm công, Timekeeping | `WORKFLOW/fCheckin.md` | ✅ Có |
| fProfile | Hồ sơ nhân sự, Profile, HSNS, fE - Profile | `WORKFLOW/fProfile.md` | ✅ Có |
| fLeave | Phép năm, Annual Leave | _(chưa có)_ | ❌ Cần tạo |
| Payroll | Bảng lương, fPayroll | _(chưa có)_ | ❌ Cần tạo |
| fEducation | Đào tạo, Training | _(chưa có)_ | ❌ Cần tạo |
| fTodolist | Công việc, Tasks | _(chưa có)_ | ❌ Cần tạo |
| fMeeting | Họp, Meeting | _(chưa có)_ | ❌ Cần tạo |
| fWorkflow | Quy trình, Workflow | _(chưa có)_ | ❌ Cần tạo |
| fPlan | Kế hoạch, WorkPlan | _(chưa có)_ | ❌ Cần tạo |
| Document | Tài liệu | _(chưa có)_ | ❌ Cần tạo |
| Config | Cài đặt, Settings | _(chưa có)_ | ❌ Cần tạo |

## Khi Module chưa có file Workflow

Nếu file Workflow chưa tồn tại cho module được yêu cầu:
1. AI thông báo rõ cho QC: "Chưa có file Workflow cho module `<Module>`"
2. AI vẫn phân tích dựa trên Source Code và Requirement
3. AI đề xuất QC tạo file Workflow mới sau khi hoàn thành ticket

## Cách tìm file Workflow khi tên không khớp

Nếu `🔴 Module` trong ticket không khớp 100% với tên file:
1. Quét danh sách file trong thư mục `WORKFLOW/`
2. Đọc dòng đầu tiên (title) của mỗi file `.md`
3. Match theo từ khóa liên quan (ví dụ: "Chấm công" → `fCheckin.md`)
