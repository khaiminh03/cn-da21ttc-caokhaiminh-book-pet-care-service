// DTO để cập nhật trạng thái đánh giá
import { IsString } from 'class-validator';

export class UpdateReviewStatusDto {
  @IsString()
  trang_thai: string;
}
