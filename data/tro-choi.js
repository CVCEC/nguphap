/* Trò chơi có hình và tiêu chí chấm bài viết cho 37 bài Ngữ pháp.
   Tách riêng khỏi data/bai-hoc.js (nội dung lấy từ slide) để soạn thêm mà không đụng tới nội dung bài.

   troChoi: danh sách trò, mỗi trò có "loai":
     chonTranh – đọc rồi chạm vào lựa chọn đúng.   vong: [{ hoi, hinh, cau, lua: [{ tranh, dung }] }]
                 tranh kiểu "goi": { tu, nhanTu, den, nhanDen }; kiểu hình: { hinh }; kiểu chữ: { chu, hinh }
     xepCau    – chạm thẻ theo thứ tự.             vong: [{ hoi, tranh, the: [...], dung: "...", hien }]
     chamTu    – chạm vào phần đúng trong câu.      vong: [{ hoi, hinh, cau: [phần/dấu], dung: [chỉ số] }]
     phanLoai  – chạm thẻ rồi chạm giỏ (hoặc kéo thả). gio: [{ ten, hinh }], the: [{ chu, gio }]

   chamViet: tiêu chí Trâu Con tự chấm (js/cham-viet.js) và phần cha mẹ / thầy cô chấm thêm.
     tuDong: [{ loai: soCau | vietHoa | dauCau | moiCauCo | khacNhau | coTu | coDau | cauNgan, ... }]
     mem: true – máy chỉ đoán theo danh sách từ quen; không thấy thì nhắc nhẹ, không trừ sao.
     nguoiLon: [các ý người lớn đọc và đánh dấu] */
