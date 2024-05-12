// ========================= Đơn Hàng ===========================
function getAlllBill(callback) {
    $.ajax({
      type: "POST",
      url: "php/xulydonhang.php",
      dataType: "json",
      // timeout: 1500, // sau 1.5 giây mà không phản hồi thì dừng => hiện lỗi
      data: {
        request: "getall",
      },
      success: function (data, status, xhr) {
        callback(data);
      },
      error: function (e) {
        Swal.fire({
          type: "error",
          title: "Lỗi lấy dữ liệu đơn Hàng (admin.js > refreshTableDonHang)",
          html: e.responseText,
        });
        callback([]);
      },
    });
  }

  // Vẽ bảng
  function refreshTableThongKe() {
    getAlllBill((data) => {
      addTableDonHang(data);
      TATCA_DONHANG = data;
      console.log(data);
    });
  }
  function addTableThongKe(data) {
    var tc = document
      .getElementsByClassName("donhang")[0]
      .getElementsByClassName("table-content2")[0];
    var s = `<table class="table-outline hideImg">`;

    TONGTIEN = 0;
    for (var i = 0; i < data.length; i++) {
      var d = data[i];

      // Ngày giờ
      var date = new Date(d.NgayLap).toLocaleString();

      //  danh sach san pham
      var dssp = ``;
      for (var ct of d.CTDH) {
        dssp += `<a target="blank" href="chitietsanpham.php?${ct.SP.MaSP}">
        <p>${ct.SP.TenSP} [<span style="color:yellow">${ct.SoLuong}</span>]</p>
      </a>`;
      }

      // Nút bấm Hành động
      let action =
        d.TrangThai == "-1" // Đã hủy
          ? "_"
          : d.TrangThai == "1" // Chờ duyệt
            ? `<div class="tooltip">
              <i class="fa fa-check" onclick="capNhatDonHang('${d.MaHD}', '2')"></i>
              <span class="tooltiptext">Duyệt</span>
          </div>
          <div class="tooltip">
              <i class="fa fa-remove" onclick="capNhatDonHang('${d.MaHD}', '-1')"></i>
              <span class="tooltiptext">Hủy</span>
          </div>`
            : d.TrangThai == "2" // Đã duyệt
              ? `<div class="tooltip">
                <i class="fa fa-check" onclick="capNhatDonHang('${d.MaHD}', '3')"></i>
                <span class="tooltiptext">Giao hàng</span>
            </div>
            <div class="tooltip">
                <i class="fa fa-remove" onclick="capNhatDonHang('${d.MaHD}', '-1')"></i>
                <span class="tooltiptext">Hủy</span>
            </div>`
              : d.TrangThai == "3" // Đang giao
                ? `<div class="tooltip">
              <i class="fa fa-check" onclick="capNhatDonHang('${d.MaHD}', '4')"></i>
              <span class="tooltiptext">Giao xong</span>
          </div>
          <div class="tooltip">
              <i class="fa fa-remove" onclick="capNhatDonHang('${d.MaHD}', '-1')"></i>
              <span class="tooltiptext">Hủy</span>
          </div>`
                : d.TrangThai == "4" // Giao xong
                  ? `_`
                  : "";

      // Người dùng
      let nguoiDung =
        `${d.ND.TaiKhoan}<br/>` +
        `(${d.ND.Ho} ${d.ND.Ten})<br/>` +
        `Mã: ${d.MaND}`;

      s += `<tr>
          <td style="width: 5%">${i + 1}</td>
          <td style="width: 7%">${d.MaHD}</td>
          <td style="width: 13%">${nguoiDung}</td>
          <td style="width: 20%; text-align:right;">${dssp}</td>
          <td style="width: 15%">${numToString(Number(d.TongTien))}</td>
          <td style="width: 10%">${date}</td>
          <td style="width: 10%">${getTenTrangThaiDonHang(d.TrangThai)}</td>
          <td style="width: 10%">${action}</td>
      </tr>`;
      TONGTIEN += Number(d.tongtien);
    }

    s += `</table>`;
    tc.innerHTML = s;
  }

  // Duyệt
  function capNhatThongKe(maDonHang, trangThai) {
    let donhang = TATCA_DONHANG.find((_) => _.MaHD === maDonHang);
    if (!donhang) {
      Swal.fire({
        type: "error",
        title:
          "Không tìm thấy đơn hàng #" + maDonHang + ". Vui lòng tải lại trang.",
        html: e.responseText,
      });
      return;
    }
    if (trangThai == "-1") {
      Swal.fire({
        type: "warning",
        title: "Bạn có chắc muốn Hủy đơn hàng #" + maDonHang + "?",
        text: "Việc này không thể hoàn tác!",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Hủy đơn",
        cancelButtonText: "Giữ lại",
      }).then((result) => {
        if (result.value) {
          capNhatDonHangAjax(maDonHang, trangThai);
        }
      });
    } else {
      Swal.fire({
        type: "info",
        title:
          "Cập nhật đơn hàng #" +
          maDonHang +
          " thành " +
          getTenTrangThaiDonHang(trangThai) +
          "?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.value) {
          capNhatDonHangAjax(maDonHang, trangThai);
        }
      });
    }
  }

  function capNhatThongKeAjax(maDonHang, trangThai) {
    $.ajax({
      type: "POST",
      url: "php/xulydonhang.php",
      dataType: "json",
      data: {
        request: "capNhatTrangThai",
        maDonHang: maDonHang,
        trangThai: trangThai,
      },
      beforeSend: function () {
        Swal.showLoading();
      },
      success: function (data, status, xhr) {
        console.log(data);
        Swal.fire({
          type: "success",
          title: "Cập nhật trạng thái đơn hàng #" + maDonHang + " thành công",
        });
        refreshTableDonHang();
      },
      error: function (e) {
        console.log(e);
        Swal.fire({
          type: "error",
          title:
            "Lỗi cập nhật trạng thái đơn hàng (admin.js > capNhatDonHangAjax)",
          html: e.responseText,
        });
      },
    });
  }

  function locThongKeTheoKhoangNgay() {
    var from = document.getElementById("fromDate").valueAsDate;
    var to = document.getElementById("toDate").valueAsDate;

    var listTr_table = document
      .getElementsByClassName("donhang")[0]
      .getElementsByClassName("table-content2")[0]
      .getElementsByTagName("tr");
    for (var tr of listTr_table) {
      var td = tr.getElementsByTagName("td")[5].innerHTML;
      var d = new Date(td);

      if (d >= from && d <= to) {
        tr.style.display = "";
      } else {
        tr.style.display = "none";
      }
    }
  }

  function timKiemThongKe(inp) {
    var kieuTim = document.getElementsByName("kieuTimDonHang")[0].value;
    var text = inp.value;

    // Lọc
    var vitriKieuTim = {
      ma: 1,
      khachhang: 2,
      trangThai: 6,
    };

    var listTr_table = document
      .getElementsByClassName("donhang")[0]
      .getElementsByClassName("table-content2")[0]
      .getElementsByTagName("tr");
    for (var tr of listTr_table) {
      var td = tr
        .getElementsByTagName("td")
      [vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

      if (td.indexOf(text.toLowerCase()) < 0) {
        tr.style.display = "none";
      } else {
        tr.style.display = "";
      }
    }
  }

  // Sắp xếp
  function sortThongKeTable(loai) {
    var list = document
      .getElementsByClassName("donhang")[0]
      .getElementsByClassName("table-content2")[0];
    var tr = list.getElementsByTagName("tr");

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTable_DonHang);
    decrease = !decrease;
  }

  // Lấy giá trị của loại(cột) dữ liệu nào đó trong bảng
  function getValueOfTypeInTable_ThongKe(tr, loai) {
    var td = tr.getElementsByTagName("td");
    switch (loai) {
      case "stt":
        return Number(td[0].innerHTML);
      case "ma":
        return new Date(td[1].innerHTML); // chuyển về dạng ngày để so sánh ngày
      case "khach":
        return td[2].innerHTML.toLowerCase(); // lấy tên khách
      case "sanpham":
        return td[3].children.length; // lấy số lượng hàng trong đơn này, length ở đây là số lượng <p>
      case "tongtien":
        return stringToNum(td[4].innerHTML); // trả về dạng giá tiền
      case "ngaygio":
        return new Date(td[5].innerHTML); // chuyển về ngày
      case "trangthai":
        return td[6].innerHTML.toLowerCase(); //
    }
    return false;
  }