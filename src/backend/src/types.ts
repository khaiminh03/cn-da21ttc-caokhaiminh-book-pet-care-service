// src/types.ts
export interface Service {
    _id: string;
    ten_dich_vu: string;
    mo_ta: string;
    gia: number;
    thoi_gian: string;
    hinh_anh: string;
    loai_dich_vu: string;
  }
  // src/types.ts
export interface BookingData {
  id_nguoidung: string;
  id_dichvu: string;
  id_thucung: string;
  id_nhanvien: string;
  ngay_gio: string;  // Hoặc Date nếu bạn sử dụng đối tượng Date
  ghi_chu?: string;
}
// pet.interface.ts
export interface Pet {
  _id: string;
  ten_thu_cung: string;
  loai_thu_cung: string;
  // thêm các thuộc tính khác nếu có
}
// employee.interface.ts
export interface Employee {
  _id: string;
  ten: string;
  sdt: string;
  email: string;
  dia_chi: string;
  trang_thai: string;
}
