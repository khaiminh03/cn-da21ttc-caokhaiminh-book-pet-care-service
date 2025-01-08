// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module'; // Quản lý các dịch vụ
import { AuthModule } from './auth/auth.module';  // Quản lý xác thực và đăng nhập
import { UserModule } from './user/user.module';  // Quản lý thông tin người dùng
import { JwtModule } from '@nestjs/jwt'; // Xử lý JWT
import { PetsModule } from './pets/pets.module';
import { EmployeeModule } from './employees/employee.module';
import { BookServiceModule } from './book-service/service-booking.module';
import { RoleModule } from './roles/role.module';
import { ReviewModule } from './reviews/review.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo biến môi trường có thể sử dụng toàn cục
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/pet_care_service'), // Kết nối MongoDB
    ServicesModule,
    ReviewModule,
    PetsModule, // Quản lý các dịch vụ
    AuthModule,     // Quản lý xác thực và đăng nhập
    UserModule,
    RoleModule,
    BookServiceModule,
    EmployeeModule,
    NotificationsModule,   // Quản lý thông tin người dùng     // Thêm UploadModule vào
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', // Secret key cho JWT
      signOptions: { expiresIn: '1h' }, // Thời gian hết hạn của token
    }),
  ],
})
export class AppModule {}
