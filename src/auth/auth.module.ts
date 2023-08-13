// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/strategy/jwt.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'NODE32',
      signOptions: { expiresIn: '1h' }, // Thời gian hết hạn của token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService để sử dụng ở các module khác
})
export class AuthModule {}