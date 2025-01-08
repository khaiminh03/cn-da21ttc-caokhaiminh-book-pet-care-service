import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'user',timestamps: true, })  // Chỉ định tên collection là 'user'
export class User extends Document {
  @Prop({ required: true })
  ten_dang_nhap: string;

  @Prop({ required: true })
  mat_khau: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  sdt: string;

  @Prop({ required: false })
  trang_thai: string; // Ví dụ: "hoat_dong", "khong_hoat_dong"

  // Gán giá trị mặc định cho id_vaitro là ObjectId của quyền "user"
  @Prop({ 
    required: false, 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role',  // Liên kết với bảng VAI TRÒ
    default: () => new mongoose.Types.ObjectId('675067c53db47ccd373fb222') // Giá trị mặc định
  })
  id_vaitro: mongoose.Schema.Types.ObjectId;  // Liên kết với bảng VAI TRÒ

  @Prop({ required: false })
  ngay_dang_ky: Date;  // Ngày đăng ký

  @Prop({ required: false }) // Thêm thuộc tính ten_hien_thi
  ten_hien_thi: string;  // Tên hiển thị của người dùng

  @Prop({ required: false }) // Thêm thuộc tính dia_chi
  dia_chi?: string;  // Địa chỉ của người dùng

  @Prop({ required: false }) // Thêm thuộc tính dia_chi
  anh_dai_dien?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
