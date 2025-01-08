import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false, collection: 'booking' })  // Chỉ định tên collection là 'booking'
export class BookService extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  id_nguoidung: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  id_dichvu: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  id_thucung: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee',required: false})
  id_nhanvien: Types.ObjectId; 

  @Prop({ type: Date, required: true })
  ngay_gio: Date;

  @Prop({ type: String, default: 'Chờ xác nhận' })
  trang_thai: string;

  @Prop({ type: String })
  ghi_chu: string;

}

export const BookServiceSchema = SchemaFactory.createForClass(BookService);
