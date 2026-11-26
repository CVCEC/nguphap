# Ngữ pháp tiếng Việt – Trường Tiếng Việt Của Em (CVCEC)

Góc học nâng cao của Làng học tập Trâu Con: 37 bài từ tiếng, từ, cụm từ đến câu và hội thoại.
Trang: https://nguphap.cvcec.org (GitHub Pages, kho CVCEC/nguphap).

- `index.html` – trang chủ: Mục tiêu học tập, Học xong các bạn có thể, Tổng quan nội dung, Hướng dẫn cho cha mẹ & thầy cô, danh sách bài.
- `bai.html#bai-N` – trang bài dùng chung (N = 1…37): Khởi động, Khám phá, Trò chơi, Luyện tập, Vận dụng.
- `data/bai-hoc.js` – nội dung 37 bài (từ slide).
- `data/tro-choi.js` – trò chơi có hình và tiêu chí Trâu Con chấm bài viết của từng bài.
- `js/tro-choi.js`, `js/cham-viet.js` – bộ chơi và bộ chấm bài viết.
- `tests/` – kiểm tra dữ liệu: `node tests/tro-choi.test.js`, `node tests/cham-viet.test.js`.
- `css/ngu-phap.css`, `js/chung.js` – giao diện và hàm dùng chung.
- `assets/tranh/` – tranh minh hoạ.

Xem thêm TICH-HOP.md để gắn góc này vào bộ mẫu chung và cổng vietclass.cvcec.org.

Ghi kết quả học: `bai.html` gọi `TTV.ghiKetQua({ bai: "bai-N", hoatDong, soTroChoi, diem, diemToiDa, sao, thoiGianGiay })` của bộ mẫu chung mỗi khi chơi xong một trò (`tro-1`, `tro-2`…, điểm = lượt đúng / lượt đúng + lượt sai), làm xong Luyện tập (`luyen-tap`, điểm = số câu "Giống rồi") và mỗi lần Trâu Con chấm bài viết (`viet`, sao theo bộ chấm); cổng ghi vào tài khoản (ngoài cổng hoặc học thử thì không gửi gì).

## Kết quả từng câu (từ 26-11-2026)

Mỗi lần gọi `TTV.ghiKetQua` gửi thêm `cau: [{ ma, tu, dung, mang, loi }]` (tối đa 40 câu) theo hợp đồng của bộ mẫu chung. Bộ mẫu cũ bỏ qua `cau`, điểm, sao, mã bài, mã trò giữ nguyên; không thêm khoá localStorage.

- `ma` ổn định: `bN-tJ-cI` (trò J, vòng I), `bN-tJ-theK` (thẻ K của trò xếp giỏ), `bN-lt-cI` (câu Luyện tập), `bN-viet-K` (tiêu chí chấm viết thứ K).
- `tu` luôn là câu / từ ĐÍCH lấy từ dữ liệu bài (đáp án đúng, câu đã xếp đúng, gợi ý đáp án, tên tiêu chí), cắt 30 ký tự; không bao giờ gửi chữ bé viết.
- `dung` = đúng ngay lần đầu (vòng / thẻ không có lần chọn sai nào; Luyện tập: bấm "Giống rồi" ngay).
- `mang`: trò chơi và Luyện tập → `ngu-phap`; chấm viết → `viet`.
- `loi` khi sai: xếp câu → `trat-tu`; chọn tranh / chạm từ / xếp giỏ (chọn sai từ loại, thành phần) → `ngu-phap`; viết: viết hoa, dấu câu → `chinh-ta`, thiếu số câu → `khac`, thiếu từ / cấu trúc bài yêu cầu → `ngu-phap`. Luyện tập do bé tự đối chiếu nên không ghi loại lỗi. Tiêu chí `mem` (máy chưa chắc) không gửi. Góc này không có ô gõ để so chữ nên chưa dùng `TTV.loaiLoi`.
