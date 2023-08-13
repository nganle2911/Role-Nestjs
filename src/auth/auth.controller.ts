// auth/auth.controller.ts
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { loginType, userType } from './dto/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  prisma = new PrismaClient();

  // Signup
  @Post('/sign-up')
  signUp(@Body() userSignup: userType) {
    return this.authService.signUp(userSignup);
  }
  
  // Signup for Admin
  @Post("/register-admin")
  createAdmin(@Body() adminSignup: userType) {
    return this.authService.createAdmin(adminSignup); 
  }
  
  // Login
  @Post('/login')
  login(@Body() userLogin: loginType) {
    return this.authService.login(userLogin);
  }
  
}