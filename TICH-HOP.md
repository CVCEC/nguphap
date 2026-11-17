# Gắn góc "Ngữ pháp tiếng Việt" vào hệ sinh thái (đã làm 16-11-2026)

## 1. Bộ mẫu chung – CVCEC/mau-chung, `v1/cvcec-chung.js`, thêm vào `TTV_DANH_SACH` (sau mục "cuocsong")

```js
    { id: "nguphap", ten_vi: "Ngữ pháp tiếng Việt", ten_en: "Vietnamese Grammar", ngan_vi: "Ngữ pháp", ngan_en: "Grammar",
      mo_ta_vi: "Từ, cụm từ, câu và hội thoại: 37 bài nâng cao", mo_ta_en: "Words, phrases, sentences and conversation: 37 advanced lessons",
      url: "https://nguphap.cvcec.org/", mau: "#5868D0", mau_dam: "#2F3D96", mau_nhat: "#E6E9FA", trau: "trau-thinking.png" },
```

## 2. Cổng – CVCEC/cong-truong-tieng-viet, `chung/gioi-thieu-goc.js`, thêm vào `window.CONG_GT`

```js
  nguphap: {
    gioiThieu: { vi: "Nâng cao, dành cho các bạn đã đọc được câu ngắn: 37 bài ngữ pháp từ tiếng, từ, cụm từ đến câu và hội thoại. Mỗi bài 4 bước: Khởi động, Khám phá, Luyện tập, Vận dụng.", en: "Advanced, for children who can read short sentences: 37 grammar lessons from syllables and words to phrases, sentences and conversation. Each lesson has 4 steps: Warm-up, Discover, Practise, Apply." },
    buoc: [
      { e: "🌱", vi: "Khởi động: một câu hỏi vui và bức tranh", en: "Warm-up: a fun question and a picture" },
      { e: "🔍", vi: "Khám phá 4 thẻ ví dụ", en: "Discover 4 example cards" },
      { e: "✏️", vi: "Luyện tập 3 câu, tự đối chiếu gợi ý", en: "Practise 3 questions and check the hints" },
      { e: "🗣️", vi: "Vận dụng: nói, viết về cuộc sống của em", en: "Apply: speak or write about your own life" },
      { e: "⭐", vi: "Mỗi bước 1 sao, đủ 4 sao là xong bài", en: "1 star per step, 4 stars to finish a lesson" }
    ],
    tongQuan: [
      { so: "37", vi: "bài học", en: "lessons" },
      { so: "3", vi: "phần: Tập 1, Tập 2, Hiểu ý trong hội thoại", en: "parts: Part 1, Part 2, Understanding conversation" },
      { so: "8", vi: "chủ đề", en: "topics" }
    ],
    phan: [
      { vi: "Tập 1 (Bài 1–16): từ và từ loại", en: "Part 1 (Lessons 1–16): words and word classes" },
      { vi: "Tập 2 (Bài 17–34): cụm từ và câu", en: "Part 2 (Lessons 17–34): phrases and sentences" },
      { vi: "Bài 35–37: hiểu ý trong hội thoại", en: "Lessons 35–37: understanding meaning in conversation" }
    ],
    vaoThang: true, // trang chủ đã có Mục tiêu, Học xong, Tổng quan, Hướng dẫn
    thu: { url: "https://nguphap.cvcec.org/bai.html#bai-1", duong: ["/", "/bai.html"], baiThu: "bai-1", ten: { vi: "Bài 1: Ngữ pháp quanh em", en: "Lesson 1: Grammar all around us" } }
  },
```

## 3. DNS
Thêm CNAME `nguphap` → `cvcec.github.io` tại Nhân Hòa; bật GitHub Pages cho kho CVCEC/nguphap (nhánh main, thư mục gốc).