(function () {
  "use strict";
  var SO_LUONG = ["một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười", "mươi", "trăm", "nghìn", "vài", "mấy", "nhiều", "những", "các", "#so"];
  var LAY = ["tí tách", "lộp độp", "rì rào", "ào ào", "vi vu", "hiu hiu", "lất phất", "lác đác", "lung linh", "lấp lánh", "long lanh",
    "xanh xanh", "đều đều", "lạnh lẽo", "lành lạnh", "ấm áp", "mát mẻ", "man mát", "nhè nhẹ", "xào xạc", "róc rách", "âm ấm",
    "ầm ầm", "rả rích", "lấm tấm", "lung lay", "lim dim", "mênh mông", "nhẹ nhàng", "vui vẻ", "chăm chỉ", "sạch sẽ", "gọn gàng",
    "xinh xắn", "đỏ đỏ", "trắng trắng"];
  var PHO_TU = ["đang", "sẽ", "đã", "chưa", "rất", "lắm", "vẫn", "cũng", "hơi", "quá", "không", "còn", "từng", "mới"];
  var TIEU_TU = ["ạ", "nhé", "à", "nha", "ơi", "chính", "đấy", "nhỉ", "cơ", "mà"];
  var CT = "Viết đúng chính tả, đúng dấu thanh";
  var TN = "Câu rõ ý, đọc lên tự nhiên";

  /* ---------- Hàm soạn nhanh ---------- */
  function coBan(n) {
    return [
      { loai: "soCau", it: n, ten: n > 1 ? "Có ít nhất " + n + " câu" : "Có ít nhất một câu hoàn chỉnh" },
      { loai: "vietHoa", ten: "Chữ đầu mỗi câu viết hoa" },
      { loai: "dauCau", ten: "Cuối mỗi câu có dấu câu (. ? !)" }
    ];
  }
  function viet(loiDan, viDu, n, them, nguoiLon) {
    return { loiDan: loiDan, viDu: viDu, tuDong: coBan(n).concat(them || []), nguoiLon: nguoiLon };
  }
  function coTu(tu, ten, thieu, them) {
    var k = { loai: "coTu", tu: tu, ten: ten, thieu: thieu };
    for (var x in them || {}) k[x] = them[x];
    return k;
  }
  /** Lựa chọn bằng chữ: ds = các chữ, dung = chỉ số đúng, hinh = mảng hình (không bắt buộc) */
  function lua(ds, dung, hinh) { return ds.map(function (c, i) { return { tranh: { chu: c, hinh: hinh ? hinh[i] : "" }, dung: i === dung }; }); }
  function chon(hoi, cau, ds, dung, hinhLua, hinh) { return { hoi: hoi, cau: cau, hinh: hinh, lua: lua(ds, dung, hinhLua) }; }
  /** Câu chia phần bằng "|"; dung = các chỉ số phần đúng */
  function cham(hoi, cau, dung, hinh) { return { hoi: hoi, cau: cau.split("|"), dung: dung, hinh: hinh }; }
  function xep(hoi, the, dung, hinh, hien) { return { hoi: hoi, the: the, dung: dung, tranh: hinh ? { hinh: hinh } : null, hien: hien }; }
  function gio(ds) { return ds.map(function (g) { return { ten: g[0], hinh: g[1] }; }); }
  function the(ds) { return ds.map(function (t) { return { chu: t[0], gio: t[1] }; }); }
  function tro(loai, ten, du, them) { var o = { loai: loai, ten: ten }; for (var x in du) o[x] = du[x]; for (var y in them || {}) o[y] = them[y]; return o; }

  var T = {};

  /* ===================== TẬP 1 ===================== */
  T[1] = {
    troChoi: [
      tro("chonTranh", "Ai gọi ai?", { vong: [
        { cau: "Cháu gọi bà.", lua: [
          { tranh: { tu: "👦", nhanTu: "cháu", den: "👵", nhanDen: "bà" }, dung: true },
          { tranh: { tu: "👵", nhanTu: "bà", den: "👦", nhanDen: "cháu" } } ] },
        { cau: "Bà gọi cháu.", lua: [
          { tranh: { tu: "👦", nhanTu: "cháu", den: "👵", nhanDen: "bà" } },
          { tranh: { tu: "👵", nhanTu: "bà", den: "👦", nhanDen: "cháu" }, dung: true } ] },
        { cau: "Con gọi mẹ.", lua: [
          { tranh: { tu: "👩", nhanTu: "mẹ", den: "🧒", nhanDen: "con" } },
          { tranh: { tu: "🧒", nhanTu: "con", den: "👩", nhanDen: "mẹ" }, dung: true } ] }
      ] }, { huongDan: "Các bạn đọc câu, rồi chạm vào tranh đúng nhé.", nhac: "Các bạn xem ai đứng đầu câu, người đó là người gọi nhé." }),
      tro("xepCau", "Xếp thẻ thành câu", { vong: [
        { hoi: "Nhìn tranh, xếp thẻ cho đúng ai gọi ai:", tranh: { tu: "👦", nhanTu: "cháu", den: "👵", nhanDen: "bà" }, the: ["bà", "gọi", "cháu"], dung: "cháu gọi bà" },
        { hoi: "Nhìn tranh, xếp thẻ cho đúng ai gọi ai:", tranh: { tu: "👵", nhanTu: "bà", den: "👦", nhanDen: "cháu" }, the: ["cháu", "bà", "gọi"], dung: "bà gọi cháu" },
        xep("Xếp thẻ để chị là người mở cửa:", ["em", "cho", "mở cửa", "chị"], "chị mở cửa cho em", "🚪")
      ] }),
      tro("chamTu", "Từ nào cho biết số lượng?", { vong: [
        cham("Chạm vào từ cho biết có bao nhiêu đồ vật:", "Em|có|ba|cái|mũ|.", [2], "🧢🧢🧢"),
        cham("Chạm vào từ cho biết có bao nhiêu đồ vật:", "Bạn|mua|một|quyển|vở|.", [2], "📒"),
        cham("Chạm vào từ cho biết có bao nhiêu đồ vật:", "Trên|bàn|có|hai|cây|bút|.", [3], "✏️✏️")
      ] }),
      tro("phanLoai", "Xếp thẻ vào giỏ", {
        gio: gio([["Gọi tên đồ vật", "🎒"], ["Cho biết số lượng", "🔢"]]),
        the: the([["bút", 0], ["một", 1], ["vở", 0], ["ba", 1], ["thước", 0], ["hai", 1], ["mũ", 0]])
      })
    ],
    chamViet: viet("Các bạn viết lại hai câu vừa nói, rồi bấm “Trâu Con chấm bài” nhé.", "Em có một cái mũ đỏ. Mẹ em có ba cái mũ.", 2, [
      { loai: "moiCauCo", tu: SO_LUONG, soCau: 2, thieu: "từ chỉ số lượng", ten: "Mỗi câu có một từ chỉ số lượng (một, hai, ba…)" },
      { loai: "khacNhau", tu: SO_LUONG, thieu: "từ chỉ số lượng", ten: "Hai câu dùng hai số lượng khác nhau" }
    ], ["Hai câu nói về cùng một đồ vật", CT, TN])
  };

  T[2] = {
    troChoi: [
      tro("chonTranh", "Lúc nào?", { vong: [
        chon("Chọn từ đúng:", "Ngay lúc này, em ___ đọc sách.", ["đang", "sẽ", "chưa"], 0, null, "🕒"),
        chon("Chọn từ đúng:", "Tối mai, em ___ đọc sách.", ["chưa", "đang", "sẽ"], 2, null, "🌙"),
        chon("Chọn từ đúng:", "Đến giờ, em vẫn ___ đọc xong cuốn sách.", ["sẽ", "chưa", "đang"], 1, null, "📕")
      ] }),
      tro("chonTranh", "Kể hay hỏi?", { vong: [
        chon("Câu này là lời kể hay câu hỏi?", "Em về rồi?", ["Lời kể", "Câu hỏi"], 1, ["💬", "❓"]),
        chon("Câu này là lời kể hay câu hỏi?", "Mẹ chờ em.", ["Lời kể", "Câu hỏi"], 0, ["💬", "❓"]),
        chon("Câu này là lời kể hay câu hỏi?", "Em chờ mẹ?", ["Lời kể", "Câu hỏi"], 1, ["💬", "❓"])
      ] }, { nhac: "Các bạn nhìn dấu ở cuối câu nhé: dấu chấm hỏi là câu hỏi." }),
      tro("xepCau", "Ai chờ ai?", { vong: [
        xep("Xếp thẻ để mẹ là người chờ:", ["em", "chờ", "mẹ"], "mẹ chờ em"),
        xep("Xếp thẻ để em là người chờ:", ["mẹ", "em", "chờ"], "em chờ mẹ"),
        xep("Xếp thành câu nói việc sắp làm:", ["đọc sách", "em", "sẽ"], "em sẽ đọc sách")
      ] }),
      tro("phanLoai", "Tiếng, từ hay cụm từ?", {
        gio: gio([["Từ một tiếng", "1️⃣"], ["Từ hai tiếng", "2️⃣"], ["Cụm từ", "🧩"]]),
        the: the([["nhà", 0], ["học sinh", 1], ["hai học sinh", 2], ["bút", 0], ["thư viện", 1], ["đang đọc", 2]])
      })
    ],
    chamViet: viet("Các bạn viết hai câu về cùng một việc: câu đầu có “đang”, câu sau có “sẽ”.", "Em đang đọc truyện. Tối nay em sẽ đọc tiếp.", 2, [
      coTu(["đang"], "Câu đầu có “đang”", "“đang”", { cau: 0 }),
      coTu(["sẽ"], "Câu sau có “sẽ”", "“sẽ”", { cau: 1 })
    ], ["Hai câu nói về cùng một việc", CT, TN])
  };

  T[3] = {
    troChoi: [
      tro("phanLoai", "Xếp vào ba nhóm", {
        gio: gio([["Từ đơn", "🧱"], ["Ghép ngang hàng (đẳng lập)", "⚖️"], ["Ghép chính phụ", "🔎"]]),
        the: the([["nhà", 0], ["quần áo", 1], ["xe đạp", 2], ["mưa", 0], ["sách vở", 1], ["xe điện", 2], ["mũ", 0], ["bàn ghế", 1], ["áo mưa", 2]])
      }),
      tro("chamTu", "Phần nào chỉ loại rộng?", { vong: [
        cham("Chạm vào tiếng chỉ loại rộng:", "xe|buýt", [0], "🚌"),
        cham("Chạm vào tiếng chỉ loại rộng:", "áo|khoác", [0], "🧥"),
        cham("Chạm vào tiếng chỉ loại rộng:", "bút|chì", [0], "✏️")
      ] }),
      tro("chonTranh", "Cách gọi nào quen dùng?", { vong: [
        chon("Chọn cách gọi quen dùng:", "", ["ghế bàn", "bàn ghế"], 1, ["🪑", "🪑"]),
        chon("Chọn cách gọi quen dùng:", "", ["sách vở", "vở sách"], 0, ["📚", "📚"]),
        chon("Chọn cách gọi quen dùng:", "", ["bà ông", "ông bà"], 1, ["👴👵", "👴👵"])
      ] }),
      tro("xepCau", "Ghép tiếng thành từ", { vong: [
        xep("Xếp thành tên đồ vật trong hình:", ["đạp", "xe"], "xe đạp", "🚲", "Xe đạp"),
        xep("Xếp thành tên đồ vật trong hình:", ["khoác", "áo"], "áo khoác", "🧥", "Áo khoác"),
        xep("Xếp thành tên đồ vật trong hình:", ["máy", "xe"], "xe máy", "🛵", "Xe máy")
      ] })
    ],
    chamViet: viet("Các bạn viết vài câu kể những gì em thấy trên bàn học. Dùng ít nhất một từ ghép.", "Trên bàn học có sách vở, một hộp bút và đèn bàn.", 1, [
      coTu(["sách vở", "bút chì", "bút mực", "bút bi", "bút màu", "thước kẻ", "hộp bút", "cặp sách", "đèn bàn", "máy tính", "giấy màu", "bàn ghế",
        "sách giáo khoa", "khăn giấy", "bình nước", "đồng hồ", "bàn học", "bút sáp", "quả địa cầu", "giấy nháp"], "Có ít nhất một từ ghép",
        "từ ghép quen (ví dụ: sách vở, hộp bút…)", { mem: true })
    ], ["Kể được ba điều trên bàn học", "Giải thích được các tiếng trong từ ghép kết hợp thế nào", CT])
  };

  T[4] = {
    troChoi: [
      tro("chonTranh", "Lặp âm đầu, lặp vần hay lặp cả?", { vong: [
        chon("Từ láy này lặp phần nào?", "lung linh", ["Lặp âm đầu", "Lặp vần", "Lặp cả tiếng"], 0),
        chon("Từ láy này lặp phần nào?", "lác đác", ["Lặp âm đầu", "Lặp vần", "Lặp cả tiếng"], 1),
        chon("Từ láy này lặp phần nào?", "xanh xanh", ["Lặp âm đầu", "Lặp vần", "Lặp cả tiếng"], 2),
        chon("Từ láy này lặp phần nào?", "lấp lánh", ["Lặp âm đầu", "Lặp vần", "Lặp cả tiếng"], 0)
      ] }, { nhac: "Các bạn đọc chậm hai tiếng, xem phần nào giống nhau nhé." }),
      tro("chonTranh", "Từ láy gợi gì?", { vong: [
        chon("Chọn từ láy hợp với câu:", "Mưa rơi ___.", ["lung linh", "tí tách", "sạch sành sanh"], 1, null, "🌧️"),
        chon("Chọn từ láy hợp với câu:", "Ánh đèn ___.", ["lung linh", "vi vu", "tí tách"], 0, null, "💡"),
        chon("Chọn từ láy hợp với câu:", "Gió thổi ___.", ["lác đác", "sạch sành sanh", "vi vu"], 2, null, "🍃")
      ] }),
      tro("phanLoai", "Từ láy hay không?", {
        gio: gio([["Từ láy", "🎵"], ["Không phải từ láy", "🧱"]]),
        the: the([["lung linh", 0], ["sách vở", 1], ["tí tách", 0], ["xe đạp", 1], ["lác đác", 0], ["bàn ghế", 1], ["xanh xanh", 0], ["quần áo", 1]])
      })
    ],
    chamViet: viet("Các bạn viết hai câu tả thời tiết nơi em sống. Dùng hai từ láy.", "Mưa rơi tí tách trên mái nhà. Gió thổi lành lạnh.", 2, [
      coTu(LAY, "Dùng hai từ láy", "từ láy quen (ví dụ: tí tách, lung linh…)", { it: 2, mem: true })
    ], ["Hai câu tả đúng thời tiết nơi em sống", "Hai từ láy dùng hợp với câu", CT])
  };

  T[5] = {
    troChoi: [
      tro("chonTranh", "“Chân” nghĩa là gì?", { vong: [
        chon("“Chân” ở đây chỉ gì?", "Cái ghế này có bốn chân.", ["Bộ phận đỡ ghế", "Bàn chân của người"], 0, ["🪑", "🦶"]),
        chon("“Chân” ở đây chỉ gì?", "Nhà bà ở dưới chân núi.", ["Chân của người leo núi", "Phần dưới cùng của núi"], 1, ["🦶", "⛰️"]),
        chon("“Chân” ở đây chỉ gì?", "Em bị đau chân.", ["Chân của người", "Chân bàn"], 0, ["🦶", "🪑"])
      ] }),
      tro("phanLoai", "Nghĩa gốc hay nghĩa chuyển?", {
        gio: gio([["Bộ phận cơ thể (nghĩa gốc)", "🧍"], ["Nghĩa chuyển (vật, nơi chốn)", "🪑"]]),
        the: the([["đau chân", 0], ["chân bàn", 1], ["mắt em", 0], ["chân núi", 1], ["đầu bé", 0], ["mắt lưới", 1], ["đầu tàu", 1]])
      }),
      tro("chonTranh", "Nhà cửa hay cửa nhà?", { vong: [
        chon("Chọn cách nói đúng:", "Mẹ dọn dẹp ___ sạch sẽ.", ["nhà cửa", "cửa nhà"], 0, ["🏠", "🚪"]),
        chon("Chọn cách nói đúng:", "Bạn đứng chờ ở ___ em.", ["nhà cửa", "cửa nhà"], 1, ["🏠", "🚪"])
      ] })
    ],
    chamViet: viet("Các bạn chọn “đầu”, “mũi” hoặc “chân”, rồi viết hai câu dùng từ đó theo hai nghĩa.", "Em đội mũ lên đầu. Bạn Nam ngồi ở đầu bàn.", 2, [
      { loai: "moiCauCo", tu: ["đầu", "mũi", "chân"], soCau: 2, thieu: "từ “đầu”, “mũi” hoặc “chân”", ten: "Mỗi câu có “đầu”, “mũi” hoặc “chân”" }
    ], ["Hai câu dùng cùng một từ", "Hai câu dùng từ đó theo hai nghĩa khác nhau", CT])
  };

  T[6] = {
    troChoi: [
      tro("phanLoai", "Gốc Hán hay gốc châu Âu?", {
        gio: gio([["Có yếu tố gốc Hán", "📜"], ["Từ gốc châu Âu", "🌍"]]),
        the: the([["thủy sản", 0], ["cà phê", 1], ["hải sản", 0], ["búp bê", 1], ["sinh vật", 0], ["xà phòng", 1], ["giáo viên", 0], ["phô mai", 1]])
      }),
      tro("chonTranh", "Yếu tố gốc Hán nghĩa là gì?", { vong: [
        chon("“Thủy” trong “thủy sản” liên quan đến gì?", "", ["lửa", "nước", "cây"], 1, ["🔥", "💧", "🌳"]),
        chon("“Hải” trong “hải sản” liên quan đến gì?", "", ["biển", "núi", "trời"], 0, ["🌊", "⛰️", "☁️"]),
        chon("Cá, tôm, cua nuôi hay đánh bắt dưới nước gọi chung là gì?", "", ["búp bê", "ga", "thủy sản"], 2, null, "🐟🦐🦀")
      ] }),
      tro("chonTranh", "Ghép nguyên hay ghép rút?", { vong: [
        chon("Tên này được tạo thế nào?", "Vinamilk", ["Ghép rút: lấy một phần các tiếng", "Ghép nguyên: giữ cả chuỗi từ"], 0),
        chon("Tên này được tạo thế nào?", "Khai Trí Tiến Đức", ["Ghép rút: lấy một phần các tiếng", "Ghép nguyên: giữ cả chuỗi từ"], 1)
      ] })
    ],
    chamViet: viet("Các bạn ghi từ vay mượn người thân hay dùng, rồi đặt một câu tiếng Việt với từ đó.", "Bố em hay nói từ “cà phê”. Sáng nào bố cũng uống một ly cà phê.", 1, [
      coTu(["cà phê", "búp bê", "ga", "xà phòng", "phô mai", "sô cô la", "ô tô", "xe buýt", "ti vi", "pin", "va li", "bánh quy", "kem", "sơ mi",
        "cà vạt", "bơ", "xúc xích", "pa tê", "ba lô", "gara", "radio", "internet", "email", "taxi", "piano", "ghi ta", "pizza", "săng đan", "cà rốt"],
        "Có một từ vay mượn", "từ vay mượn quen (ví dụ: cà phê, xà phòng…)", { mem: true })
    ], ["Ghi đúng từ vay mượn người thân hay dùng", "Câu dùng từ đó đúng nghĩa", CT])
  };

  T[7] = {
    troChoi: [
      tro("phanLoai", "Sự vật, hoạt động hay đặc điểm?", {
        gio: gio([["Gọi tên sự vật", "📦"], ["Chỉ hoạt động", "🏃"], ["Chỉ đặc điểm", "🎨"]]),
        the: the([["truyện", 0], ["đọc", 1], ["đẹp", 2], ["áo", 0], ["chạy", 1], ["cao", 2], ["sách", 0], ["viết", 1], ["ấm", 2]])
      }),
      tro("chonTranh", "Từ nào đi cùng?", { vong: [
        chon("Từ nào ghép với “đang” tự nhiên nhất?", "đang ___", ["sách", "đọc", "cái"], 1),
        chon("Từ nào ghép với “một cuốn” tự nhiên nhất?", "một cuốn ___", ["truyện", "đọc", "rất"], 0),
        chon("Từ nào ghép với “rất” tự nhiên nhất?", "rất ___", ["sách", "đọc", "hay"], 2)
      ] }),
      tro("chamTu", "Từ làm gì trong câu?", { vong: [
        cham("Chạm vào từ nêu đặc điểm của cuốn truyện:", "Cuốn|truyện|này|hay|.", [3]),
        cham("Chạm vào từ chỉ hoạt động:", "Bạn|Mai|đọc|sách|.", [2]),
        cham("Chạm vào từ gọi tên sự vật:", "Chiếc|áo|này|đẹp|.", [1])
      ] })
    ],
    chamViet: viet("Các bạn viết một câu về buổi học, rồi viết thêm một câu giải thích từ loại của một từ trong câu.",
      "Hôm nay em đọc truyện ở lớp. Từ “đọc” là động từ vì nó chỉ hoạt động và đi được với “đang”.", 2, [
      coTu(["danh từ", "động từ", "tính từ", "sự vật", "hoạt động", "đặc điểm", "kết hợp"], "Có nhắc tên từ loại hoặc căn cứ",
        "tên từ loại hoặc căn cứ (danh từ, động từ, hoạt động…)", { mem: true })
    ], ["Câu đầu nói về buổi học", "Giải thích từ loại bằng đúng hai căn cứ", CT])
  };

  T[8] = {
    troChoi: [
      tro("phanLoai", "Danh từ riêng hay chung?", {
        gio: gio([["Danh từ riêng (tên riêng)", "🏷️"], ["Danh từ chung", "📚"]]),
        the: the([["Mai", 0], ["thư viện", 1], ["Montréal", 0], ["sách", 1], ["An", 0], ["thành phố", 1], ["Hà Nội", 0], ["bạn", 1]])
      }),
      tro("chonTranh", "Chọn từ chỉ đơn vị", { vong: [
        chon("Chọn từ đúng:", "ba ___ vở", ["con", "quyển", "ly"], 1, null, "📒📒📒"),
        chon("Chọn từ đúng:", "hai ___ mèo", ["con", "quyển", "cái"], 0, null, "🐈🐈"),
        chon("Chọn từ đúng:", "một ___ nước", ["con", "quyển", "ly"], 2, null, "🥛"),
        chon("Chọn từ đúng:", "một ___ mũ", ["con", "cái", "ly"], 1, null, "🧢")
      ] }),
      tro("chamTu", "Tìm phần trung tâm", { vong: [
        cham("Chạm vào phần trung tâm:", "hai|quyển vở|mới|ấy", [1], "📒📒"),
        cham("Chạm vào phần trung tâm:", "ba|con mèo|đen", [1], "🐈‍⬛🐈‍⬛🐈‍⬛"),
        cham("Chạm vào phần trung tâm:", "những|chiếc áo|này", [1], "👕👕")
      ] }),
      tro("phanLoai", "Nhìn thấy được hay không?", {
        gio: gio([["Vật nhìn, chạm được", "👀"], ["Điều nghĩ, cảm thấy", "💭"]]),
        the: the([["bàn", 0], ["niềm vui", 1], ["áo", 0], ["niềm tin", 1], ["ghế", 0], ["ước mơ", 1]])
      })
    ],
    chamViet: viet("Các bạn viết một câu nói tên, số lượng và một đặc điểm của một đồ vật trước mặt em.", "Em có hai quyển vở màu xanh.", 1, [
      { loai: "moiCauCo", tu: SO_LUONG, soCau: 1, thieu: "từ chỉ số lượng", ten: "Có từ chỉ số lượng" },
      coTu(["cái", "con", "quyển", "cuốn", "chiếc", "cây", "ly", "cốc", "tờ", "đôi", "bộ", "quả", "trái", "hộp", "tấm", "bức", "cặp", "lọ", "chai"],
        "Có từ chỉ đơn vị", "từ chỉ đơn vị (cái, con, quyển…)", { mem: true })
    ], ["Có nói một đặc điểm của đồ vật (màu, kích thước…)", "Từ chỉ đơn vị hợp với đồ vật", CT])
  };

  T[9] = {
    troChoi: [
      tro("chamTu", "Tìm động từ", { vong: [
        cham("Chạm vào một động từ:", "Nam|muốn|đọc|truyện|.", [1, 2]),
        cham("Chạm vào động từ:", "Em|mở|cửa|.", [1]),
        cham("Chạm vào động từ:", "Bé|ngủ|.", [1]),
        cham("Chạm vào một động từ:", "Em|bắt đầu|học|bài|.", [1, 2])
      ] }),
      tro("chonTranh", "Muốn, phải hay bắt đầu?", { vong: [
        chon("Chọn từ cho biết đó là việc bắt buộc:", "Em ___ về nhà trước sáu giờ.", ["muốn", "phải", "bắt đầu"], 1),
        chon("Chọn từ cho biết em mong làm việc đó:", "Em ___ đọc truyện cổ tích.", ["muốn", "phải", "bắt đầu"], 0),
        chon("Chọn từ cho biết việc học mới ở lúc đầu:", "Lớp em ___ học bài mới.", ["muốn", "phải", "bắt đầu"], 2)
      ] }),
      tro("chonTranh", "Hoạt động hướng tới cái gì?", { vong: [
        chon("Việc “mở” hướng tới cái gì?", "Mai mở cửa.", ["Mai", "cửa"], 1, ["👧", "🚪"]),
        chon("Việc “đọc” hướng tới cái gì?", "Em đọc truyện.", ["truyện", "em"], 0, ["📖", "🧒"]),
        chon("Việc “đá” hướng tới cái gì?", "Anh đá bóng.", ["anh", "bóng"], 1, ["👦", "⚽"])
      ] })
    ],
    chamViet: viet("Các bạn kể hai việc em làm buổi sáng: một câu có “đang”, một câu có “muốn”.", "Em đang đánh răng. Em muốn ăn bánh mì.", 2, [
      coTu(["đang"], "Có “đang”", "“đang”"),
      coTu(["muốn"], "Có “muốn”", "“muốn”")
    ], ["Kể đúng hai việc buổi sáng", CT, TN])
  };

  T[10] = {
    troChoi: [
      tro("chamTu", "Tìm tính từ", { vong: [
        cham("Chạm vào tính từ:", "Chiếc|khăn|này|mềm|.", [3], "🧣"),
        cham("Chạm vào tính từ:", "Phòng học|rất|rộng|.", [2], "🏫"),
        cham("Chạm vào tính từ:", "Bạn|Lan|chăm chỉ|.", [2], "📚")
      ] }),
      tro("xepCau", "Từ ít đến nhiều", { vong: [
        xep("Xếp từ lạnh ít đến lạnh nhiều:", ["rất lạnh", "hơi lạnh", "lạnh"], "hơi lạnh lạnh rất lạnh", "🥶", "hơi lạnh → lạnh → rất lạnh"),
        xep("Xếp từ nóng ít đến nóng nhiều:", ["nóng", "rất nóng", "hơi nóng"], "hơi nóng nóng rất nóng", "🥵", "hơi nóng → nóng → rất nóng")
      ] }),
      tro("chonTranh", "Cách nói nào tự nhiên?", { vong: [
        chon("Chọn cách nói tự nhiên:", "", ["rất đỏ au", "rất đỏ"], 1, ["🍅", "🍅"]),
        chon("Chọn cách nói tự nhiên:", "", ["trắng xóa", "rất trắng xóa"], 0, ["❄️", "❄️"]),
        chon("Chọn cách nói tự nhiên:", "", ["rất đen sì", "đen sì"], 1, ["⚫", "⚫"])
      ] }, { nhac: "“Đỏ au”, “trắng xóa”, “đen sì” đã có mức độ rồi, không cần thêm “rất” nhé." })
    ],
    chamViet: viet("Các bạn tả nơi em đang ở bằng hai tính từ, có dùng một từ chỉ mức độ.", "Nhà em rộng và rất ấm.", 1, [
      coTu(["rất", "hơi", "quá", "lắm", "khá", "cực kì", "vô cùng", "hơn"], "Có một từ chỉ mức độ", "từ chỉ mức độ (rất, hơi, quá…)")
    ], ["Dùng hai tính từ tả nơi em ở", CT, TN])
  };

  T[11] = {
    troChoi: [
      tro("phanLoai", "Chính xác hay ước chừng?", {
        gio: gio([["Số chính xác", "🎯"], ["Số ước chừng", "🤏"]]),
        the: the([["hai quyển sách", 0], ["vài quyển sách", 1], ["mười lăm phút", 0], ["dăm phút", 1], ["bốn bạn", 0], ["năm sáu bạn", 1], ["vài bạn", 1]])
      }),
      tro("chonTranh", "Đếm hay nói thứ tự?", { vong: [
        chon("Cụm này dùng để làm gì?", "nhóm thứ ba", ["Đếm số lượng", "Nói thứ tự"], 1, ["🔢", "🥉"]),
        chon("Cụm này dùng để làm gì?", "ba nhóm", ["Đếm số lượng", "Nói thứ tự"], 0, ["🔢", "🥉"]),
        chon("Cụm này dùng để làm gì?", "trang thứ hai", ["Đếm số lượng", "Nói thứ tự"], 1, ["🔢", "🥈"]),
        chon("Cụm này dùng để làm gì?", "hai trang", ["Đếm số lượng", "Nói thứ tự"], 0, ["🔢", "🥈"])
      ] }),
      tro("xepCau", "Cách nói thứ tự", { vong: [
        xep("Xếp thẻ thành cách nói thứ tự:", ["thứ", "trang", "ba"], "trang thứ ba", "📄"),
        xep("Xếp thẻ thành cách nói thứ tự:", ["nhất", "bài", "thứ"], "bài thứ nhất", "🥇")
      ] })
    ],
    chamViet: viet("Các bạn viết một hoặc hai câu giới thiệu một đồ vật hay hoạt động của em: một số dùng để đếm, một số nêu thứ tự.",
      "Em có ba quyển truyện. Em thích quyển thứ hai nhất.", 1, [
      coTu(SO_LUONG, "Có số dùng để đếm", "số dùng để đếm"),
      coTu(["thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm", "thứ sáu", "thứ bảy", "thứ tám", "thứ chín", "thứ mười", "thứ"], "Có cách nói thứ tự", "cách nói thứ tự (thứ nhất, thứ hai…)")
    ], ["Một số dùng để đếm, một số nêu thứ tự", CT])
  };

  T[12] = {
    troChoi: [
      tro("chonTranh", "Nói với ai, xưng thế nào?", { vong: [
        chon("Em chào ông. Chọn câu xưng hô đúng:", "", ["Mình chào bạn nhé.", "Cháu chào ông ạ.", "Em chào cô ạ."], 1, null, "👴"),
        chon("Em chào cô giáo. Chọn câu xưng hô đúng:", "", ["Em chào cô ạ.", "Cháu chào ông ạ.", "Mình chào cậu nhé."], 0, null, "👩‍🏫"),
        chon("Em chào bạn cùng lớp. Chọn câu xưng hô đúng:", "", ["Cháu chào bà ạ.", "Em chào cô ạ.", "Mình chào bạn nhé."], 2, null, "🧒")
      ] }),
      tro("chonTranh", "Thay tên bằng từ nào?", { vong: [
        chon("Chọn từ thay cho “Lan” để khỏi lặp tên:", "Lan đã về. ___ đang ăn cơm.", ["Bạn ấy", "Đâu", "Kia"], 0),
        chon("Chọn từ thay cho “Mai và Lan”:", "Mai và Lan là bạn thân. ___ hay học cùng nhau.", ["Ai", "Hai bạn ấy", "Đây"], 1)
      ] }),
      tro("chonTranh", "Từ hỏi về gì?", { vong: [
        chon("Từ “đâu” hỏi về gì?", "Em để vở ở đâu?", ["Người", "Nơi chốn", "Thời gian"], 1, ["🧑", "📍", "⏰"]),
        chon("Từ “ai” hỏi về gì?", "Ai đang vẽ?", ["Người", "Nơi chốn", "Thời gian"], 0, ["🧑", "📍", "⏰"]),
        chon("“Khi nào” hỏi về gì?", "Khi nào bà về?", ["Người", "Nơi chốn", "Thời gian"], 2, ["🧑", "📍", "⏰"])
      ] })
    ],
    chamViet: viet("Các bạn viết một đoạn chat hai lượt với người thân ở Việt Nam: một câu em nói, một câu người thân trả lời.",
      "Cháu chào bà ạ, bà có khỏe không? Bà khỏe, cảm ơn cháu nhé.", 2, [
      coTu(["cháu", "con", "em", "mình", "tôi", "ông", "bà", "bố", "mẹ", "ba", "má", "cô", "chú", "bác", "dì", "cậu", "mợ", "thím", "anh", "chị", "bạn"],
        "Có từ xưng hô", "từ xưng hô (cháu, bà, con, mẹ…)", { it: 2, mem: true })
    ], ["Xưng hô đúng với người thân", "Bé chỉ ra được các từ xưng hô (gạch dưới trên giấy hoặc chỉ cho bố mẹ)", CT])
  };

  T[13] = {
    troChoi: [
      tro("phanLoai", "Đi với danh từ hay với động từ, tính từ?", {
        gio: gio([["Đi với danh từ (định từ)", "📦"], ["Đi với động từ, tính từ (phó từ)", "🏃"]]),
        the: the([["các", 0], ["đang", 1], ["những", 0], ["chưa", 1], ["mọi", 0], ["rất", 1], ["đã", 1]])
      }),
      tro("chamTu", "Tìm định từ, phó từ", { vong: [
        cham("Chạm vào định từ:", "Những|quyển vở|này|mới|.", [0]),
        cham("Chạm vào phó từ:", "Mai|chưa|về|.", [1]),
        cham("Chạm vào từ chỉ mức độ:", "Áo|này|đẹp|lắm|.", [3])
      ] }),
      tro("chonTranh", "Chọn từ đúng", { vong: [
        chon("Chọn từ đúng:", "___ bạn đang học bài.", ["Các", "Đang", "Rất"], 0),
        chon("Chọn từ đúng:", "Em ___ học bài.", ["các", "đang", "những"], 1),
        chon("Chọn từ đúng:", "Bạn Lan ___ chăm.", ["các", "mọi", "rất"], 2)
      ] })
    ],
    chamViet: viet("Các bạn viết ba câu về buổi học, lần lượt dùng “các”, “đang” và “rất”.", "Các bạn đến lớp sớm. Cô giáo đang đọc truyện. Buổi học rất vui.", 3, [
      coTu(["các"], "Câu 1 có “các”", "“các”", { cau: 0 }),
      coTu(["đang"], "Câu 2 có “đang”", "“đang”", { cau: 1 }),
      coTu(["rất"], "Câu 3 có “rất”", "“rất”", { cau: 2 })
    ], [CT, TN])
  };

  T[14] = {
    troChoi: [
      tro("chonTranh", "Chọn kết từ", { vong: [
        chon("Chọn từ nêu lựa chọn:", "Em có thể vẽ ___ đọc.", ["và", "hoặc", "nhưng"], 1),
        chon("Chọn từ nối hai ý trái nhau:", "Em mệt ___ vui.", ["hoặc", "của", "nhưng"], 2),
        chon("Chọn từ thêm ý:", "Em mang bút ___ vở.", ["và", "nhưng", "nếu"], 0),
        chon("Chọn từ đúng:", "Đây là món quà ___ bà.", ["bằng", "của", "hoặc"], 1, null, "🎁"),
        chon("Chọn từ đúng:", "Em đi học ___ xe buýt.", ["bằng", "của", "và"], 0, null, "🚌")
      ] }),
      tro("xepCau", "Ghép hai ý", { vong: [
        xep("Xếp thành câu nêu nguyên nhân:", ["em mặc áo khoác", "Vì", "trời lạnh,"], "Vì trời lạnh, em mặc áo khoác", "🧥"),
        xep("Xếp thành câu nêu điều kiện:", ["mình học trong nhà", "trời mưa,", "Nếu"], "Nếu trời mưa, mình học trong nhà", "🌧️"),
        xep("Xếp thành câu nhượng bộ:", ["em vẫn đi học", "Tuy", "trời mưa,"], "Tuy trời mưa, em vẫn đi học", "☔")
      ] }),
      tro("chamTu", "Tìm kết từ", { vong: [
        cham("Chạm vào từ dẫn nguyên nhân:", "Vì|tuyết|rơi|,|em|ở|nhà|.", [0], "❄️"),
        cham("Chạm vào từ cho biết người nhận:", "Em|mua|sách|cho|bà|.", [3], "🎁"),
        cham("Chạm vào từ nối hai ý trái nhau:", "Trời|mưa|nhưng|em|vẫn|đi học|.", [2], "☔")
      ] })
    ],
    chamViet: viet("Các bạn viết một câu dùng “vì” để giải thích một thói quen và một câu dùng “nếu” để nêu kế hoạch cuối tuần.",
      "Em hay uống sữa vì sữa giúp em khỏe. Nếu trời đẹp, cuối tuần em sẽ đi công viên.", 2, [
      coTu(["vì"], "Có “vì”", "“vì”"),
      coTu(["nếu"], "Có “nếu”", "“nếu”")
    ], ["Câu có “vì” giải thích một thói quen", "Câu có “nếu” nói về kế hoạch cuối tuần", CT])
  };

  T[15] = {
    troChoi: [
      tro("chonTranh", "Lễ phép hay thân thiện?", { vong: [
        chon("Hỏi cô giáo sao cho lễ phép:", "", ["Cô đọc lại à?", "Cô đọc lại ạ?", "Cô đọc lại nhé!"], 1, null, "👩‍🏫"),
        chon("Rủ bạn học cùng sao cho thân thiện:", "", ["Mình học cùng nhé.", "Mình học cùng ạ.", "Mình học cùng à?"], 0, null, "🧒"),
        chon("Câu nào hỏi bà lễ phép nhất?", "", ["Cậu ăn cơm chưa?", "Bà ăn cơm chưa?", "Bà ăn cơm chưa ạ?"], 2, null, "👵")
      ] }),
      tro("chamTu", "Tìm từ nhấn mạnh", { vong: [
        cham("Chạm vào từ nhấn mạnh:", "Chính|Mai|mở|cửa|.", [0]),
        cham("Chạm vào từ cho thấy số lượng làm người nói chú ý:", "Lan|đọc|đến|ba|quyển|.", [2], "📚📚📚"),
        cham("Chạm vào từ nhấn mạnh:", "Chính|em|tìm thấy|chìa khóa|.", [0], "🔑")
      ] }),
      tro("chonTranh", "“Đến” nghĩa nào?", { vong: [
        chon("“Đến” ở đây có nghĩa gì?", "Em đến trường.", ["Đi tới một nơi", "Nhấn mạnh số lượng nhiều"], 0, ["🚶", "🔢"]),
        chon("“Đến” ở đây có nghĩa gì?", "Bạn ấy ăn đến năm cái bánh.", ["Đi tới một nơi", "Nhấn mạnh số lượng nhiều"], 1, ["🚶", "🔢"]),
        chon("“Đến” ở đây có nghĩa gì?", "Bà đến nhà em chơi.", ["Đi tới một nơi", "Nhấn mạnh số lượng nhiều"], 0, ["🚶", "🔢"])
      ] })
    ],
    chamViet: viet("Các bạn viết hai lời đề nghị có cùng mục đích: một lời nói với bạn, một lời nói với cô giáo.",
      "Bạn cho mình mượn bút nhé. Cô cho em mượn bút được không ạ?", 2, [
      coTu(["cô"], "Có lời nói với cô", "từ “cô”"),
      coTu(["ạ"], "Lời với cô có “ạ”", "từ “ạ” để nói lễ phép"),
      coTu(["nhé", "nha", "nhỉ"], "Lời với bạn có từ thân mật", "từ thân mật như “nhé”", { mem: true })
    ], ["Hai lời đề nghị có cùng mục đích", "Xưng hô đúng với bạn và với cô", CT])
  };

  T[16] = {
    troChoi: [
      tro("chonTranh", "Từ này đang làm gì?", { vong: [
        chon("“Cân” ở đây là gì?", "Cô ấy đang cân gạo.", ["Hoạt động", "Đồ vật (dụng cụ)"], 0, ["🏃", "⚖️"]),
        chon("“Cân” ở đây là gì?", "Cái cân ở trên bàn.", ["Hoạt động", "Đồ vật (dụng cụ)"], 1, ["🏃", "⚖️"]),
        chon("“Suy nghĩ” ở đây là gì?", "Em suy nghĩ về bài học.", ["Hoạt động", "Gọi tên một ý"], 0, ["🏃", "💭"]),
        chon("“Suy nghĩ” ở đây là gì?", "Em ghi lại một suy nghĩ.", ["Hoạt động", "Gọi tên một ý"], 1, ["🏃", "💭"])
      ] }, { nhac: "Các bạn nhìn từ đứng trước: “đang” đi với hoạt động, “cái”, “một” đi với sự vật." }),
      tro("phanLoai", "Thực từ hay hư từ?", {
        gio: gio([["Mang nội dung (thực từ)", "💎"], ["Từ giúp sức (hư từ)", "🧩"]]),
        the: the([["sách", 0], ["đang", 1], ["đọc", 0], ["sẽ", 1], ["đẹp", 0], ["những", 1], ["bà", 0], ["ạ", 1]])
      }),
      tro("chamTu", "Đọc tin nhắn", { vong: [
        cham("Chạm vào từ cho biết việc đang diễn ra:", "Bà ơi|,|con|đang|gói|quà|.", [3], "🎁"),
        cham("Chạm vào từ chỉ số lượng:", "Mai|con|sẽ|gửi|hai|món quà|ạ|.", [4], "🎁🎁"),
        cham("Chạm vào từ thể hiện sự lễ phép:", "Mai|con|sẽ|gửi|hai|món quà|ạ|.", [6], "🙇")
      ] })
    ],
    chamViet: viet("Các bạn viết tin nhắn 4 câu cho người thân. Dùng một từ ghép, một từ láy, một phó từ và một tiểu từ.",
      "Bà ơi, con nhớ bà lắm. Hôm nay trời lạnh lẽo. Con đang học bài ở nhà. Hè này con sẽ về thăm bà ạ.", 4, [
      coTu(PHO_TU, "Có một phó từ", "phó từ (đang, sẽ, rất…)"),
      coTu(TIEU_TU, "Có một tiểu từ", "tiểu từ (ạ, nhé, ơi…)"),
      coTu(LAY, "Có một từ láy", "từ láy quen (ví dụ: lạnh lẽo, vui vẻ…)", { mem: true })
    ], ["Có một từ ghép", "Bé chỉ ra được từ ghép, từ láy, phó từ, tiểu từ trong tin nhắn", CT])
  };

  /* ===================== TẬP 2 ===================== */
  T[17] = {
    troChoi: [
      tro("phanLoai", "Từ ghép hay cụm từ?", {
        gio: gio([["Từ ghép (gọi tên một loại)", "🏷️"], ["Cụm từ (tả thêm)", "📝"]]),
        the: the([["áo mưa", 0], ["áo màu vàng", 1], ["xe đạp", 0], ["xe đạp mới", 1], ["bút chì", 0], ["chiếc bút của em", 1]])
      }),
      tro("chonTranh", "Quan hệ trong cụm từ", { vong: [
        chon("Hai phần trong cụm có quan hệ gì?", "bút và vở", ["Ngang hàng (đẳng lập)", "Chính – phụ", "Chủ – vị"], 0),
        chon("Hai phần trong cụm có quan hệ gì?", "đọc truyện", ["Ngang hàng (đẳng lập)", "Chính – phụ", "Chủ – vị"], 1),
        chon("Hai phần trong cụm có quan hệ gì?", "trời mưa", ["Ngang hàng (đẳng lập)", "Chính – phụ", "Chủ – vị"], 2),
        chon("Hai phần trong cụm có quan hệ gì?", "tuyết rơi", ["Ngang hàng (đẳng lập)", "Chính – phụ", "Chủ – vị"], 2)
      ] }),
      tro("chamTu", "Thành tố chính", { vong: [
        cham("Chạm vào thành tố chính:", "đọc|truyện", [0], "📖"),
        cham("Chạm vào thành tố chính:", "áo|màu vàng", [0], "👕"),
        cham("Chạm vào thành tố chính:", "gấp|giấy", [0], "📄")
      ] }),
      tro("chonTranh", "Cách nói quen dùng", { vong: [
        chon("Hoàn thành cách nói quen dùng:", "nhanh như ___", ["rùa", "chớp", "bàn"], 1, ["🐢", "⚡", "🪑"]),
        chon("Hoàn thành cách nói quen dùng:", "chậm như ___", ["rùa", "chớp", "gió"], 0, ["🐢", "⚡", "🌬️"])
      ] })
    ],
    chamViet: viet("Các bạn viết một câu nói tên một đồ vật, rồi dùng một cụm từ để tả đồ vật đó.", "Đây là cái áo. Em có một chiếc áo màu vàng.", 1, [],
      ["Nói đúng tên loại đồ vật", "Có cụm từ tả đồ vật (ví dụ: áo màu vàng, bút của em)", CT])
  };

  T[18] = {
    troChoi: [
      tro("chamTu", "Tìm phần trung tâm", { vong: [
        cham("Chạm vào phần trung tâm:", "hai|cuốn sách|màu xanh|ấy", [1], "📘📘"),
        cham("Chạm vào phần trung tâm:", "ba|chiếc áo|mới", [1], "👕👕👕"),
        cham("Chạm vào phần trung tâm:", "tất cả|những|bức ảnh|của bà", [2], "🖼️")
      ] }),
      tro("phanLoai", "Đứng trước hay đứng sau?", {
        gio: gio([["Đứng trước (số lượng, phạm vi)", "⬅️"], ["Đứng sau (đặc điểm, quan hệ, chỉ định)", "➡️"]]),
        the: the([["hai", 0], ["mới", 1], ["những", 0], ["của bà", 1], ["tất cả", 0], ["ấy", 1], ["này", 1]])
      }),
      tro("xepCau", "Xếp thành cụm danh từ", { vong: [
        xep("Xếp thẻ thành cụm danh từ:", ["ấy", "hai", "cuốn sách"], "hai cuốn sách ấy", "📘📘"),
        xep("Xếp thẻ thành cụm danh từ:", ["của bà", "tấm ảnh", "một"], "một tấm ảnh của bà", "🖼️"),
        xep("Xếp thẻ thành cụm danh từ:", ["mới", "chiếc áo", "ba"], "ba chiếc áo mới", "👕👕👕")
      ] })
    ],
    chamViet: viet("Các bạn viết một hoặc hai câu, dùng cụm danh từ để bạn nghe biết chính xác em đang chỉ vào đồ vật nào.",
      "Em lấy cái bút màu đỏ này, không lấy cái bút màu xanh kia.", 1, [
      coTu(["này", "ấy", "kia", "đó", "nọ"], "Có từ chỉ định", "từ chỉ định (này, ấy, kia…)", { mem: true })
    ], ["Người nghe biết chính xác đồ vật nào", CT])
  };

  T[19] = {
    troChoi: [
      tro("chamTu", "Động từ trung tâm", { vong: [
        cham("Chạm vào động từ trung tâm:", "chưa|đọc|truyện", [1], "📖"),
        cham("Chạm vào động từ trung tâm:", "đang|gói|quà|cho bà", [1], "🎁"),
        cham("Chạm vào động từ trung tâm:", "đã|gửi|thư|cho bà", [1], "✉️")
      ] }),
      tro("chonTranh", "Phần sau cho biết gì?", { vong: [
        chon("“vào lớp” cho biết gì?", "chạy vào lớp", ["Đối tượng", "Hướng và đích đến", "Kết quả"], 1, ["📦", "➡️", "✅"]),
        chon("“xong” cho biết gì?", "đọc xong", ["Đối tượng", "Hướng và đích đến", "Kết quả"], 2, ["📦", "➡️", "✅"]),
        chon("“thư” cho biết gì?", "gửi thư", ["Đối tượng", "Hướng và đích đến", "Kết quả"], 0, ["📦", "➡️", "✅"])
      ] }),
      tro("chonTranh", "Chọn phần trước", { vong: [
        chon("Chọn từ đúng:", "Em ___ đọc xong cuốn truyện này rồi.", ["đã", "chưa", "đang"], 0),
        chon("Chọn từ đúng:", "Mưa ___ rơi, chưa tạnh.", ["đã", "vẫn", "chưa"], 1),
        chon("Chọn từ đúng:", "Em ___ đọc cuốn này, để mai em đọc.", ["đã", "vẫn", "chưa"], 2)
      ] })
    ],
    chamViet: viet("Các bạn viết hai câu: một câu về việc em đang làm, một câu về việc em đã làm xong.", "Em đang viết bài. Em đã ăn xong bữa sáng.", 2, [
      coTu(["đang"], "Có việc đang làm (“đang”)", "“đang”"),
      coTu(["đã", "xong", "rồi"], "Có việc đã xong (“đã”, “xong”, “rồi”)", "từ cho biết việc đã xong (đã, xong, rồi)")
    ], ["Bé chỉ được phần trước, trung tâm, phần sau của một cụm động từ", CT])
  };

  T[20] = {
    troChoi: [
      tro("xepCau", "Từ nhẹ đến mạnh", { vong: [
        xep("Xếp từ lạnh nhẹ đến lạnh nhiều:", ["rất lạnh", "hơi lạnh", "khá lạnh"], "hơi lạnh khá lạnh rất lạnh", "🥶", "hơi lạnh → khá lạnh → rất lạnh"),
        xep("Xếp từ ấm nhẹ đến ấm nhiều:", ["khá ấm", "rất ấm", "hơi ấm"], "hơi ấm khá ấm rất ấm", "☀️", "hơi ấm → khá ấm → rất ấm")
      ] }),
      tro("chamTu", "Tính từ trung tâm", { vong: [
        cham("Chạm vào tính từ trung tâm:", "rất|ấm", [1]),
        cham("Chạm vào tính từ trung tâm:", "sáng|hơn|hôm qua", [0]),
        cham("Chạm vào tính từ trung tâm:", "rộng|lắm", [0]),
        cham("Chạm vào tính từ trung tâm:", "cao|hai mét", [0])
      ] }),
      tro("chonTranh", "Mức độ, so sánh hay số đo?", { vong: [
        chon("Chọn cụm so sánh hai cái bàn:", "", ["rất cao", "cao hơn chiếc bàn kia", "cao lắm"], 1, null, "🪑🪑"),
        chon("Chọn cụm nêu số đo:", "", ["cao hai mét", "cao hơn", "hơi cao"], 0, null, "📏"),
        chon("Chọn cụm chỉ mức độ:", "", ["vui hơn hôm qua", "vui lắm"], 1, null, "😄")
      ] })
    ],
    chamViet: viet("Các bạn tả thời tiết nơi em sống: dùng một cụm chỉ mức độ và một cụm so sánh với hôm qua.", "Hôm nay trời rất lạnh. Trời lạnh hơn hôm qua.", 1, [
      coTu(["rất", "hơi", "khá", "lắm", "quá"], "Có cụm chỉ mức độ", "từ chỉ mức độ (rất, hơi, khá…)"),
      coTu(["hơn"], "Có cụm so sánh (… hơn hôm qua)", "cụm so sánh có “hơn”")
    ], ["Cụm so sánh có mốc là ngày hôm qua", CT, TN])
  };

  T[21] = {
    troChoi: [
      tro("chamTu", "Tách hai nhóm lớn", { vong: [
        cham("Chạm vào nhóm nêu người được nói đến:", "Hai bạn nhỏ|đang đọc truyện|.", [0], "👧👦"),
        cham("Chạm vào nhóm nêu người được nói đến:", "Các bạn|đang vẽ tranh|.", [0], "🎨"),
        cham("Chạm vào nhóm nêu hoạt động:", "Bà em|đang gói quà|.", [1], "🎁")
      ] }),
      tro("chamTu", "Tìm trung tâm", { vong: [
        cham("Chạm vào trung tâm của nhóm danh từ:", "hai|bạn|nhỏ", [1]),
        cham("Chạm vào trung tâm của nhóm động từ:", "đang|vẽ|tranh", [1]),
        cham("Chạm vào trung tâm của nhóm động từ:", "đang|đọc|cuốn truyện mới", [1])
      ] }),
      tro("chonTranh", "Thay thế để kiểm tra", { vong: [
        chon("Từ nào thay được cho cả nhóm “Hai bạn nhỏ”?", "___ đang đọc truyện.", ["đọc", "Lan", "rất"], 1),
        chon("Nhóm nào thay được cho “đang vẽ tranh”?", "Các bạn ___.", ["bức tranh", "các bạn", "đang hát"], 2)
      ] })
    ],
    chamViet: viet("Các bạn viết một câu có người làm và việc làm. Dùng dấu ngoặc ( ) đánh dấu hai nhóm lớn, rồi viết một câu giải thích một cụm nhỏ bên trong.",
      "(Hai bạn nhỏ) (đang đọc cuốn truyện mới). “Cuốn truyện mới” là cụm danh từ nằm trong nhóm thứ hai.", 1, [
      { loai: "coDau", dau: ["(", ")"], ten: "Có dấu ngoặc ( ) đánh dấu hai nhóm lớn", thieu: "dấu ngoặc ( ) đánh dấu hai nhóm lớn" }
    ], ["Hai nhóm lớn được đánh dấu đúng", "Giải thích đúng một cụm nhỏ bên trong", CT])
  };

  T[22] = {
    troChoi: [
      tro("chonTranh", "Cụm từ hay câu?", { vong: [
        chon("Đây là cụm từ hay câu?", "ba chậu hoa", ["Cụm từ", "Câu"], 0, ["🧩", "💬"]),
        chon("Đây là cụm từ hay câu?", "Ba chậu hoa đã nở.", ["Cụm từ", "Câu"], 1, ["🧩", "💬"]),
        chon("Đây là cụm từ hay câu?", "chiếc xe buýt", ["Cụm từ", "Câu"], 0, ["🧩", "💬"]),
        chon("Đây là cụm từ hay câu?", "Chiếc xe buýt đã đến.", ["Cụm từ", "Câu"], 1, ["🧩", "💬"])
      ] }, { nhac: "Câu thì thông báo một điều về sự vật, như “đã nở”, “đã đến”." }),
      tro("chamTu", "Chủ ngữ và vị ngữ", { vong: [
        cham("Chạm vào chủ ngữ:", "Em bé|đang cười|.", [0], "👶"),
        cham("Chạm vào chủ ngữ:", "Bà em|kể chuyện|.", [0], "👵"),
        cham("Chạm vào vị ngữ:", "Các bạn lớp em|vẽ rất đẹp|.", [1], "🎨"),
        cham("Chạm vào vị ngữ:", "Mấy bông hoa|đã nở|.", [1], "🌸")
      ] }),
      tro("xepCau", "Ghép chủ ngữ với vị ngữ", { vong: [
        xep("Xếp thẻ thành câu:", ["ngủ", "con mèo", "đang"], "con mèo đang ngủ", "🐈💤"),
        xep("Xếp thẻ thành câu:", ["đã", "đến", "chiếc xe buýt"], "chiếc xe buýt đã đến", "🚌"),
        xep("Xếp thẻ thành câu:", ["nở", "mấy bông hoa", "đã"], "mấy bông hoa đã nở", "🌸")
      ] })
    ],
    chamViet: viet("Các bạn viết hai câu kể: một câu về người, một câu về đồ vật. Đặt dấu / giữa chủ ngữ và vị ngữ, như “Bà em / kể chuyện.”",
      "Mẹ em / đang nấu cơm. Chiếc đèn bàn / rất sáng.", 2, [
      { loai: "coDau", dau: ["/"], moiCau: true, ten: "Mỗi câu có dấu / giữa chủ ngữ và vị ngữ", thieu: "dấu / giữa chủ ngữ và vị ngữ" }
    ], ["Một câu về người, một câu về đồ vật", "Dấu / đặt đúng chỗ giữa chủ ngữ và vị ngữ", CT])
  };

  T[23] = {
    troChoi: [
      tro("chamTu", "Tìm vị ngữ", { vong: [
        cham("Chạm vào vị ngữ:", "Mẹ em|là y tá|.", [1], "👩‍⚕️"),
        cham("Chạm vào vị ngữ:", "Bầu trời|rất sáng|.", [1], "☀️"),
        cham("Chạm vào vị ngữ:", "Bé|đang ngủ|.", [1], "😴")
      ] }),
      tro("chonTranh", "Ai đứng làm chủ ngữ?", { vong: [
        chon("Câu nào lấy “món quà” làm chủ ngữ?", "", ["Chị gói món quà.", "Món quà được chị gói."], 1, null, "🎁"),
        chon("Câu nào lấy “cuốn sách” làm chủ ngữ?", "", ["Cuốn sách bị bạn làm rơi.", "Bạn làm rơi cuốn sách."], 0, null, "📕"),
        chon("Câu nào lấy người làm việc làm chủ ngữ?", "", ["Chiếc xe đạp được bố sửa.", "Bố sửa chiếc xe đạp."], 1, null, "🚲")
      ] }),
      tro("xepCau", "Đổi trọng tâm", { vong: [
        xep("Xếp lại để “món quà” đứng đầu câu:", ["chị gói", "được", "món quà"], "món quà được chị gói", "🎁"),
        xep("Xếp lại để “cuốn sách” đứng đầu câu:", ["bạn làm rơi", "bị", "cuốn sách"], "cuốn sách bị bạn làm rơi", "📕")
      ] })
    ],
    chamViet: viet("Các bạn viết hai câu về một món quà: câu đầu nói về người làm, câu sau để món quà đứng đầu câu.",
      "Mẹ gói một con gấu bông. Con gấu bông được mẹ gói rất đẹp.", 2, [
      coTu(["được", "bị"], "Câu sau có “được” hoặc “bị”", "“được” hoặc “bị” để món quà đứng đầu câu", { cau: 1, mem: true })
    ], ["Câu đầu nói về người làm, câu sau món quà đứng đầu câu", CT, TN])
  };

  T[24] = {
    troChoi: [
      tro("chonTranh", "Câu đặc biệt để làm gì?", { vong: [
        chon("Câu này dùng để làm gì?", "Có khách!", ["Báo có người hay vật xuất hiện", "Mở ra một cảnh"], 0, ["🚪", "🌄"]),
        chon("Câu này dùng để làm gì?", "Một đêm trăng.", ["Báo có người hay vật xuất hiện", "Mở ra một cảnh"], 1, ["🚪", "🌕"]),
        chon("Câu này dùng để làm gì?", "Cháy!", ["Mở ra một cảnh", "Báo một việc cần chú ý ngay"], 1, ["🌄", "🚨"])
      ] }),
      tro("chonTranh", "Câu đầy đủ là gì?", { vong: [
        chon("Hỏi: “Em học ở đâu?” – Đáp: “Ở nhà ạ.” Câu đầy đủ là:", "", ["Nhà em ở đâu ạ?", "Em học ở nhà ạ."], 1),
        chon("Hỏi: “Ai trực nhật hôm nay?” – Đáp: “Em ạ.” Câu đầy đủ là:", "", ["Em trực nhật hôm nay ạ.", "Hôm nay ai cũng trực nhật ạ."], 0),
        chon("Hỏi: “Khi nào bà về?” – Đáp: “Sáng mai ạ.” Câu đầy đủ là:", "", ["Sáng mai em đi học ạ.", "Sáng mai bà về ạ."], 1)
      ] }),
      tro("phanLoai", "Câu đặc biệt hay câu có chủ – vị?", {
        gio: gio([["Câu đặc biệt", "✨"], ["Câu có chủ ngữ và vị ngữ", "🧩"]]),
        the: the([["Một chiều mưa.", 0], ["Trời mưa to.", 1], ["Có khách!", 0], ["Khách đến chơi.", 1], ["Mưa!", 0], ["Em ở nhà.", 1]])
      })
    ],
    chamViet: viet("Các bạn kể lại một cảnh em từng thấy: mở đầu bằng một câu đặc biệt ngắn, rồi viết thêm một câu có chủ ngữ và vị ngữ.",
      "Một buổi sáng mùa đông. Tuyết phủ trắng sân nhà em.", 2, [
      { loai: "cauNgan", cau: 0, toiDa: 6, mem: true, ten: "Câu đầu ngắn gọn như câu đặc biệt", thieu: "Câu đặc biệt thường chỉ vài từ, như “Một chiều mưa.”" }
    ], ["Câu đầu là câu đặc biệt mở cảnh", "Câu sau có chủ ngữ và vị ngữ", CT])
  };

  T[25] = {
    troChoi: [
      tro("chamTu", "Tìm trạng ngữ", { vong: [
        cham("Chạm vào phần nêu thời gian:", "Chiều nay|,|em|đọc sách|.", [0], "🕓"),
        cham("Chạm vào phần nêu thời gian:", "Sáng nay|,|em|gọi cho bà|.", [0], "📞"),
        cham("Chạm vào phần nêu nguyên nhân:", "Vì cơn mưa lớn|,|lớp|đổi lịch|.", [0], "🌧️")
      ] }),
      tro("chamTu", "Cụm chủ – vị nhỏ", { vong: [
        cham("Chạm vào cụm chủ – vị nhỏ nằm trong câu:", "Mẹ|thấy|con cười|.", [2], "😊"),
        cham("Chạm vào cụm chủ – vị nhỏ nằm trong câu:", "Em|nghe|bà hát|.", [2], "🎵"),
        cham("Chạm vào cụm chủ – vị nhỏ nằm trong câu:", "Bạn|thấy|tuyết rơi|.", [2], "❄️")
      ] }),
      tro("chonTranh", "Đề ngữ và chủ ngữ", { vong: [
        chon("Ai là người vẽ (chủ ngữ nòng cốt)?", "Bức tranh ấy, em vẽ hôm qua.", ["Bức tranh ấy", "em"], 1),
        chon("Phần nào nêu chủ đề (đề ngữ)?", "Cuốn truyện này, em đọc rồi.", ["Cuốn truyện này", "em đọc rồi"], 0),
        chon("Phần nào nêu chủ đề (đề ngữ)?", "Còn bài hát ấy, em chưa thuộc.", ["em chưa thuộc", "Còn bài hát ấy"], 1)
      ] })
    ],
    chamViet: viet("Các bạn viết một câu kể có trạng ngữ (ví dụ “Sáng nay, …”) và một câu theo mẫu “Em thấy …” có cụm chủ – vị đi sau.",
      "Sáng nay, em đi học sớm. Em thấy tuyết rơi trắng sân.", 2, [
      coTu(["em thấy"], "Có câu theo mẫu “Em thấy …”", "mẫu “Em thấy …”"),
      { loai: "coDau", dau: [","], mem: true, ten: "Có dấu phẩy sau trạng ngữ", thieu: "dấu phẩy sau trạng ngữ (ví dụ: “Sáng nay, …”)" }
    ], ["Câu đầu có trạng ngữ (thời gian, nơi chốn, nguyên nhân…)", "Sau “Em thấy” là một cụm có chủ ngữ và vị ngữ", CT])
  };

  T[26] = {
    troChoi: [
      tro("chamTu", "Tìm định ngữ", { vong: [
        cham("Chạm vào phần bổ sung cho sự vật (định ngữ):", "bức ảnh|cũ", [1], "🖼️"),
        cham("Chạm vào phần bổ sung cho sự vật (định ngữ):", "chiếc áo len|màu đỏ", [1], "🧶"),
        cham("Chạm vào phần cho biết cuốn sách nào:", "cuốn sách|bà tặng", [1], "📗"),
        cham("Chạm vào phần cho biết chiếc khăn nào:", "chiếc khăn|mẹ đan", [1], "🧣")
      ] }),
      tro("chonTranh", "Bổ ngữ cho biết gì?", { vong: [
        chon("“lên bàn” cho biết gì?", "Em đặt vở lên bàn.", ["Đặt cái gì", "Đặt ở đâu"], 1, ["📒", "📍"]),
        chon("“truyện” cho biết gì?", "Em đọc truyện.", ["Đọc cái gì", "Đọc ở đâu"], 0, ["📖", "📍"]),
        chon("“cho bà” cho biết gì?", "Em gửi thư cho bà.", ["Thời gian", "Người nhận"], 1, ["⏰", "👵"])
      ] }),
      tro("xepCau", "Ghép cụm có định ngữ", { vong: [
        xep("Xếp thẻ thành cụm danh từ:", ["mẹ đan", "chiếc", "khăn len"], "chiếc khăn len mẹ đan", "🧣"),
        xep("Xếp thẻ thành cụm danh từ:", ["màu đỏ", "chiếc áo", "len"], "chiếc áo len màu đỏ", "🧶")
      ] })
    ],
    chamViet: viet("Các bạn tả một món đồ bằng cụm danh từ có định ngữ, rồi dùng cụm đó trong một câu có thêm nơi chốn hoặc người nhận.",
      "Em đặt chiếc khăn len mẹ đan ở trên ghế.", 1, [
      coTu(["cho", "ở", "trên", "trong", "dưới", "lên", "vào", "tặng", "gửi"], "Có phần nêu nơi chốn hoặc người nhận",
        "phần nêu nơi chốn hoặc người nhận (ở trên bàn, cho bà…)", { mem: true })
    ], ["Cụm danh từ có định ngữ tả rõ món đồ", CT, TN])
  };

  T[27] = {
    troChoi: [
      tro("chonTranh", "Câu đứng một mình hay dựa vào câu khác?", { vong: [
        chon("Ghép “Mai nghỉ học. Vì Mai bị sốt.” thành một câu:", "", ["Vì Mai nghỉ học, Mai bị sốt.", "Mai nghỉ học vì Mai bị sốt."], 1),
        chon("Hỏi: “Em đọc ở đâu?” – Đáp: “Ở thư viện ạ.” Câu đầy đủ là:", "", ["Em đọc ở thư viện ạ.", "Thư viện ở đâu ạ?"], 0),
        chon("“Vì xe buýt đến trễ ạ.” trả lời câu hỏi nào?", "", ["Em đi học bằng gì?", "Vì sao em vào muộn?"], 1)
      ] }),
      tro("xepCau", "Xếp câu thành đoạn", { vong: [
        xep("Xếp ba câu theo thứ tự sự việc:", ["Em mặc áo ấm.", "Một luồng gió lạnh ùa vào.", "Em mở cửa sổ."],
          "Em mở cửa sổ. Một luồng gió lạnh ùa vào. Em mặc áo ấm.", "🪟", "Em mở cửa sổ. Một luồng gió lạnh ùa vào. Em mặc áo ấm."),
        xep("Xếp ba câu theo thứ tự sự việc:", ["Em ăn sáng.", "Em đi học.", "Em thức dậy."],
          "Em thức dậy. Em ăn sáng. Em đi học.", "⏰", "Em thức dậy. Em ăn sáng. Em đi học.")
      ] }),
      tro("chonTranh", "Tách câu để nhấn", { vong: [
        chon("Cách viết nào nhấn vào mục đích?", "", ["Em gọi điện để hỏi thăm bà.", "Em gọi điện. Để hỏi thăm bà."], 1, null, "📞"),
        chon("Cách viết nào nhấn vào lý do?", "", ["Lớp chuyển lịch học. Vì cô bận họp.", "Lớp chuyển lịch học vì cô bận họp."], 0, null, "📅")
      ] })
    ],
    chamViet: viet("Các bạn viết một đoạn ba câu về ngày cuối tuần. Thử ghép hai câu hoặc tách một phần để nhấn, rồi đọc hai cách cho bố mẹ nghe.",
      "Thứ bảy, em đi bơi với bố. Chủ nhật, em ở nhà. Để giúp mẹ dọn nhà.", 3, [],
      ["Ba câu nối với nhau thành đoạn về ngày cuối tuần", "Bé thử ghép hoặc tách câu để nhấn và đọc được hai cách", CT])
  };

  T[28] = {
    troChoi: [
      tro("chonTranh", "Câu ghép hay câu đơn?", { vong: [
        chon("Câu này là gì?", "Em mở vở rồi chép bài.", ["Câu đơn: một chủ ngữ, hai việc", "Câu ghép: hai chủ ngữ"], 0),
        chon("Câu này là gì?", "Em mở vở, bạn chép bài.", ["Câu đơn: một chủ ngữ, hai việc", "Câu ghép: hai chủ ngữ"], 1),
        chon("Câu này là gì?", "Bố nấu cơm, mẹ rửa rau.", ["Câu đơn: một chủ ngữ, hai việc", "Câu ghép: hai chủ ngữ"], 1),
        chon("Câu này là gì?", "Em cất sách rồi tắt đèn.", ["Câu đơn: một chủ ngữ, hai việc", "Câu ghép: hai chủ ngữ"], 0)
      ] }, { nhac: "Các bạn đếm xem câu có mấy người làm (mấy chủ ngữ) nhé." }),
      tro("chamTu", "Chủ ngữ của vế thứ hai", { vong: [
        cham("Chạm vào chủ ngữ của vế thứ hai:", "Lan vẽ tranh|,|Nam|đọc sách|.", [2], "📖"),
        cham("Chạm vào chủ ngữ của vế thứ hai:", "Bố nấu cơm|,|mẹ|rửa rau|.", [2], "🥬"),
        cham("Chạm vào chủ ngữ của vế thứ hai:", "Trống vang|,|học sinh|vào lớp|.", [2], "🥁")
      ] }),
      tro("chonTranh", "Chọn từ nối", { vong: [
        chon("Chọn từ để đối chiếu hai người:", "Em thích táo, ___ chị thích cam.", ["vì", "còn", "nếu"], 1, null, "🍎🍊"),
        chon("Chọn từ nối hai ý trái nhau:", "Trời lạnh ___ em vẫn đi học.", ["nhưng", "còn", "nếu"], 0, null, "🥶")
      ] })
    ],
    chamViet: viet("Các bạn viết một câu ghép tả hai người đang làm hai việc khác nhau ở nhà hoặc ở lớp.", "Mẹ nấu cơm, còn bố lau nhà.", 1, [
      coTu(["còn", "và", "nhưng", "rồi", "trong khi"], "Có từ nối hoặc dấu phẩy giữa hai vế", "từ nối giữa hai vế (còn, và…) – dấu phẩy cũng được", { mem: true })
    ], ["Câu có hai vế, mỗi vế có chủ ngữ và vị ngữ riêng", "Hai người làm hai việc khác nhau", CT])
  };

  T[29] = {
    troChoi: [
      tro("chonTranh", "Chọn cặp từ nối", { vong: [
        chon("Chọn cặp từ hợp nghĩa:", "___ tối qua tuyết rơi dày ___ sáng nay xe đến muộn.", ["Vì … nên …", "Nếu … thì …", "Tuy … nhưng …"], 0, null, "❄️🚌"),
        chon("Chọn cặp từ hợp nghĩa:", "___ ngày mai trời mưa ___ lớp sẽ học trong nhà.", ["Vì … nên …", "Nếu … thì …", "Tuy … nhưng …"], 1, null, "🌧️🏫"),
        chon("Chọn cặp từ hợp nghĩa:", "___ trời rất lạnh ___ em vẫn đi bộ đến trường.", ["Vì … nên …", "Nếu … thì …", "Tuy … nhưng …"], 2, null, "🥶🚶")
      ] }, { nhac: "Các bạn xem việc đã xảy ra chưa, và câu có chữ “vẫn” không nhé." }),
      tro("chamTu", "Tìm vế phụ", { vong: [
        cham("Chạm vào vế nêu điều kiện:", "Nếu Nam đến|,|em|sẽ mở cửa|.", [0], "🚪"),
        cham("Chạm vào vế nêu nguyên nhân:", "Vì tuyết rơi tối qua|,|đường|hôm nay|trơn|.", [0], "❄️"),
        cham("Chạm vào vế nêu mục đích:", "Em nói chậm hơn|để bà nghe rõ|.", [1], "👵")
      ] }),
      tro("xepCau", "Ghép hai vế", { vong: [
        xep("Xếp thành câu nguyên nhân – kết quả:", ["nên", "vì", "tuyết rơi dày", "xe đến muộn"], "vì tuyết rơi dày nên xe đến muộn", "❄️"),
        xep("Xếp thành câu điều kiện – kết quả:", ["thì", "nếu", "trời mưa", "lớp học trong nhà"], "nếu trời mưa thì lớp học trong nhà", "🌧️"),
        xep("Xếp thành câu nhượng bộ:", ["nhưng", "tuy", "trời lạnh", "em vẫn đi bộ"], "tuy trời lạnh nhưng em vẫn đi bộ", "🚶")
      ] })
    ],
    chamViet: viet("Các bạn viết một câu về kế hoạch ngày mai với “nếu … thì …” và một câu giải thích một việc với “vì … nên …”.",
      "Nếu ngày mai trời nắng thì em sẽ đi công viên. Vì hôm qua em ngủ muộn nên sáng nay em dậy trễ.", 2, [
      coTu(["nếu"], "Có “nếu”", "“nếu”"), coTu(["thì"], "Có “thì”", "“thì”"),
      coTu(["vì"], "Có “vì”", "“vì”"), coTu(["nên"], "Có “nên”", "“nên”")
    ], ["Câu “nếu … thì …” nói về kế hoạch ngày mai", "Câu “vì … nên …” giải thích đúng một việc", CT])
  };

  T[30] = {
    troChoi: [
      tro("chonTranh", "Tách vế, giữ ý", { vong: [
        chon("Tách “Gió mạnh nhưng cửa vẫn mở” thành hai câu, giữ từ nối:", "", ["Gió mạnh. Nhưng cửa vẫn mở.", "Gió mạnh. Cửa mở."], 0, null, "🌬️🚪"),
        chon("Tách “Mẹ chuẩn bị bữa tối, bố dọn bàn” thành hai câu:", "", ["Mẹ chuẩn bị. Bữa tối bố dọn bàn.", "Mẹ chuẩn bị bữa tối. Bố dọn bàn."], 1, null, "🍲")
      ] }),
      tro("chamTu", "Từ ngoài vào trong", { vong: [
        cham("Chạm vào vế điều kiện:", "Nếu trời tạnh|,|em ra sân|và|chị em tưới cây|.", [0], "🌤️"),
        cham("Chạm vào từ nối hai việc trong phần kết quả:", "Nếu trời tạnh|,|em ra sân|và|chị em tưới cây|.", [3], "🌤️"),
        cham("Chạm vào việc thứ hai ở phần kết quả:", "Nếu trời tạnh|,|em ra sân|và|chị em tưới cây|.", [4], "🌱")
      ] }),
      tro("chonTranh", "Điều kiện áp dụng cho việc nào?", { vong: [
        chon("Điều kiện “nếu trời tạnh” áp dụng cho những việc nào?", "Nếu trời tạnh, em ra sân và chị em tưới cây.", ["Chỉ việc ra sân", "Cả việc ra sân và việc tưới cây"], 1),
        chon("Điều kiện “nếu bà gọi” áp dụng cho những việc nào?", "Nếu bà gọi, em nghe máy; còn chị em vẫn học bài.", ["Chỉ việc nghe máy", "Cả việc nghe máy và việc học bài"], 0)
      ] })
    ],
    chamViet: viet("Các bạn kể một kế hoạch có một điều kiện và hai việc sẽ làm. Dùng ngoặc ( ) để chỉ rõ điều kiện áp dụng cho những việc nào.",
      "Nếu trời đẹp thì (em đi xe đạp và chị em đi dạo).", 1, [
      coTu(["nếu"], "Có điều kiện (“nếu”)", "“nếu”"),
      { loai: "coDau", dau: ["(", ")"], ten: "Có dấu ngoặc ( ) chỉ những việc điều kiện áp dụng", thieu: "dấu ngoặc ( ) chỉ những việc điều kiện áp dụng" }
    ], ["Có đủ một điều kiện và hai việc sẽ làm", "Dấu ngoặc bao đúng những việc điều kiện áp dụng", CT])
  };

  T[31] = {
    troChoi: [
      tro("chonTranh", "Kể hay hỏi?", { vong: [
        chon("Câu này kể hay hỏi?", "Bà đã nhận được ảnh.", ["Câu kể", "Câu hỏi"], 0, ["💬", "❓"]),
        chon("Câu này kể hay hỏi?", "Bà nhận được ảnh chưa?", ["Câu kể", "Câu hỏi"], 1, ["💬", "❓"]),
        chon("Câu này kể hay hỏi?", "Hôm nay lớp học sớm hơn.", ["Câu kể", "Câu hỏi"], 0, ["💬", "❓"])
      ] }),
      tro("chonTranh", "Muốn biết gì thì hỏi thế nào?", { vong: [
        chon("Em muốn biết bạn cất vở ở chỗ nào:", "", ["Ai cất vở?", "Bạn cất vở ở đâu?", "Bạn cất vở chưa?"], 1, null, "📍"),
        chon("Em muốn biết người gửi ảnh:", "", ["Ai gửi ảnh?", "Ảnh gửi ở đâu?", "Em gửi ảnh chưa?"], 0, null, "🧑"),
        chon("Em muốn biết bạn đã gửi ảnh hay chưa:", "", ["Ai gửi ảnh?", "Ảnh ở đâu?", "Bạn gửi ảnh chưa?"], 2, null, "✅"),
        chon("Em muốn bạn chọn một trong hai:", "", ["Bạn chọn bút hay vở?", "Bạn có bút không?", "Bút ở đâu?"], 0, null, "✏️📒")
      ] }),
      tro("chonTranh", "Câu hỏi để làm gì?", { vong: [
        chon("Câu này thường dùng để làm gì?", "Em có thể mở cửa giúp cô không?", ["Để hỏi em có biết mở cửa không", "Để nhờ em mở cửa"], 1, ["❓", "🙏"]),
        chon("Câu này dùng để làm gì?", "Ai mà chẳng muốn về thăm nhà?", ["Để nhấn ý: ai cũng muốn về", "Để hỏi tên người muốn về"], 0, ["💡", "❓"])
      ] })
    ],
    chamViet: viet("Các bạn viết lời em nói khi gọi cho người thân: một câu kể, một câu hỏi xác nhận và một câu hỏi xin thông tin.",
      "Bà ơi, con vừa gửi ảnh cho bà. Bà nhận được ảnh chưa ạ? Hôm nay ở quê trời thế nào ạ?", 3, [
      { loai: "coDau", dau: ["?"], it: 2, ten: "Có hai câu hỏi (dấu ?)", thieu: "câu hỏi (dấu ?)" },
      coTu(["chưa", "không"], "Có câu hỏi xác nhận (… chưa? / có … không?)", "câu hỏi xác nhận (… chưa? / có … không?)"),
      coTu(["ai", "đâu", "gì", "nào", "bao giờ", "mấy", "bao nhiêu", "sao", "thế nào"], "Có từ hỏi xin thông tin", "từ hỏi xin thông tin (ai, đâu, gì, khi nào…)")
    ], ["Câu kể đúng là câu kể, hai câu hỏi đúng mục đích", "Xưng hô đúng với người thân", CT])
  };

  T[32] = {
    troChoi: [
      tro("chonTranh", "Câu này để làm gì?", { vong: [
        chon("Câu này để làm gì?", "Hãy mở sách ra.", ["Yêu cầu làm một việc", "Bộc lộ cảm xúc", "Nhắc tránh làm một việc"], 0, ["👉", "😍", "✋"]),
        chon("Câu này để làm gì?", "Ôi, đèn lồng đẹp quá!", ["Yêu cầu làm một việc", "Bộc lộ cảm xúc", "Nhắc tránh làm một việc"], 1, ["👉", "😍", "✋"]),
        chon("Câu này để làm gì?", "Đừng quên mang vở nhé.", ["Yêu cầu làm một việc", "Bộc lộ cảm xúc", "Nhắc tránh làm một việc"], 2, ["👉", "😍", "✋"]),
        chon("Câu này để làm gì?", "Dừng lại!", ["Yêu cầu làm một việc", "Bộc lộ cảm xúc", "Nhắc tránh làm một việc"], 0, ["👉", "😍", "✋"])
      ] }),
      tro("phanLoai", "Đề nghị hay cảm xúc?", {
        gio: gio([["Lời đề nghị, nhắc nhở", "🙏"], ["Lời bộc lộ cảm xúc", "😍"]]),
        the: the([["Hãy mở sách ra.", 0], ["Ôi, đẹp quá!", 1], ["Đừng quên mang vở nhé.", 0], ["Chà, lớp mình đông vui thật!", 1], ["Xin giữ yên lặng.", 0], ["Ôi, tuyết trắng quá!", 1]])
      }),
      tro("chamTu", "Từ nào làm nên ý câu?", { vong: [
        cham("Chạm vào một từ giúp bộc lộ cảm xúc:", "Ôi|,|đèn lồng|đẹp|quá|!", [0, 4], "🏮"),
        cham("Chạm vào một từ giúp bộc lộ cảm xúc:", "Chà|,|lớp mình|đông vui|thật|!", [0, 4], "🎉"),
        cham("Chạm vào từ dùng để nhắc tránh làm việc gì:", "Đừng|quên|mang vở|nhé|.", [0], "📒")
      ] })
    ],
    chamViet: viet("Các bạn chọn một bức ảnh gia đình, viết một lời đề nghị lịch sự và một câu cảm thán hợp với tình huống trong ảnh.",
      "Cả nhà mình cùng chụp thêm một tấm ảnh nhé. Ôi, mọi người cười tươi quá!", 2, [
      { loai: "coDau", dau: ["!"], ten: "Câu cảm thán có dấu chấm than", thieu: "dấu chấm than (!) cho câu cảm thán" },
      coTu(["hãy", "đừng", "xin", "nhé", "giúp", "mời", "cùng", "ạ", "nha"], "Lời đề nghị có từ lịch sự", "từ làm lời đề nghị lịch sự (xin, hãy, giúp, nhé…)", { mem: true })
    ], ["Hai câu hợp với tình huống trong ảnh", CT, TN])
  };

  T[33] = {
    troChoi: [
      tro("chonTranh", "Không hay chưa?", { vong: [
        chon("Chọn từ đúng:", "Tính đến bây giờ, em vẫn ___ làm xong bài.", ["không", "chưa"], 1, null, "⏳"),
        chon("Em không bao giờ ăn cay. Chọn từ đúng:", "Em ___ ăn cay.", ["không", "chưa"], 0, null, "🌶️"),
        chon("Chọn từ đúng:", "Em ___ đọc truyện đó, tuần sau em sẽ đọc.", ["không", "chưa"], 1, null, "📖")
      ] }, { nhac: "“Chưa”: đến giờ việc chưa xảy ra, sau này có thể xảy ra. “Không”: không làm việc đó." }),
      tro("chonTranh", "Bác bỏ cho đúng", { vong: [
        chon("Bác bỏ câu “Quyển sách này là của em.”:", "", ["Quyển sách này chưa của em.", "Quyển sách này không phải của em."], 1, null, "📕"),
        chon("Bác bỏ câu “Đây là vở của em.”:", "", ["Đây không phải là vở của em.", "Đây là không vở của em."], 0, null, "📒")
      ] }),
      tro("chamTu", "Tìm từ phủ định", { vong: [
        cham("Chạm vào từ phủ định:", "Em|chưa|học|xong|.", [1]),
        cham("Chạm vào từ phủ định:", "Em|không|mua|vở đỏ|.", [1]),
        cham("Chạm vào phần phủ định:", "Đây|không phải|là|vở|của em|.", [1])
      ] })
    ],
    chamViet: viet("Các bạn viết một đoạn đối thoại ngắn: một câu hỏi và hai câu đáp, lần lượt dùng “không” và “chưa”.",
      "Con làm xong bài tập chưa? Con không hiểu bài toán này. Con chưa làm xong ạ.", 3, [
      { loai: "coDau", dau: ["?"], ten: "Có một câu hỏi (dấu ?)", thieu: "câu hỏi (dấu ?)" },
      coTu(["không"], "Có câu đáp dùng “không”", "“không”"),
      coTu(["chưa"], "Có câu đáp dùng “chưa”", "“chưa”")
    ], ["Hai câu đáp trả lời đúng câu hỏi", "Dùng “không” và “chưa” đúng nghĩa", CT])
  };

  T[34] = {
    troChoi: [
      tro("chamTu", "Ôn nòng cốt và câu ghép", { vong: [
        cham("Chạm vào chủ ngữ:", "Hai bạn nhỏ|đã gói quà|.", [0], "🎁"),
        cham("Chạm vào vị ngữ:", "Hai bạn nhỏ|đã gói quà|.", [1], "🎁"),
        cham("Chạm vào vế nêu nguyên nhân:", "Vì trời mưa|nên chúng con gói quà trong nhà|.", [0], "🌧️")
      ] }),
      tro("chonTranh", "Câu này để làm gì?", { vong: [
        chon("Câu này để làm gì?", "Bà nhận được quà chưa ạ?", ["Hỏi để xác nhận", "Kể lại", "Bộc lộ cảm xúc"], 0),
        chon("Câu này để làm gì?", "Khi nhận được, bà mở cùng con nhé!", ["Hỏi để xác nhận", "Đề nghị", "Kể lại"], 1),
        chon("Câu này để làm gì?", "Ôi, đẹp quá!", ["Đề nghị", "Hỏi để xác nhận", "Bộc lộ cảm xúc"], 2),
        chon("Câu này để làm gì?", "Bà chưa nhận được, con ạ.", ["Kể lại (câu phủ định)", "Hỏi để xác nhận", "Đề nghị"], 0)
      ] }),
      tro("xepCau", "Sắp xếp cuộc gọi", { vong: [
        xep("Xếp các lượt lời theo thứ tự cuộc gọi:", ["Bà nhận được quà chưa ạ?", "Con chào bà ạ!", "Bà chưa nhận được, con ạ."],
          "Con chào bà ạ! Bà nhận được quà chưa ạ? Bà chưa nhận được, con ạ.", "📞", "Con chào bà ạ! Bà nhận được quà chưa ạ? Bà chưa nhận được, con ạ.")
      ] })
    ],
    chamViet: viet("Các bạn soạn 5–6 lượt lời khi gọi cho ông bà, có câu kể, câu hỏi, câu ghép và một câu phủ định.",
      "Con chào bà ạ!\nBà khỏe không ạ?\nBà khỏe, con ạ.\nVì trời mưa nên chúng con gói quà trong nhà.\nBà nhận được quà chưa ạ?\nBà chưa nhận được, con ạ.", 5, [
      { loai: "coDau", dau: ["?"], ten: "Có câu hỏi (dấu ?)", thieu: "câu hỏi (dấu ?)" },
      coTu(["không", "chưa", "chẳng", "không phải"], "Có một câu phủ định", "câu phủ định (không, chưa…)"),
      coTu(["vì", "nên", "nếu", "thì", "nhưng", "còn", "tuy"], "Có câu ghép có từ nối", "từ nối của câu ghép (vì … nên, nếu … thì, nhưng…)", { mem: true })
    ], ["Đủ 5–6 lượt lời, có người nói và người đáp", "Bé chọn và giải thích được một cụm từ", CT])
  };

  /* ============ PHẦN BỔ SUNG · HIỂU Ý TRONG HỘI THOẠI ============ */
  T[35] = {
    troChoi: [
      tro("chonTranh", "Câu cho biết gì?", { vong: [
        chon("Khi nào?", "Chiều nay, Mai trả sách ở thư viện.", ["Ở thư viện", "Chiều nay", "Mai"], 1, ["📍", "🕓", "👧"]),
        chon("Ở đâu?", "Chiều nay, Mai trả sách ở thư viện.", ["Ở thư viện", "Chiều nay", "Trả sách"], 0, ["📍", "🕓", "📚"]),
        chon("Ai làm việc đó?", "Chiều nay, Mai trả sách ở thư viện.", ["Thư viện", "Chiều nay", "Mai"], 2, ["📍", "🕓", "👧"])
      ] }),
      tro("chonTranh", "Câu có nói điều này không?", { vong: [
        chon("Câu có cho biết tên truyện không?", "Sáng nay, Minh mượn một quyển truyện.", ["Có", "Không, tên truyện còn để ngỏ"], 1, ["✅", "❔"]),
        chon("Câu có cho biết Minh mượn mấy quyển không?", "Sáng nay, Minh mượn một quyển truyện.", ["Có: một quyển", "Không"], 0, ["✅", "❔"]),
        chon("Mai đã trả sách chưa?", "Mai chưa trả sách.", ["Trả rồi", "Chưa trả"], 1, ["✅", "⏳"])
      ] }),
      tro("chonTranh", "Nói lại đúng ý", { vong: [
        chon("Câu nào giữ nguyên ý của “Lan mượn hai cuốn truyện chiều nay.”?", "",
          ["Chiều nay, Lan trả hai cuốn truyện.", "Chiều nay, Lan mượn hai cuốn truyện.", "Lan mượn một cuốn truyện chiều nay."], 1, null, "📚")
      ] })
    ],
    chamViet: viet("Các bạn viết tin nhắn báo cho bạn về buổi học (thời gian, địa điểm, việc sẽ làm), rồi nhờ bạn nói lại.",
      "Chiều mai, lớp mình học ở thư viện. Mình sẽ đọc truyện cổ tích. Bạn nói lại giúp mình thời gian, địa điểm và việc sẽ làm nhé?", 2, [
      coTu(["sáng", "chiều", "tối", "mai", "hôm nay", "ngày mai", "thứ", "giờ", "lúc", "tuần"], "Có thời gian", "thời gian (chiều mai, lúc 4 giờ…)", { mem: true }),
      coTu(["ở", "tại", "phòng", "lớp", "thư viện", "trường", "nhà"], "Có địa điểm", "địa điểm (ở thư viện, ở lớp…)", { mem: true }),
      coTu(["nói lại", "nhắc lại", "đọc lại"], "Có lời nhờ bạn nói lại", "lời nhờ bạn nói lại", { mem: true })
    ], ["Tin nhắn có đủ thời gian, địa điểm, việc sẽ làm", "Người đọc nói lại đúng được các thông tin", CT])
  };

  T[36] = {
    troChoi: [
      tro("chonTranh", "Ở đâu thì hiểu thế nào?", { vong: [
        chon("Trong phòng, cửa sổ đang mở. Người nói có thể muốn gì?", "“Ở đây lạnh quá!”", ["Nhờ đóng cửa sổ", "Nhờ mở thêm cửa", "Muốn ra sân chơi"], 0, null, "🪟"),
        chon("Đang đứng ngoài sân, không có cửa nào. Câu này có thể là:", "“Ở đây lạnh quá!”", ["Lời nhờ đóng cửa sổ", "Một lời nhận xét về thời tiết"], 1, null, "🌳"),
        chon("Cả nhà đang dọn cơm. Câu này còn có thể gợi:", "“Con chưa ăn tối ạ.”", ["Con không muốn ăn", "Con muốn ăn cùng cả nhà"], 1, null, "🍚")
      ] }),
      tro("chonTranh", "Dấu hiệu nào giúp đoán ý?", { vong: [
        chon("Bạn nói câu này và nhìn về cửa sổ đang mở. Dấu hiệu nào giúp em đoán bạn muốn đóng cửa?", "“Ở đây lạnh quá!”",
          ["Màu áo của bạn", "Ánh mắt nhìn về cửa sổ đang mở"], 1, ["👕", "👀"])
      ] }),
      tro("chonTranh", "Hỏi lại khi chưa chắc", { vong: [
        chon("Em hỏi lại thế nào để kiểm tra ý bạn?", "“Cửa sổ vẫn mở kìa.”", ["Bạn muốn mình đóng cửa sổ không?", "Cửa sổ ở đâu?"], 0, null, "🪟"),
        chon("Em hỏi lại thế nào để kiểm tra ý bạn?", "“Đèn vẫn sáng kìa.”", ["Đèn màu gì?", "Bạn muốn mình tắt đèn không?"], 1, null, "💡")
      ] })
    ],
    chamViet: viet("Các bạn viết hai đoạn hội thoại ngắn. Mỗi đoạn có câu “Đèn vẫn sáng kìa.” và lời đáp của người nghe (giải thích hoặc hỏi lại).",
      "Đèn vẫn sáng kìa. Bạn muốn mình tắt đèn không?\nĐèn vẫn sáng kìa. Ừ, mẹ chưa về nên mình để đèn.", 4, [
      coTu(["đèn vẫn sáng kìa"], "Có câu “Đèn vẫn sáng kìa.”", "câu “Đèn vẫn sáng kìa.”"),
      { loai: "coDau", dau: ["?"], mem: true, ten: "Có một câu hỏi lại để kiểm tra (dấu ?)", thieu: "câu hỏi lại để kiểm tra (dấu ?)" }
    ], ["Hai tình huống khác nhau, lời đáp hợp với từng tình huống", "Câu hỏi lại lịch sự, đúng ý", CT])
  };

  T[37] = {
    troChoi: [
      tro("chonTranh", "Nhờ nói lại, nói với ai?", { vong: [
        chon("Nhờ bạn cùng lớp nói lại:", "", ["Bạn nói lại giúp mình nhé?", "Cô nói lại giúp em được không ạ?", "Bà nói lại giúp cháu được không ạ?"], 0, null, "🧒"),
        chon("Nhờ cô giáo nói lại:", "", ["Bạn nói lại giúp mình nhé?", "Cô nói lại giúp em được không ạ?", "Bà nói lại giúp cháu được không ạ?"], 1, null, "👩‍🏫"),
        chon("Nhờ bà nói lại:", "", ["Bạn nói lại giúp mình nhé?", "Cô nói lại giúp em được không ạ?", "Bà nói lại giúp cháu được không ạ?"], 2, null, "👵")
      ] }),
      tro("phanLoai", "Xếp cặp xưng hô", {
        gio: gio([["Với bạn", "🧒"], ["Với thầy cô", "👩‍🏫"], ["Với ông bà", "👵"]]),
        the: the([["mình – bạn", 0], ["em – cô", 1], ["cháu – bà", 2], ["tớ – cậu", 0], ["em – thầy", 1], ["con – ông", 2]])
      }),
      tro("xepCau", "Xếp lời nhờ cho lịch sự", { vong: [
        xep("Xếp thành lời nhờ cô giáo:", ["được không ạ?", "cô", "nói lại", "giúp em"], "cô nói lại giúp em được không ạ?", "👩‍🏫", "Cô nói lại giúp em được không ạ?"),
        xep("Xếp thành lời nhờ ông:", ["giúp cháu", "ông", "đọc lại trang này", "được không ạ?"], "ông đọc lại trang này giúp cháu được không ạ?", "👴", "Ông đọc lại trang này giúp cháu được không ạ?")
      ] })
    ],
    chamViet: viet("Các bạn viết hai lời nhờ nói lại khi gọi video bị ngắt tiếng: một lời với một người, rồi đổi người nghe và sửa cách nói.",
      "Bạn nói lại giúp mình nhé? Bà nói lại giúp cháu được không ạ?", 2, [
      coTu(["nói lại", "đọc lại", "nhắc lại"], "Có lời nhờ nói lại", "lời nhờ nói lại (nói lại, nhắc lại…)"),
      coTu(["ạ"], "Lời với người lớn có “ạ”", "từ “ạ” khi nói với người lớn", { mem: true })
    ], ["Hai lời nhờ cùng mục đích, đổi xưng hô theo người nghe", "Xưng hô theo cách quen thuộc của gia đình mình", CT])
  };

  window.NP_TRO_CHOI = T;
})();
