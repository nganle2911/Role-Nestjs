// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'NODE32',
    });
  }
  prisma = new PrismaClient();
  async validate(payload: any) {
    // Tùy chỉnh cách bạn xác định user và vai trò của user từ payload
    // Ở đây, chúng ta giả sử user và role được lưu trong payload
    const { sub: userId, username, role } = payload;
    console.log(payload)
    // Truy vấn cơ sở dữ liệu để lấy thông tin chi tiết của người dùng
    const user = await this.prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(); // Người dùng không hợp lệ
    }

    // Kiểm tra vai trò của người dùng
    if (role !== user.user_role) {
      throw new UnauthorizedException(); // Người dùng không có vai trò phù hợp
    }

    return user; // Trả về thông tin người dùng sau khi xác thực và kiểm tra vai trò
  }
}
