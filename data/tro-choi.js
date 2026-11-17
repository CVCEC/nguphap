/* Trò chơi có hình và tiêu chí chấm bài viết cho từng bài Ngữ pháp.
   Tách riêng khỏi data/bai-hoc.js (nội dung lấy từ slide) để soạn thêm mà không đụng tới nội dung bài.

   troChoi: danh sách trò, mỗi trò có "loai":
     chonTranh – đọc câu, chạm vào tranh đúng.      vong: [{ cau, lua: [{ tranh, dung }] }]
                 tranh kiểu "goi": { tu, nhanTu, den, nhanDen } (người bên trái gọi người bên phải)
                 tranh kiểu chữ: { hinh: "🧢🧢🧢" }
     xepCau    – chạm thẻ theo thứ tự cho thành câu. vong: [{ tranh, the: [...], dung: "..." }]
     chamTu    – chạm vào từ đúng trong câu.        vong: [{ hinh, cau: [tiếng/dấu], dung: [chỉ số] }]
     phanLoai  – chạm thẻ rồi chạm giỏ (kéo thả cũng được). gio: [tên giỏ], the: [{ chu, gio }]

   chamViet: tiêu chí Trâu Con tự chấm (js/cham-viet.js) và phần cha mẹ / thầy cô chấm thêm.
     tuDong: [{ loai: "soCau" | "vietHoa" | "dauCau" | "moiCauCo" | "khacNhau" | "coTu", ... }]
     nguoiLon: [các ý người lớn đọc và đánh dấu] */
(function () {
  var SO_LUONG = ["một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười", "mươi", "trăm", "nghìn", "vài", "mấy", "nhiều", "những", "các", "#so"];

  window.NP_TRO_CHOI = {
    1: {
      troChoi: [
        {
          loai: "chonTranh", ten: "Ai gọi ai?", en: "Who is calling whom?",
          huongDan: "Các bạn đọc câu, rồi chạm vào tranh đúng nhé.",
          vong: [
            { cau: "Cháu gọi bà.", lua: [
              { tranh: { tu: "👦", nhanTu: "cháu", den: "👵", nhanDen: "bà" }, dung: true },
              { tranh: { tu: "👵", nhanTu: "bà", den: "👦", nhanDen: "cháu" } } ] },
            { cau: "Bà gọi cháu.", lua: [
              { tranh: { tu: "👦", nhanTu: "cháu", den: "👵", nhanDen: "bà" } },
              { tranh: { tu: "👵", nhanTu: "bà", den: "👦", nhanDen: "cháu" }, dung: true } ] },
            { cau: "Con gọi mẹ.", lua: [
              { tranh: { tu: "👩", nhanTu: "mẹ", den: "🧒", nhanDen: "con" } },
              { tranh: { tu: "🧒", nhanTu: "con", den: "👩", nhanDen: "mẹ" }, dung: true } ] }
          ]
        },
        {
          loai: "xepCau", ten: "Xếp thẻ thành câu", en: "Put the cards in order",
          huongDan: "Nhìn tranh, rồi chạm vào các thẻ theo thứ tự để được câu đúng với tranh.",
          vong: [
            { tranh: { tu: "👦", nhanTu: "cháu", den: "👵", nhanDen: "bà" }, the: ["bà", "gọi", "cháu"], dung: "cháu gọi bà" },
            { tranh: { tu: "👵", nhanTu: "bà", den: "👦", nhanDen: "cháu" }, the: ["cháu", "bà", "gọi"], dung: "bà gọi cháu" },
            { tranh: { tu: "👧", nhanTu: "em", den: "👩", nhanDen: "chị" }, the: ["chị", "cho", "mở cửa", "em"], dung: "em mở cửa cho chị" }
          ]
        },
        {
          loai: "chamTu", ten: "Từ nào cho biết số lượng?", en: "Which word tells how many?",
          huongDan: "Chạm vào từ cho biết có bao nhiêu đồ vật.",
          vong: [
            { hinh: "🧢🧢🧢", cau: ["Em", "có", "ba", "cái", "mũ", "."], dung: [2] },
            { hinh: "📒", cau: ["Bạn", "mua", "một", "quyển", "vở", "."], dung: [2] },
            { hinh: "✏️✏️", cau: ["Trên", "bàn", "có", "hai", "cây", "bút", "."], dung: [3] }
          ]
        },
        {
          loai: "phanLoai", ten: "Xếp thẻ vào giỏ", en: "Sort the cards",
          huongDan: "Chạm vào một thẻ, rồi chạm vào giỏ đúng. Các bạn cũng có thể kéo thẻ thả vào giỏ.",
          gio: [{ ten: "Gọi tên đồ vật", hinh: "🎒" }, { ten: "Cho biết số lượng", hinh: "🔢" }],
          the: [
            { chu: "bút", gio: 0 }, { chu: "một", gio: 1 }, { chu: "vở", gio: 0 }, { chu: "ba", gio: 1 },
            { chu: "thước", gio: 0 }, { chu: "hai", gio: 1 }, { chu: "mũ", gio: 0 }
          ]
        }
      ],
      chamViet: {
        loiDan: "Các bạn viết lại hai câu vừa nói, rồi bấm “Trâu Con chấm bài” nhé.",
        viDu: "Em có một cái mũ đỏ. Mẹ em có ba cái mũ.",
        tuDong: [
          { loai: "soCau", it: 2, ten: "Có ít nhất 2 câu" },
          { loai: "vietHoa", ten: "Chữ đầu mỗi câu viết hoa" },
          { loai: "dauCau", ten: "Cuối mỗi câu có dấu chấm (hoặc dấu chấm hỏi, chấm than)" },
          { loai: "moiCauCo", tu: SO_LUONG, soCau: 2, thieu: "từ chỉ số lượng", ten: "Mỗi câu có một từ chỉ số lượng (một, hai, ba…)" },
          { loai: "khacNhau", tu: SO_LUONG, thieu: "từ chỉ số lượng", ten: "Hai câu dùng hai số lượng khác nhau" }
        ],
        nguoiLon: ["Hai câu nói về cùng một đồ vật", "Viết đúng chính tả, đúng dấu thanh", "Câu rõ ý, đọc lên tự nhiên"]
      }
    }
  };
})();
