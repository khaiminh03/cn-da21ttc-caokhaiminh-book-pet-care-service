import { IsString, IsNotEmpty, IsOptional, IsPhoneNumber, IsEmail } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  ten?: string;

  @IsPhoneNumber()
  @IsOptional()
  sdt?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  dia_chi?: string;

  @IsString()
  @IsOptional()
  trang_thai?: string;
}
