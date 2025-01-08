// src/employee/schemas/employee.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'employee' })  // Chỉ định tên collection là "employee"
export class Employee extends Document {
  @Prop({ required: true })
  ten: string;

  @Prop({ required: true })
  sdt: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  dia_chi: string;

  @Prop({ required: false })
  trang_thai: string; 
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
