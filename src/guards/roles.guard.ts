// auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // Nếu không có xác định vai trò yêu cầu, cho phép truy cập
    }

    const { user } = context.switchToHttp().getRequest();
    console.log("user", user);
    // return requiredRoles.some((role) => user.roles?.includes(role));

    return requiredRoles.includes(user.user_role);
  }
}