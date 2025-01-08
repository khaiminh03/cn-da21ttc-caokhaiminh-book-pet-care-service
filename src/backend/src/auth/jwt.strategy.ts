import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface'; // Import interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey', // Đảm bảo rằng secretKey trùng với trong JwtModule
    });
  }

  // Hàm validate để lấy thông tin người dùng từ JWT payload
  async validate(payload: JwtPayload) {
    const user = await this.userService.findOneById(payload.sub); // Dùng phương thức findOneById thay vì findById
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
    return user;  // Trả về thông tin người dùng
  }
}
