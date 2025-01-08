import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ReviewsService } from './review.service';
import { ReviewsController } from './review.controller';
import { ServicesModule } from '../service/services.module'; // Đường dẫn tới ServiceModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ServicesModule, // Nhập ServiceModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewModule {}
