// reviews.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  // Phương thức tạo đánh giá và cập nhật trạng thái đánh giá
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel({
      id_nguoidung: new Types.ObjectId(createReviewDto.id_nguoidung),
      id_dichvu: new Types.ObjectId(createReviewDto.id_dichvu),
      so_sao: createReviewDto.so_sao,
      binh_luan: createReviewDto.binh_luan,
      id_booking: new Types.ObjectId(createReviewDto.id_booking),
      ngay_danh_gia: new Date(),
      trang_thai: 'Chưa đánh giá',
    });

    return await review.save();
  }
  
   // Lấy các đánh giá cho dịch vụ cắt tỉa
   async getReviewsForPetGrooming(serviceId: string) {
    return this.reviewModel.find({ id_dichvu: serviceId }).exec(); // Lọc theo serviceId
  }
  async updateReviewStatus(
    reviewId: string,
    updateReviewStatusDto: UpdateReviewStatusDto,
  ) {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      { trang_thai: updateReviewStatusDto.trang_thai },
      { new: true },
    );
    return updatedReview;
  }
  // Thêm phương thức lấy bình luận theo id_dich_vu
  async getReviewsForService(serviceId: string) {
    const objectId = new Types.ObjectId(serviceId);
    const reviews = await this.reviewModel
      .find({ id_dichvu: objectId })
      .populate('id_nguoidung', 'ten_hien_thi anh_dai_dien');  // Đảm bảo populate đúng
    return reviews;
  }
  
  
  // Phương thức lấy tất cả đánh giá
  // Lấy tất cả các đánh giá với thông tin người dùng và dịch vụ
  // reviews.service.ts
  async getAllReviews(): Promise<Review[]> {
    const reviews = await this.reviewModel
      .find()
      .populate('id_nguoidung', 'ten_hien_thi anh_dai_dien')// Đảm bảo rằng 'id_dichvu' là tên đúng của model Service
      .exec();
    return reviews;
  }// Phương thức xóa đánh giá theo ID
  async deleteReview(reviewId: string): Promise<Review | null> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(reviewId);
    return deletedReview;
  }
}
