<?php

	require_once ("../BackEnd/ConnectionDB/DB_classes.php");

	if(!isset($_POST['request']) && !isset($_GET['request'])) die();

	switch ($_POST['request']) {
		case 'themdonhang':
			$dulieu = $_POST["dulieu"];

			$hoadonBUS = new HoaDonBUS();
			$chitiethdBUS = new ChiTietHoaDonBUS();

			$hoadonBUS->add_new(array(
				"MaHD" => "",
				"MaND" => $dulieu["maNguoiDung"],
				"NgayLap" => $dulieu["ngayLap"],
				"NguoiNhan" => $dulieu["tenNguoiNhan"],
				"SDT" => $dulieu["sdtNguoiNhan"],
				"DiaChi" => $dulieu["diaChiNguoiNhan"],
				"PhuongThucTT" => $dulieu["phuongThucTT"],
				"TongTien" => $dulieu["tongTien"],
				"TrangThai" => 1 // Chờ duyệt
			));

			$hoadonMaxID = $hoadonBUS->get_list("SELECT * FROM hoadon ORDER BY MaHD DESC LIMIT 0, 1");
			$mahd = $hoadonMaxID[0]["MaHD"];

			$sanphamBUS = new SanPhamBUS();
			$khuyenMaiBUS = new KhuyenMaiBUS();

			forEach($dulieu["dssp"] as $sp) {
				$dataSp = $sanphamBUS->select_by_id("*", $sp["masp"]);
				$dataKm = $khuyenMaiBUS->select_by_id("*", $dataSp["MaKM"]);
				if ($dataKm == null) {
					$donGia = $dataSp["DonGia"];
				} else {
					$donGia = $dataSp["DonGia"] - $dataKm["GiaTriKM"];
				}

				$chitiethdBUS->add_new(array(
					"MaHD" => $mahd,
					"MaSP" => $sp["masp"],
					"SoLuong" => $sp["soLuong"],
					"DonGia" => $donGia
				));
			}

			die (json_encode(true));

		break;
	}
?>
