// src/pets/dto/create-pet.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  ten: string;

  @IsString()
  @IsNotEmpty()
  loai: string;

  @IsNumber()
  @IsNotEmpty()
  tuoi: number;

  @IsString()
  @IsNotEmpty()
  hinh_anh: string;

  @IsString()
  @IsNotEmpty()
  id_nguoidung: string;  
}
