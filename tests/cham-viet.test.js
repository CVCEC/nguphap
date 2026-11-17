// Kiểm thử chấm bài viết: node tests/cham-viet.test.js
const assert = require("assert");
const CV = require("../js/cham-viet.js");
global.window = {}; require("../data/tro-choi.js");
const cfg = window.NP_TRO_CHOI[1].chamViet;
function kq(van) { return CV.cham(van, cfg); }
let r = kq("Em có một cái mũ đỏ. Mẹ em có ba cái mũ.");
assert.strictEqual(r.soDat, r.tong); assert.strictEqual(r.sao, 3);
r = kq("em có một cái mũ. Mẹ có ba cái mũ.");
assert.strictEqual(r.ketQua[1].dat, false); assert.match(r.ketQua[1].nhac, /Câu 1/);
r = kq("Em có một cái mũ. Mẹ có ba cái mũ");
assert.strictEqual(r.ketQua[2].dat, false); assert.match(r.ketQua[2].nhac, /Câu 2/);
r = kq("Em có ba cái mũ. Mẹ cũng có ba cái mũ.");
assert.strictEqual(r.ketQua[4].dat, false); assert.match(r.ketQua[4].nhac, /“ba”/);
r = kq("Em có cái mũ. Mẹ có ba cái mũ.");
assert.strictEqual(r.ketQua[3].dat, false);
r = kq("Em có 2 quyển vở.\nAnh có 5 quyển vở.");
assert.strictEqual(r.soDat, r.tong);
r = kq("Em có một quyển vở.");
assert.strictEqual(r.ketQua[0].dat, false); assert.strictEqual(r.sao, 1);
r = kq("   ");
assert.strictEqual(r.rong, true);
// "năm" không bị nhầm với "nằm"; NFD được chuẩn hoá
r = kq("Em có hai cái bút. Bạn có năm cái bút.".normalize("NFD"));
assert.strictEqual(r.soDat, r.tong);
console.log("cham-viet: tất cả kiểm thử đều đạt");
