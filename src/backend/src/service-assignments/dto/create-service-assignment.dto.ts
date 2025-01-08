// src/service-assignment/dto/create-service-assignment.dto.ts
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateServiceAssignmentDto {
  @IsString()
  @IsNotEmpty()
  id_dichvu: string; // ID của dịch vụ

  @IsDate()
  ngay_gio_phan_cong: Date; // Ngày giờ phân công dịch vụ
}
