import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  ten_dang_nhap: string;

  @IsString()
  @IsNotEmpty()
  mat_khau: string;
}
