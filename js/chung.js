/* Dùng chung cho trang chủ và trang bài của góc Ngữ pháp tiếng Việt.
   Khoá lưu sao (MỚI, không đổi tên sau khi đã đưa lên): "nguphap:baiN" → { sao: { khoiDong, khamPha, luyenTap, vanDung } } */
(function () {
  "use strict";
  var BUOC = ["khoiDong", "khamPha", "luyenTap", "vanDung"];
  function khoa(so) { return "nguphap:bai" + so; }
  function doc(so) {
    try { var s = localStorage.getItem(khoa(so)); var v = s ? JSON.parse(s) : null; return v && typeof v === "object" ? v : { sao: {} }; }
    catch (e) { return { sao: {} }; }
  }
  function ghi(so, v) { try { localStorage.setItem(khoa(so), JSON.stringify(v)); } catch (e) {} }
  function soSao(so) { var s = doc(so).sao || {}; return BUOC.filter(function (b) { return s[b]; }).length; }
  function tao(the, lop, chu) { var el = document.createElement(the); if (lop) el.className = lop; if (chu != null) el.textContent = chu; return el; }
  function nfc(s) { return String(s == null ? "" : s).normalize("NFC"); }
  function bai(so) { return (window.NGU_PHAP.bai || []).filter(function (b) { return b.so === so; })[0] || null; }
  function chuong(id) { return (window.NGU_PHAP.chuong || []).filter(function (c) { return c.id === id; })[0] || null; }
  function anhBai(b) { var c = chuong(b.chuong); return "assets/tranh/" + (b.anh || (c && c.anh) || "bia-tap-1") + ".jpg"; }
  // Ảnh Trâu Con chính thức của bộ mẫu chung (không vẽ lại, không kéo méo).
  function trau(ten) { return "https://mau.cvcec.org/assets/" + ten; }
  window.NP = { BUOC: BUOC, doc: doc, ghi: ghi, soSao: soSao, tao: tao, nfc: nfc, bai: bai, chuong: chuong, anhBai: anhBai, trau: trau };
})();
