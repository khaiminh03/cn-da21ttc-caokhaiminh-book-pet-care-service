// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
 // Import User schema nếu cần

@Schema({ versionKey: false, collection: 'notice' })
export class Notification extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    id_nguoidung: Types.ObjectId;  // Liên kết với bảng Người Dùng

  @Prop({ required: true })
  noi_dung: string;  // Nội dung thông báo

  @Prop({ default: Date.now })
  ngay_gui: Date;  // Ngày gửi thông báo

  @Prop({ default: false })
  trang_thai: boolean;  // Trạng thái thông báo (true: đã đọc, false: chưa đọc)

  @Prop({ required: true })
  loai_thong_bao: string;  // Loại thông báo (Khuyến mãi, Lịch sử dịch vụ, Cảnh báo)
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
