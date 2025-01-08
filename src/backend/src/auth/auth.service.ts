import { Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'; // Import RegisterDto
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Phương thức đăng nhập
  async login(loginDto: LoginDto) {
    // Tìm người dùng theo tên đăng nhập
    const user = await this.userService.findByUsername(loginDto.ten_dang_nhap);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await this.userService.checkPassword(
      loginDto.mat_khau,
      user.mat_khau,  // Mật khẩu đã mã hóa trong cơ sở dữ liệu
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user._id };  // Sử dụng _id của người dùng làm 'sub' trong token
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,  // Lấy secret từ biến môi trường
      expiresIn: '1h',  // Cấu hình thời gian hết hạn của token (1 giờ)
    });

    // Trả về token và thông tin người dùng
    return {
      access_token,
      user: {
        _id: user._id,
        ten_dang_nhap: user.ten_dang_nhap,
        ten_hien_thi: user.ten_hien_thi,  // Đảm bảo trường này có trong cơ sở dữ liệu
        dia_chi: user.dia_chi,  // Đảm bảo trường này có trong cơ sở dữ liệu
        email: user.email,
        id_vaitro: user.id_vaitro,
        sdt: user.sdt,
        trang_thai: user.trang_thai,
      },
    };
  }
  // Phương thức đăng ký
  async register(registerDto: RegisterDto) {
    const { ten_dang_nhap, mat_khau, email, sdt, trang_thai } = registerDto;

    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    const existingUser = await this.userService.findOneByUsername(ten_dang_nhap);
    if (existingUser) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // Tạo người dùng mới
    const newUser = await this.userService.create({
      ten_dang_nhap,
      mat_khau: hashedPassword,
      email,
      sdt,
      trang_thai,
    });

    return newUser; // Trả về người dùng mới đã đăng ký
  }
}
