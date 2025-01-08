import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'role' })  // Chỉ định tên collection là 'roles'
export class Role {
  @Prop()
  ten_vai_tro: string;  // Ví dụ: "admin", "user"

  @Prop()
  mo_ta: string;  // Mô tả về vai trò
}

export const RoleSchema = SchemaFactory.createForClass(Role);
