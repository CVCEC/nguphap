# Giọng đọc AI – Ngữ pháp

Robot trên GitHub Actions (`.github/workflows/giong-ai.yml` → `tools/giong_ai.py`) tạo giọng Trâu Con (Google Gemini, giọng **Kore**, miền Bắc) cho 941 câu của 37 bài trong `can-doc.tsv` (tạo bằng `node tools/tao-can-doc.js` từ `data/bai-hoc.js`), lưu thẳng vào đúng thư mục âm thanh của kho. Cách làm giống kho vuihoctiengviet và venhaem.

- **Chạy khi nào:** mỗi ngày lúc 09:25 UTC, khi sửa `chay.txt`, hoặc bấm tay ở Actions → "Giọng đọc AI" → Run workflow.
- **Cần:** secret `GEMINI_API_KEY` (của tổ chức CVCEC hoặc của kho này).
- **Xem tiến độ:** `trang-thai.md`. Nhật ký lần chạy: `nhat-ky.txt`.
- **Nghe lại:** `kiem-tra.tsv` ghi điểm giống (0–1) giữa câu cần đọc và điều Whisper nghe được. Câu dưới 0,75 nên nghe kỹ. Với chữ cái, vần và đánh vần, Whisper hay nghe sai nên các câu này luôn cần người nghe.
- **Đọc lại một câu:** xoá tệp mp3 của câu đó; lần chạy sau robot tạo lại.
- **Không tạo một câu (để người thu tay):** ghi đường dẫn tệp (cột `tep`) vào `bo.txt`, mỗi dòng một tệp.
- **Tệp đã có không bị ghi đè**, kể cả bản thu giọng người thật đặt vào sau.
- Cột `cach` trong `can-doc.tsv`: trống = câu thường · `van` = chữ cái, vần, đánh vần (đọc theo âm) · `truyen` = kể chuyện · `nhip` / `ca-bai` = đồng dao, vè đọc theo nhịp.

## Riêng góc Ngữ pháp (25-11-2026)
- Tệp lưu ở `audio/bai-N/` (tên tệp xem đầu `tools/tao-can-doc.js`). Sửa `data/bai-hoc.js` thì chạy lại `node tools/tao-can-doc.js`.
- Trang bài **chưa có nút Nghe** (CLAUDE.md: thêm khi đã có tệp giọng). Khi robot đọc xong một số bài, thêm nút Nghe gọi `TTV.phat({ tep, chu })`.
- Trần 10 lượt gọi mỗi ngày (`TOI_DA_LUOT` trong `chay.txt`).
- Robot bật từ 26-11-2026 (`.github/workflows/giong-ai.yml`, mỗi ngày 09:25 UTC).
