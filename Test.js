function addChart(id, chartOption) {
    var ctx = document.getElementById(id).getContext("2d");
    var chart = new Chart(ctx, chartOption);
  }
  
  // https://stackoverflow.com/a/1484514
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  async function refreshTableThongKe() {
    layTatCaDonHang((tatCaDonHang) => {
      console.log(tatCaDonHang);
  
      let sanPhamBanRaTheoMaSP = {};
      for (let donHang of tatCaDonHang) {
        for (let chiTietDonHang of donHang.CTDH) {
          let masp = chiTietDonHang.MaSP;
          let soluong = Number(chiTietDonHang.SoLuong);
          let dongia = chiTietDonHang.DonGia;
  
          if (!(masp in sanPhamBanRaTheoMaSP)) {
            sanPhamBanRaTheoMaSP[masp] = {
              maSP: masp,
              ten: chiTietDonHang.SP.TenSP,
              soLuong: 0,
              tongTien: 0,
            };
          }
  
          sanPhamBanRaTheoMaSP[masp].soLuong += soluong;
          sanPhamBanRaTheoMaSP[masp].tongTien += soluong * dongia;
        }
      }
  
      console.log(sanPhamBanRaTheoMaSP);
  
      let danhSachSanPhamBanRa = Object.values(sanPhamBanRaTheoMaSP);
      let bgColor = danhSachSanPhamBanRa.map(getRandomColor);
      let soLuongBanRa = {
        type: "bar",
        data: {
          labels: danhSachSanPhamBanRa.map((_) => _.ten),
          datasets: [
            {
              label: "Số lượng bán ra",
              data: danhSachSanPhamBanRa.map((_) => _.soLuong),
              backgroundColor: bgColor,
              borderWidth: 2,
            },
          ],
        },
        options: {
          // legend: { display: false },
          title: {
            fontColor: "#fff",
            fontSize: 25,
            display: true,
            text: "Số lượng bán ra",
          },
        },
      };
      let doanhThu = {
        type: "bar",
        data: {
          labels: danhSachSanPhamBanRa.map((_) => _.ten),
          datasets: [
            {
              label: "Số lượng bán ra",
              data: danhSachSanPhamBanRa.map((_) => _.tongTien),
              backgroundColor: bgColor,
              borderWidth: 2,
            },
          ],
        },
        options: {
          title: {
            fontColor: "#fff",
            fontSize: 25,
            display: true,
            text: "Doanh thu",
          },
        },
      };
  
      // Thêm thống kê
      var chart = copyObject(soLuongBanRa);
      chart.type = "bar";
      addChart("myChart1", chart);
  
      chart = copyObject(doanhThu);
      chart.type = "doughnut";
      addChart("myChart2", chart);
  
    });
  }