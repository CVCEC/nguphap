/*!
 * cham-viet.js – Trâu Con chấm bài viết ở bước Vận dụng (góc Ngữ pháp tiếng Việt).
 * Chấm trên máy, không gửi bài đi đâu. Chỉ chấm những điều máy kiểm tra được chắc chắn:
 * số câu, viết hoa đầu câu, dấu câu cuối câu, có dùng đúng từ bài yêu cầu.
 * Ý câu, chính tả, cách dùng từ để cha mẹ / thầy cô chấm thêm (mục "nguoiLon" trong dữ liệu).
 * Dùng trong trình duyệt (window.NPChamViet) và trong Node (kiểm thử).
 */
(function (goc, tao) {
  if (typeof module === "object" && module.exports) module.exports = tao();
  else goc.NPChamViet = tao();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function nfc(s) { return String(s == null ? "" : s).normalize("NFC"); }
  var CHU = /[\p{L}\p{N}]/u;

  /** Tách đoạn viết thành câu: dấu . ! ? … hoặc xuống dòng kết thúc một câu. */
  function tachCau(van) {
    var ds = [];
    nfc(van).split(/\n+/).forEach(function (dong) {
      var m = dong.match(/[^.!?…]+[.!?…]*/g) || [];
      m.forEach(function (c) { c = c.trim(); if (c && CHU.test(c)) ds.push(c); });
    });
    return ds;
  }
  function tu(cau) { return (nfc(cau).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []); }
  /** Câu có cụm từ không (so trọn tiếng, không phân biệt hoa thường). "#so" = chữ số 0–9. */
  function timTu(cau, ds) {
    var thap = " " + tu(cau).join(" ") + " ";
    for (var i = 0; i < ds.length; i++) {
      if (ds[i] === "#so") { var m = cau.match(/\d+/); if (m) return m[0]; continue; }
      var cum = tu(ds[i]).join(" ");
      if (cum && thap.indexOf(" " + cum + " ") >= 0) return cum;
    }
    return null;
  }
  function chuDau(cau) { var m = nfc(cau).match(/\p{L}/u); return m ? m[0] : ""; }
  function trich(cau) { var t = cau.length > 28 ? cau.slice(0, 26) + "…" : cau; return "“" + t + "”"; }

  var KIEM = {
    soCau: function (ds, k) {
      var n = k.it || 1;
      return ds.length >= n ? null : (ds.length === 0 ? "Các bạn chưa viết câu nào." : "Các bạn mới viết " + ds.length + " câu. Viết thêm cho đủ " + n + " câu nhé.");
    },
    vietHoa: function (ds) {
      for (var i = 0; i < ds.length; i++) {
        var c = chuDau(ds[i]);
        if (c && c === c.toLowerCase() && c !== c.toUpperCase()) return "Câu " + (i + 1) + " " + trich(ds[i]) + ": chữ đầu câu cần viết hoa.";
      }
      return null;
    },
    dauCau: function (ds) {
      for (var i = 0; i < ds.length; i++) if (!/[.!?…]$/.test(ds[i])) return "Câu " + (i + 1) + " " + trich(ds[i]) + " chưa có dấu câu ở cuối.";
      return null;
    },
    moiCauCo: function (ds, k) {
      var n = Math.min(ds.length, k.soCau || ds.length);
      for (var i = 0; i < n; i++) if (!timTu(ds[i], k.tu)) return "Câu " + (i + 1) + " " + trich(ds[i]) + " chưa có " + (k.thieu || "từ bài yêu cầu") + ".";
      return null;
    },
    khacNhau: function (ds, k) {
      if (ds.length < 2) return "Cần ít nhất hai câu để so sánh.";
      var a = timTu(ds[0], k.tu), b = timTu(ds[1], k.tu);
      if (!a || !b) return "Mỗi câu cần có một " + (k.thieu || "từ bài yêu cầu") + " để so sánh.";
      return a === b ? "Hai câu đang dùng cùng một từ “" + a + "”. Các bạn đổi ở một câu nhé." : null;
    },
    // Có dấu / kí tự (ví dụ "(" ")" hoặc "/"); moiCau: mỗi câu đều phải có
    coDau: function (ds, k) {
      if (k.it) { // đếm số lần xuất hiện của dấu đầu tiên trong cả bài
        var n = (ds.join(" ").split(k.dau[0]).length - 1);
        return n >= k.it ? null : "Bài viết mới có " + n + "/" + k.it + " " + (k.thieu || "dấu " + k.dau[0]) + ".";
      }
      var pham = k.moiCau ? ds : [ds.join(" ")];
      for (var i = 0; i < pham.length; i++) for (var j = 0; j < k.dau.length; j++) if (pham[i].indexOf(k.dau[j]) < 0)
        return (k.moiCau ? "Câu " + (i + 1) + " " + trich(pham[i]) + " chưa có " : "Bài viết chưa có ") + (k.thieu || "dấu " + k.dau.join(" ")) + ".";
      return null;
    },
    // Câu số k.cau (mặc định câu đầu) ngắn, không quá k.toiDa tiếng
    cauNgan: function (ds, k) {
      var c = ds[k.cau || 0]; if (!c) return null;
      return tu(c).length <= (k.toiDa || 6) ? null : "Câu " + ((k.cau || 0) + 1) + " " + trich(c) + " hơi dài. " + (k.thieu || "Câu này nên ngắn gọn.");
    },
    coTu: function (ds, k) {
      var pham = typeof k.cau === "number" ? (ds[k.cau] ? [ds[k.cau]] : []) : ds;
      var can = k.it || 1, thay = {};
      pham.forEach(function (c) { k.tu.forEach(function (t) { if (timTu(c, [t])) thay[t] = 1; }); });
      if (Object.keys(thay).length >= can) return null;
      var thieu = k.thieu || "“" + k.tu.slice(0, 4).join("”, “") + "”";
      if (can > 1) return "Trâu Con mới tìm thấy " + Object.keys(thay).length + "/" + can + " " + thieu + ".";
      return (typeof k.cau === "number" ? "Câu " + (k.cau + 1) + " chưa có " : "Bài viết chưa có ") + thieu + ".";
    }
  };

  /** Chấm một bài. cfg = { tuDong: [...] }. Trả { rong, cau, ketQua: [{ ten, dat, nhac }], soDat, tong, sao }. */
  function cham(van, cfg) {
    var ds = tachCau(van), ketQua = [];
    if (!ds.length) return { rong: true, cau: [], ketQua: [], soDat: 0, tong: (cfg.tuDong || []).length, sao: 0 };
    (cfg.tuDong || []).forEach(function (k) {
      var f = KIEM[k.loai], nhac = f ? f(ds, k) : null;
      // k.mem: tiêu chí máy chỉ đoán được (theo danh sách từ quen). Không tìm thấy thì nhắc nhẹ, không trừ điểm.
      if (nhac && k.mem) ketQua.push({ ten: k.ten, dat: true, hoi: true, nhac: nhac + " " + (k.memNhac || "Nếu em đã dùng từ khác, nhờ bố mẹ hoặc thầy cô xem giúp nhé.") });
      else ketQua.push({ ten: k.ten, dat: !nhac, nhac: nhac });
    });
    var soDat = ketQua.filter(function (r) { return r.dat; }).length, tong = ketQua.length;
    var sao = soDat === tong ? 3 : soDat >= tong - 1 ? 2 : 1;
    var soHoi = ketQua.filter(function (r) { return r.hoi; }).length;
    return { rong: false, cau: ds, ketQua: ketQua, soDat: soDat, tong: tong, sao: sao, soHoi: soHoi };
  }
  return { cham: cham, tachCau: tachCau, timTu: timTu };
});
