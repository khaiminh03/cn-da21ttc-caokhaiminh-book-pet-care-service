import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  sdt?: string;

  @IsString()
  @IsOptional()
  mat_khau?: string;

  @IsString()
  @IsOptional()
  dia_chi?: string;

  @IsString()
  @IsOptional()
  ten_hien_thi?: string;

  @IsString()
  @IsOptional()
  anh_dai_dien?: string;
}
