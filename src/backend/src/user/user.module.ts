import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema'; // Import User schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Đảm bảo mô hình User được đăng ký
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export UserService nếu cần sử dụng ở module khác
})
export class UserModule {}
