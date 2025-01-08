// src/service-assignments/schemas/service-assignments.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'serviceassignments' })
export class ServiceAssignment extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Employee' })
  id_nhanvien: Types.ObjectId;  // ID nhân viên, sử dụng ObjectId thay vì string

  @Prop({ required: true, type: Types.ObjectId, ref: 'Service' })
  id_dichvu: Types.ObjectId;  // ID dịch vụ, sử dụng ObjectId thay vì string
  
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  id_nguoidung: Types.ObjectId;

  @Prop({ required: true })
  ngay_gio_phan_cong: Date;  // Thời gian phân công
}

export const ServiceAssignmentSchema = SchemaFactory.createForClass(ServiceAssignment);
