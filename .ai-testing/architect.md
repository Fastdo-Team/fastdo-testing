# AI Testing — Architect Context (v1 — 2026-08-18)

```
+-------------------+       +---------------------+       +-------------------+
|    QC / Tester     | <-->  |    AI Testing Agent  | <-->  |  Source Code (RO)  |
|   (Người kiểm thử)|       | (Senior SW Tester)  |       | fastdo-server/     |
+-------------------+       +---------------------+       +-------------------+
        |                           |                            |
        v                           v                            v
+-------------------+       +---------------------+       +-------------------+
|   Ticket Input    |       |   WORKFLOW/          |       |   git diff/log    |
| (ID, Title, Req,  |       | fCheckin.md          |       |   (File Change)   |
|  Module, Branch)  |       | fProfile.md          |       |                   |
+-------------------+       | ...                  |       +-------------------+
                            +---------------------+
                                    |
                                    v
                    +-------------------------------+
                    |         OUTPUT                 |
                    |  📁 plans/  : Test Plans (.md)|
                    |  📁 tests/  : Test Cases (.xlsx)
                    |  📁 reports/: Reports (.xlsx)  |
                    |  ⚠️ Workflow Update Alert      |
                    +-------------------------------+
```

## Cấu trúc thư mục & Quy trình 5 bước

Xem [`AI_TESTING_RULES.md`](../AI_TESTING_RULES.md) — đây là bản duy nhất, file này không
copy lại để tránh 2 nơi lệch nhau khi có thay đổi. Chi tiết từng rule: [`rules/`](rules/);
tra cứu nhanh: [`reference/`](reference/).

Phần khác biệt duy nhất của file này so với `AI_TESTING_RULES.md` là sơ đồ actor phía trên —
ai/hệ thống nào trao đổi với ai.
