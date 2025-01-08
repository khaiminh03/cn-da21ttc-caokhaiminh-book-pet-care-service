// create-review.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsMongoId } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  id_nguoidung: string;

  @IsMongoId()
  @IsNotEmpty()
  id_dichvu: string;

  @IsNumber()
  @IsNotEmpty()
  so_sao: number;

  @IsString()
  @IsNotEmpty()
  binh_luan: string;

  @IsMongoId()
  @IsNotEmpty()
  id_booking: string;
}
