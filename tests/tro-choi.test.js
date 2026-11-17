// Kiểm tra dữ liệu trò chơi và tiêu chí chấm của 37 bài: node tests/tro-choi.test.js
const assert = require("assert");
global.window = {};
require("../data/bai-hoc.js"); require("../data/tro-choi.js");
const CV = require("../js/cham-viet.js");
const T = window.NP_TRO_CHOI, D = window.NGU_PHAP;
const DAU = /^[.,!?…:;]$/;
let loi = [], soTro = 0, soVong = 0;
const LOAI = ["chonTranh", "xepCau", "chamTu", "phanLoai"];
for (const b of D.bai) {
  const t = T[b.so];
  if (!t) { loi.push("Bài " + b.so + ": chưa có trò chơi"); continue; }
  if (!t.troChoi || t.troChoi.length < 3) loi.push("Bài " + b.so + ": ít hơn 3 trò");
  t.troChoi.forEach((tc, j) => {
    soTro++;
    const ten = "Bài " + b.so + " trò " + (j + 1) + " (" + tc.ten + ")";
    if (!LOAI.includes(tc.loai)) loi.push(ten + ": loại lạ " + tc.loai);
    if (tc.loai === "phanLoai") {
      soVong++;
      tc.the.forEach(x => { if (!(x.gio >= 0 && x.gio < tc.gio.length)) loi.push(ten + ": thẻ " + x.chu + " sai giỏ"); });
      tc.gio.forEach((g, k) => { if (!tc.the.some(x => x.gio === k)) loi.push(ten + ": giỏ " + g.ten + " trống"); });
      return;
    }
    (tc.vong || []).forEach((v, k) => {
      soVong++;
      const tv = ten + " vòng " + (k + 1);
      if (tc.loai === "chonTranh") {
        const n = v.lua.filter(l => l.dung).length;
        if (n !== 1) loi.push(tv + ": cần đúng 1 đáp án, có " + n);
        if (!v.cau && !v.hoi) loi.push(tv + ": không có câu hỏi");
        const chu = v.lua.map(l => JSON.stringify(l.tranh)); if (new Set(chu).size !== chu.length) loi.push(tv + ": lựa chọn trùng nhau");
      }
      if (tc.loai === "xepCau") {
        const a = v.the.join(" ").split(/\s+/).sort().join(" "), c = v.dung.split(/\s+/).sort().join(" ");
        if (a !== c) loi.push(tv + ": thẻ không ghép được thành đáp án (" + v.dung + ")");
        if (v.the.join(" ") === v.dung) loi.push(tv + ": thẻ đang xếp sẵn đúng thứ tự");
      }
      if (tc.loai === "chamTu") {
        if (!v.dung.length) loi.push(tv + ": không có phần đúng");
        v.dung.forEach(i => { if (!(i >= 0 && i < v.cau.length) || DAU.test(v.cau[i])) loi.push(tv + ": chỉ số đúng " + i + " không hợp lệ"); });
      }
    });
  });
  // Bài mẫu phải được Trâu Con chấm 3 sao, không có mục "chưa chắc"
  const cv = t.chamViet;
  if (!cv) { loi.push("Bài " + b.so + ": chưa có tiêu chí chấm"); continue; }
  const r = CV.cham(cv.viDu, cv);
  if (r.sao !== 3) loi.push("Bài " + b.so + ": bài mẫu chỉ được " + r.sao + " sao – " + r.ketQua.filter(x => !x.dat).map(x => x.nhac).join(" | "));
  const hoi = r.ketQua.filter(x => x.hoi); if (hoi.length) loi.push("Bài " + b.so + ": bài mẫu còn mục chưa chắc – " + hoi.map(x => x.ten).join(", "));
  // Bài để trống thì không được sao
  assert.strictEqual(CV.cham("", cv).rong, true);
}
if (loi.length) { console.log(loi.join("\n")); process.exit(1); }
console.log("tro-choi: 37 bài, " + soTro + " trò, " + soVong + " vòng – đều hợp lệ; bài mẫu đều đạt 3 sao");
