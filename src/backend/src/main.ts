import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
async function bootstrap() {
  // Khởi tạo ứng dụng NestJS
  const app = await NestFactory.create(AppModule);
  // Bật CORS để cho phép kết nối từ frontend
  app.enableCors({
    origin: ['http://localhost:5173'], // Chỉ cho phép domain React của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Accept, Authorization', // Thêm Authorization vào allowedHeaders
  });
 // Cấu hình phục vụ file tĩnh từ thư mục public/img
 app.use('/img', express.static(join(__dirname, '..', 'public', 'img')));

  // Cổng mặc định hoặc lấy từ biến môi trường
  const port = process.env.PORT || 5000;
  await app.listen(port);

  // Log thông báo khi ứng dụng khởi động
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
