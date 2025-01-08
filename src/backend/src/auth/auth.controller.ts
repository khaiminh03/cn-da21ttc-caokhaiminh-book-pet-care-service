import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Dữ liệu nhận được từ frontend:', loginDto);
    const result = await this.authService.login(loginDto);
    console.log('Kết quả đăng nhập:', result);  // In kết quả đăng nhập để kiểm tra

    return result;  // Đảm bảo trả về token và thông tin người dùng
  }
  // Phương thức đăng ký
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Dữ liệu nhận được từ frontend:', registerDto);
    return await this.authService.register(registerDto); // Gọi phương thức register trong AuthService
  }
}
