import { IsString, IsMongoId, IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class BookingDto {
  @IsMongoId()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))  // Chuyển đổi chuỗi thành ObjectId
  id_nguoidung: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))  // Chuyển đổi chuỗi thành ObjectId
  id_dichvu: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))  // Chuyển đổi chuỗi thành ObjectId
  id_thucung: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))  // Chuyển đổi chuỗi thành ObjectId
  id_nhanvien: Types.ObjectId;

  @IsDate()
  @IsNotEmpty()
  ngay_gio: Date;

  @IsString()
  ghi_chu?: string;
}
