import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; // Import schema của người dùng
import { UpdateUserDto } from './dto/update-user.dto'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Inject UserModel
  ) {}

  // Tìm người dùng theo tên đăng nhập
  async findOneByUsername(ten_dang_nhap: string): Promise<User> {
    return this.userModel.findOne({ ten_dang_nhap });
  }

  // Tìm người dùng theo ID
  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  // Tạo người dùng mới
  async create(createUserDto: { ten_dang_nhap: string; mat_khau: string; email: string; sdt: string; trang_thai: string }): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findByUsername(tenDangNhap: string): Promise<User | null> {
    return this.userModel.findOne({ ten_dang_nhap: tenDangNhap }).exec();
  }

  // Cập nhật thông tin người dùng (không cho phép chỉnh sửa ten_dang_nhap)
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Kiểm tra nếu có mật khẩu mới thì mã hóa mật khẩu
    if (updateUserDto.mat_khau) {
      const hashedPassword = await bcrypt.hash(updateUserDto.mat_khau, 10);
      updateUserDto.mat_khau = hashedPassword; // Gán lại mật khẩu đã mã hóa vào DTO
    }

    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Kiểm tra nếu có mật khẩu mới thì mã hóa mật khẩu
    if (updateUserDto.mat_khau) {
      const hashedPassword = await bcrypt.hash(updateUserDto.mat_khau, 10);
      updateUserDto.mat_khau = hashedPassword; // Gán lại mật khẩu đã mã hóa vào DTO
    }

    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  // Phương thức kiểm tra mật khẩu
  async checkPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  // Hàm mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
  async updatePassword(userId: string, mat_khau: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { mat_khau: hashedPassword },
      { new: true },
    );

    return updatedUser;
  }
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (user && user.anh_dai_dien) {
      // Trả về URL của ảnh đại diện
      user.anh_dai_dien = `http://localhost:5000/img/${user.anh_dai_dien}`;
    }
    return user;
  }
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
  // Thêm phương thức lấy tất cả người dùng
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();  // Trả về tất cả người dùng
  }
  // Phương thức xóa người dùng
  async deleteUser(id: string): Promise<User | null> {
    // Tìm người dùng và xóa
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }
  
}
