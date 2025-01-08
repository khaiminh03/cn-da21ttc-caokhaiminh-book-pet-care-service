import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatePetDto {
  @IsString()
  @IsOptional()
  ten?: string;

  @IsString()
  @IsOptional()
  loai?: string;

  @IsNumber()
  @IsOptional()
  tuoi?: number;

  @IsString()
  @IsOptional()
  hinh_anh?: string;
}
