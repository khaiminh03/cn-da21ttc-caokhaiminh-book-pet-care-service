// reviews.controller.ts
import { Controller, Post, Body, Patch, Param, Get,Delete,NotFoundException } from '@nestjs/common';
import { ReviewsService } from '../reviews/review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schemas/review.schema'; 
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Patch('status/:reviewId')
  async updateReviewStatus(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateReviewStatus(reviewId, updateReviewStatusDto);
  }
  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsService.getAllReviews();
  }
   // Thêm phương thức để lấy bình luận theo id_dich_vu
   @Get('service/:serviceId')
   async getReviewsForService(@Param('serviceId') serviceId: string) {
     try {
       const reviews = await this.reviewsService.getReviewsForService(serviceId);
       return reviews;
     } catch (error) {
       throw new Error('Lỗi khi lấy bình luận');
     }
   }
    // Xóa đánh giá theo ID
     // Thêm phương thức xóa đánh giá theo ID
  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') reviewId: string) {
    const deletedReview = await this.reviewsService.deleteReview(reviewId);
    if (!deletedReview) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }
    return { message: 'Đánh giá đã được xóa thành công' };
  }
}
   

