/*!
 * tro-choi.js – Trò chơi có hình của góc Ngữ pháp tiếng Việt.
 * Bốn dạng: chonTranh (chọn tranh), xepCau (xếp thẻ thành câu), chamTu (chạm từ trong câu), phanLoai (xếp thẻ vào giỏ).
 * Chạm bằng sự kiện click (bàn phím dùng được); kéo thả thẻ ở phanLoai bằng Pointer Events.
 * Phản hồi theo bộ chữ chung: "Đúng rồi!" / "Thử lại nhé". Dữ liệu: data/tro-choi.js.
 */
(function () {
  "use strict";
  var tao = function (the, lop, chu) { var el = document.createElement(the); if (lop) el.className = lop; if (chu != null) el.textContent = chu; return el; };
  function nut(lop, chu, viec) { var b = tao("button", lop, chu); b.type = "button"; if (viec) b.addEventListener("click", viec); return b; }
  function nfc(s) { return String(s == null ? "" : s).normalize("NFC"); }
  function hoaDau(s) { s = nfc(s); return s.charAt(0).toUpperCase() + s.slice(1); }
  function rung(el) { el.classList.remove("rung"); void el.offsetWidth; el.classList.add("rung"); }

  /* Tranh "ai gọi ai": người bên trái nói "ơi!" về phía người bên phải */
  function tranhGoi(t) {
    var o = tao("div", "tc-goi"); o.setAttribute("aria-hidden", "true");
    function nguoi(h, nhan) { var n = tao("span", "tc-nguoi"); n.appendChild(tao("span", "tc-mat", h)); n.appendChild(tao("span", "tc-nhan", nhan)); return n; }
    o.appendChild(nguoi(t.tu, t.nhanTu));
    var g = tao("span", "tc-loi"); g.appendChild(tao("span", "tc-bong", "ơi!")); g.appendChild(tao("span", "tc-mui", "➜")); o.appendChild(g);
    o.appendChild(nguoi(t.den, t.nhanDen));
    return o;
  }
  function veTranh(t) {
    if (t.tu) return tranhGoi(t);
    if (t.chu) { // lựa chọn bằng chữ (có thể kèm hình nhỏ ở trên)
      var c = tao("div", "tc-lua-chu");
      if (t.hinh) c.appendChild(tao("span", "tc-lua-hinh", t.hinh)).setAttribute("aria-hidden", "true");
      c.appendChild(tao("span", "tc-lua-van", t.chu)); return c;
    }
    var o = tao("div", "tc-hinh", t.hinh || ""); o.setAttribute("aria-hidden", "true"); return o;
  }
  function veHoi(khung, v) { if (v.hoi) khung.appendChild(tao("p", "tc-hoi", v.hoi)); }
  function moTaTranh(t) { return t.tu ? t.nhanTu + " gọi " + t.nhanDen : (t.chu || ""); }

  // Đếm lượt đúng / sai của trò đang chơi (để gửi kết quả lên cổng khi xong trò)
  var dem = null;
  function phanHoi(o, dung, them) {
    if (dem) { if (dung) dem.dung++; else dem.sai++; }
    o.textContent = "";
    o.appendChild(tao("span", dung ? "ttv-nhan-dung" : "ttv-nhan-sai", dung ? "Đúng rồi!" : "Thử lại nhé"));
    if (them) o.appendChild(tao("span", "tc-them", them));
  }
  function chamVong(n, i) {
    var c = tao("div", "tc-vong"); c.setAttribute("aria-label", "Vòng " + (i + 1) + "/" + n);
    for (var k = 0; k < n; k++) c.appendChild(tao("span", k < i ? "da" : k === i ? "dang" : ""));
    return c;
  }

  /* ---------- 1. Chọn tranh ---------- */
  function chonTranh(khung, tc, xongTro) {
    var i = 0;
    function ve() {
      khung.textContent = "";
      var v = tc.vong[i], daXong = false;
      khung.appendChild(chamVong(tc.vong.length, i));
      veHoi(khung, v);
      if (v.hinh) khung.appendChild(tao("div", "tc-hinh", v.hinh)).setAttribute("aria-hidden", "true");
      if (v.cau) khung.appendChild(tao("p", "tc-cau", v.cau));
      var luoi = tao("div", "tc-luoi-tranh" + (v.lua.length > 2 ? " ba" : "")), ph = tao("div", "tc-phan-hoi"); ph.setAttribute("aria-live", "polite");
      v.lua.forEach(function (l, j) {
        var b = nut("tc-tranh", null, function () {
          if (daXong) return;
          if (l.dung) {
            daXong = true; b.classList.add("dung"); phanHoi(ph, true);
            setTimeout(function () { i++; if (i < tc.vong.length) ve(); else xongTro(); }, 900);
          } else { b.classList.add("sai"); rung(b); phanHoi(ph, false, l.nhac || tc.nhac || "Các bạn đọc lại câu rồi chọn lại nhé."); }
        });
        b.setAttribute("aria-label", (l.tranh.chu ? "" : "Tranh " + (j + 1) + ": ") + moTaTranh(l.tranh));
        b.appendChild(veTranh(l.tranh)); luoi.appendChild(b);
      });
      khung.appendChild(luoi); khung.appendChild(ph);
    }
    ve();
  }

  /* ---------- 2. Xếp thẻ thành câu ---------- */
  function xepCau(khung, tc, xongTro) {
    var i = 0;
    function ve() {
      khung.textContent = "";
      var v = tc.vong[i], o = [], daXong = false;
      khung.appendChild(chamVong(tc.vong.length, i));
      veHoi(khung, v);
      if (v.tranh) { var tr = tao("div", "tc-tranh-de"); tr.appendChild(veTranh(v.tranh)); khung.appendChild(tr); }
      var dai = v.the.some(function (t) { return t.length > 16; }); // thẻ là cả câu: xếp thành cột cho dễ đọc
      var hang = tao("div", "tc-o-hang" + (dai ? " doc" : "")), kho = tao("div", "tc-the-hang" + (dai ? " doc" : "")), ph = tao("div", "tc-phan-hoi"); ph.setAttribute("aria-live", "polite");
      var oTrong = v.the.map(function (_, k) { var s = nut("tc-o", "", function () { traVe(k); }); s.setAttribute("aria-label", "Ô " + (k + 1) + " còn trống"); hang.appendChild(s); return s; });
      var the = v.the.map(function (chu, k) { var b = nut("tc-the", chu, function () { datVao(k); }); kho.appendChild(b); return b; });
      function datVao(k) {
        if (daXong || the[k].disabled) return;
        var cho = o.indexOf(undefined); if (cho < 0) cho = o.length; if (cho >= oTrong.length) return;
        o[cho] = k; the[k].disabled = true; the[k].classList.add("da-dat");
        oTrong[cho].textContent = v.the[k]; oTrong[cho].classList.add("co"); oTrong[cho].setAttribute("aria-label", "Ô " + (cho + 1) + ": " + v.the[k] + ". Chạm để bỏ ra");
        if (o.filter(function (x) { return x !== undefined; }).length === oTrong.length) kiem();
      }
      function traVe(cho) {
        if (daXong || o[cho] === undefined) return;
        var k = o[cho]; o[cho] = undefined; the[k].disabled = false; the[k].classList.remove("da-dat");
        oTrong[cho].textContent = ""; oTrong[cho].classList.remove("co", "sai"); oTrong[cho].setAttribute("aria-label", "Ô " + (cho + 1) + " còn trống");
        ph.textContent = "";
      }
      function kiem() {
        var cau = o.map(function (k) { return v.the[k]; }).join(" ");
        if (nfc(cau) === nfc(v.dung)) {
          daXong = true; oTrong.forEach(function (s) { s.classList.add("dung"); });
          var hoan = v.hien || hoaDau(v.dung); if (!/[.!?…]$/.test(hoan)) hoan += ".";
          phanHoi(ph, true, hoan);
          setTimeout(function () { i++; if (i < tc.vong.length) ve(); else xongTro(); }, 1300);
        } else { oTrong.forEach(function (s) { s.classList.add("sai"); }); rung(hang); phanHoi(ph, false, "Chạm vào ô để bỏ thẻ ra, rồi xếp lại nhé."); }
      }
      khung.appendChild(hang); khung.appendChild(kho); khung.appendChild(ph);
    }
    ve();
  }

  /* ---------- 3. Chạm từ trong câu ---------- */
  function chamTu(khung, tc, xongTro) {
    var i = 0;
    function ve() {
      khung.textContent = "";
      var v = tc.vong[i], daXong = false;
      khung.appendChild(chamVong(tc.vong.length, i));
      veHoi(khung, v);
      if (v.hinh) khung.appendChild(tao("div", "tc-hinh", v.hinh)).setAttribute("aria-hidden", "true");
      var cau = tao("p", "tc-cau tc-cau-tu"), ph = tao("div", "tc-phan-hoi"); ph.setAttribute("aria-live", "polite");
      v.cau.forEach(function (t, k) {
        if (/^[.,!?…:;]$/.test(t)) { cau.appendChild(tao("span", "tc-dau", t)); return; }
        var b = nut("tc-tu", t, function () {
          if (daXong) return;
          if (v.dung.indexOf(k) >= 0) {
            daXong = true; b.classList.add("dung"); phanHoi(ph, true);
            setTimeout(function () { i++; if (i < tc.vong.length) ve(); else xongTro(); }, 900);
          } else { b.classList.add("sai"); rung(b); phanHoi(ph, false, tc.nhac || ""); }
        });
        cau.appendChild(b);
      });
      khung.appendChild(cau); khung.appendChild(ph);
    }
    ve();
  }

  /* ---------- 4. Xếp thẻ vào giỏ (chạm hoặc kéo thả) ---------- */
  function phanLoai(khung, tc, xongTro) {
    khung.textContent = "";
    var chon = null, conLai = tc.the.length;
    var kho = tao("div", "tc-the-hang"), hangGio = tao("div", "tc-gio-hang"), ph = tao("div", "tc-phan-hoi"); ph.setAttribute("aria-live", "polite");
    var gio = tc.gio.map(function (g, j) {
      var b = nut("tc-gio", null, function () { if (chon) tha(chon, j); });
      b.appendChild(tao("span", "tc-gio-hinh", g.hinh || "🧺")); b.appendChild(tao("span", "tc-gio-ten", g.ten));
      var trong = tao("span", "tc-gio-trong"); b.appendChild(trong); b._trong = trong;
      b.setAttribute("aria-label", "Giỏ: " + g.ten); hangGio.appendChild(b); return b;
    });
    function boChon() { if (chon) { chon.el.setAttribute("aria-pressed", "false"); chon = null; } }
    function tha(c, j) {
      if (c.the.gio === j) {
        c.el.remove(); var nho = tao("span", "tc-the-nho", c.the.chu); gio[j]._trong.appendChild(nho);
        gio[j].classList.add("vui"); setTimeout(function () { gio[j].classList.remove("vui"); }, 400);
        chon = null; conLai--; phanHoi(ph, true);
        if (!conLai) setTimeout(xongTro, 900);
      } else { rung(c.el); rung(gio[j]); boChon(); phanHoi(ph, false, "“" + c.the.chu + "” không thuộc giỏ này."); }
    }
    tc.the.forEach(function (t) {
      var b = nut("tc-the keo-duoc", t.chu); b.setAttribute("aria-pressed", "false");
      var c = { the: t, el: b };
      b.addEventListener("click", function () { if (b._vuaKeo) { b._vuaKeo = false; return; } var dang = chon === c; boChon(); if (!dang) { chon = c; b.setAttribute("aria-pressed", "true"); } });
      // Kéo thả bằng Pointer Events
      var keo = null;
      b.addEventListener("pointerdown", function (e) {
        if (e.button !== undefined && e.button !== 0) return;
        keo = { x: e.clientX, y: e.clientY, di: false };
        try { b.setPointerCapture(e.pointerId); } catch (er) {}
      });
      b.addEventListener("pointermove", function (e) {
        if (!keo) return;
        var dx = e.clientX - keo.x, dy = e.clientY - keo.y;
        if (!keo.di && Math.abs(dx) + Math.abs(dy) > 8) { keo.di = true; b.classList.add("dang-keo"); }
        if (keo.di) { b.style.transform = "translate(" + dx + "px," + dy + "px)"; e.preventDefault(); }
      });
      function thoi(e) {
        if (!keo) return;
        var di = keo.di; keo = null; b.classList.remove("dang-keo"); b.style.transform = "";
        if (!di) return;
        b._vuaKeo = true; setTimeout(function () { b._vuaKeo = false; }, 50);
        b.style.visibility = "hidden"; // để tìm giỏ nằm dưới ngón tay, không phải chính thẻ
        var duoi = document.elementFromPoint(e.clientX, e.clientY), j = -1;
        b.style.visibility = "";
        gio.forEach(function (g, k) { if (g === duoi || g.contains(duoi)) j = k; });
        if (j >= 0) tha(c, j);
      }
      b.addEventListener("pointerup", thoi); b.addEventListener("pointercancel", function () { keo = null; b.classList.remove("dang-keo"); b.style.transform = ""; });
      kho.appendChild(b);
    });
    khung.appendChild(kho); khung.appendChild(hangGio); khung.appendChild(ph);
  }

  var LOAI = { chonTranh: chonTranh, xepCau: xepCau, chamTu: chamTu, phanLoai: phanLoai };
  var HUONG_DAN = {
    chonTranh: "Các bạn đọc kĩ rồi chạm vào lựa chọn đúng nhé.",
    xepCau: "Chạm vào các thẻ theo thứ tự đúng. Chạm vào ô để bỏ thẻ ra.",
    chamTu: "Chạm vào phần đúng trong câu nhé.",
    phanLoai: "Chạm vào một thẻ, rồi chạm vào giỏ đúng. Các bạn cũng có thể kéo thẻ thả vào giỏ."
  };
  var BIEU = { chonTranh: "🖼️", xepCau: "🧩", chamTu: "👆", phanLoai: "🧺" };

  /** Vẽ chuỗi trò chơi vào khung. tuyChon.xong() khi xong trò cuối.
   *  tuyChon.xongTro(j, { dung, sai, giay }) mỗi lần chơi xong trò thứ j (0, 1, 2…), kể cả khi chơi lại. */
  function ve(khung, ds, tuyChon) {
    var j = 0;
    function moTro() {
      khung.textContent = "";
      var tc = ds[j], the = tao("div", "np-the vien-goc tc-the-tro");
      var dau = tao("div", "np-the-dem");
      dau.appendChild(tao("span", "np-chip-bai", "Trò chơi " + (j + 1) + "/" + ds.length));
      var cham = tao("div", "np-cham"); cham.setAttribute("aria-hidden", "true");
      ds.forEach(function (_, k) { cham.appendChild(tao("span", k === j ? "dang" : k < j ? "da" : "")); });
      dau.appendChild(cham); the.appendChild(dau);
      var h = tao("h2"); h.appendChild(tao("span", "tc-bieu", BIEU[tc.loai] || "🎮")); h.appendChild(document.createTextNode(" " + tc.ten)); the.appendChild(h);
      the.appendChild(tao("p", "tc-huong-dan", tc.huongDan || HUONG_DAN[tc.loai]));
      var choi = tao("div", "tc-choi"); the.appendChild(choi);
      khung.appendChild(the);
      var luot = { dung: 0, sai: 0, batDau: Date.now() }; dem = luot;
      LOAI[tc.loai](choi, tc, function () {
        if (dem === luot) dem = null;
        if (tuyChon && tuyChon.xongTro) { try { tuyChon.xongTro(j, { dung: luot.dung, sai: luot.sai, giay: Math.round((Date.now() - luot.batDau) / 1000) }); } catch (e) {} }
        choi.textContent = "";
        var xong = tao("div", "tc-xong");
        xong.appendChild(tao("span", "ttv-nhan-dung", "Đúng rồi!"));
        xong.appendChild(tao("p", null, j < ds.length - 1 ? "Các bạn xong trò “" + tc.ten + "” rồi!" : "Các bạn đã chơi xong cả " + ds.length + " trò. Giỏi quá!"));
        var hang = tao("div", "np-dieu-huong");
        hang.appendChild(nut("ttv-nut-phu", "↺ Chơi lại", function () { moTro(); }));
        if (j < ds.length - 1) hang.appendChild(nut("ttv-nut phai", "Trò tiếp ›", function () { j++; moTro(); }));
        else if (tuyChon && tuyChon.xong) tuyChon.xong(hang);
        xong.appendChild(hang); choi.appendChild(xong);
      });
    }
    moTro();
  }
  window.NPTroChoi = { ve: ve };
})();
