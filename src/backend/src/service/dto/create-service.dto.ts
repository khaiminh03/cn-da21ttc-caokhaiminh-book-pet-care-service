import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  ten_dich_vu: string;

  @IsString()
  @IsNotEmpty()
  mo_ta: string;

  @IsNumber()
  @IsNotEmpty()
  gia: number;

  @IsString()
  @IsNotEmpty()
  thoi_gian: string;

  @IsString()
  @IsNotEmpty()
  hinh_anh: string;

  @IsString()
  @IsNotEmpty()
  loai_dich_vu: string;
}
