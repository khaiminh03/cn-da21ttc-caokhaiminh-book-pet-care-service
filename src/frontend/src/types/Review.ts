// src/types/Review.ts
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
  