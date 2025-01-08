import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  ten: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  sdt: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  dia_chi: string;

  @IsString()
  trang_thai: string; // active hoặc inactive
}
