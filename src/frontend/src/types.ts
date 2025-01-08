// src/types.ts
import { Types   } from 'mongoose';
export interface Service {
    _id: string;
    ten_dich_vu: string;
    mo_ta: string;
    gia: number;
    thoi_gian: string;
    hinh_anh: string;
    loai_dich_vu: string;
  }
  export interface Pet {
    _id: string;
    ten: string;
    loai: string;
    tuoi: number;
    hinh_anh: string;
  }
  export interface BookServiceDto {
    userId: string;
    serviceId: string;
    petId: string;
    bookingTime: string;
    note: string;
  }
  export interface ServiceData {
    ten_dich_vu: string;
    mo_ta: string;
    gia: number;
    thoi_gian: string;
    hinh_anh: string;
    loai_dich_vu: string;
  }
  // src/types.ts (hoặc bất kỳ tệp nào bạn muốn) (suawrr)
export type BookingRequest = {
  id_nguoidung: string | Types.ObjectId;
  id_dichvu: string | Types.ObjectId;
  id_thucung: string | Types.ObjectId;
  ngay_gio: string;
  ghi_chu?: string;
};
export interface Booking {
  _id: string;
  id_nguoidung: string;
  id_dichvu: string;
  id_thucung: string;
  ngay_gio: string;
  trang_thai: string;
  ghi_chu?: string;
   // Ghi chú có thể không bắt buộc
}

export interface Review {
  _id: string;
  id_nguoidung: {
    ten_hien_thi: string;
    anh_dai_dien: string;
  };
  binh_luan: string;
  ngay_danh_gia: string;
  trang_thai: string;
  so_sao: number;
}



