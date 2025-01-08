import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Service extends Document {
  @Prop({ required: true })
  ten_dich_vu: string;

  @Prop({ required: true })
  mo_ta: string;

  @Prop({ required: true })
  gia: number;

  @Prop({ required: true })
  thoi_gian: string;

  @Prop({ required: true })
  hinh_anh: string;

  @Prop({ required: true })
  loai_dich_vu: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
