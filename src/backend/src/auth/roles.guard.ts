// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard'; // Đảm bảo bạn có JwtAuthGuard

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Nếu không có roles, thì mặc định cho phép truy cập
    }

    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.some(role => user.roles?.includes(role)); // Kiểm tra quyền của user
  }
}
