import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  ten_dich_vu?: string;

  @IsString()
  @IsOptional()
  mo_ta?: string;

  @IsNumber()
  @IsOptional()
  gia?: number;

  @IsString()
  @IsOptional()
  thoi_gian?: string;

  @IsString()
  @IsOptional()
  hinh_anh?: string;

  @IsString()
  @IsOptional()
  loai_dich_vu?: string;
}
