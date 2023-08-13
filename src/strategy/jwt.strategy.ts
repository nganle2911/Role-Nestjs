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
      try {
        const { sub: userId, role } = payload;
  
        const user = await this.prisma.users.findUnique({
          where: { user_id: userId },
        });
  
        if (!user) {
          throw new UnauthorizedException();
        }
  
        // Kiểm tra vai trò của người dùng
        if (role !== user.user_role) {
          throw new UnauthorizedException();
        }
  
        return user;
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
  }