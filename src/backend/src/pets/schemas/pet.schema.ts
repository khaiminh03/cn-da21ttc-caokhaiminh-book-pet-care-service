// src/pets/schemas/pet.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { User } from '../../user/schemas/user.schema';

@Schema({ versionKey: false })
export class Pet extends Document {
  @Prop({ required: true })
  ten: string;

  @Prop({ required: true })
  loai: string;

  @Prop({ required: true })
  tuoi: number;

  @Prop()
  hinh_anh: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true})
  id_nguoidung: Types.ObjectId;  // Đảm bảo kiểu ObjectId
}

export const PetSchema = SchemaFactory.createForClass(Pet);
