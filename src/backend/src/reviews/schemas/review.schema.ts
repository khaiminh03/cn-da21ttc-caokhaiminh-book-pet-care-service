// review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false, collection: 'reviews' })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  id_nguoidung: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Services', required: true })
  id_dichvu: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  so_sao: number;

  @Prop({ type: String, required: true })
  binh_luan: string;

  @Prop({ type: Date, default: Date.now })
  ngay_danh_gia: Date;

  @Prop({ type: String, default: 'Chưa đánh giá' })
  trang_thai: string;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  id_booking: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
