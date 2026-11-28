#!/usr/bin/env node
/* Danh sách câu cần đọc cho góc Ngữ pháp (giong-ai/can-doc.tsv) – dùng cho robot giọng đọc AI (tools/giong_ai.py)
   hoặc cho người thu tay. Chạy lại sau khi sửa data/bai-hoc.js:  node tools/tao-can-doc.js
   Mỗi bài (audio/bai-N/):
     ten.mp3            "Bài N. <tên bài>."
     cau-hoi.mp3        câu hỏi mở đầu (Khởi động)
     kpK-ten.mp3        tên thẻ Khám phá K (1–4)
     kpK-hH.mp3         hàng ví dụ H của thẻ K (có cột: đọc liền thành câu; không có cột: đọc từng mục, ngắt bằng dấu phẩy)
     kpK-gG.mp3         lời giải thích G của thẻ K
     ltK-hoi.mp3 / ltK-dap.mp3   câu hỏi và gợi ý đáp án Luyện tập K (1–3)
     van-dung.mp3       đề Vận dụng
   Không đọc: gợi ý cho cha mẹ & thầy cô (goiY), phần tiếng Anh.
   Trang bài có nút Nghe cho từng câu; nút chỉ hiện khi tệp đã có. Giữ tên tệp khớp với hàm nghe() trong bai.html. */
"use strict";
var fs = require("fs"), path = require("path");
var GOC = path.join(__dirname, "..");
global.window = {};
require(path.join(GOC, "data/bai-hoc.js"));
var BAI = window.NGU_PHAP.bai;

var sach = function (s) { return String(s == null ? "" : s).replace(/[\t\n]+/g, " ").replace(/\s+/g, " ").trim(); };
var cham = function (s) { s = sach(s); return s && !/[.!?…:;”"]$/.test(s) ? s + "." : s; };
var dong = ["tep\tchu\tnhom\tcach"];
function them(bai, ten, chu) { chu = sach(chu); if (chu) dong.push("audio/bai-" + bai.so + "/" + ten + ".mp3\t" + chu + "\tbai-" + bai.so + "\t"); }

BAI.forEach(function (b) {
  them(b, "ten", "Bài " + b.so + ". " + cham(b.ten));
  them(b, "cau-hoi", b.cauHoi);
  (b.khamPha || []).forEach(function (k, i) {
    var K = "kp" + (i + 1);
    them(b, K + "-ten", cham(k.ten));
    var coCot = (k.cot || []).length > 0;
    (k.hang || []).forEach(function (h, j) {
      var o = (h || []).map(sach).filter(Boolean);
      if (o.length) them(b, K + "-h" + (j + 1), cham(o.join(coCot ? " " : ", ")));
    });
    (k.giai || []).forEach(function (g, j) { them(b, K + "-g" + (j + 1), g); });
  });
  (b.luyenTap || []).forEach(function (l, i) {
    them(b, "lt" + (i + 1) + "-hoi", l.hoi);
    them(b, "lt" + (i + 1) + "-dap", l.dap);
  });
  them(b, "van-dung", b.vanDung);
});

fs.mkdirSync(path.join(GOC, "giong-ai"), { recursive: true });
fs.writeFileSync(path.join(GOC, "giong-ai/can-doc.tsv"), dong.join("\n") + "\n");
console.log("Đã ghi giong-ai/can-doc.tsv: " + (dong.length - 1) + " câu cho " + BAI.length + " bài.");
