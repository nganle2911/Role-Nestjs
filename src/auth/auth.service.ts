// auth/auth.service.ts
import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Role } from 'src/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,private configService: ConfigService) {}

  prisma = new PrismaClient();
  // Signup
  async signUp(userSignup) {
    try {
      let { email, pass_word, full_name, birth_day, gender, user_role, phone } = userSignup;
        
      // Check email if exists
      let checkEmail = await this.prisma.users.findFirst({
        where: {
          email,
        }
      });

      if (checkEmail) {
        throw new BadRequestException({
          statusCode: 400,
          message: "Email already exists!",
          dateTime: new Date().toISOString()
        })
      } else {
        let newUser = {
          email,
          pass_word: bcrypt.hashSync(pass_word, 10),
          full_name,
          birth_day,
          gender,
          user_role: Role.User,
          phone,
        };

        await this.prisma.users.create({
          data: newUser,
        });

        return {
          statusCode: 200,
          message: 'Sign up successfully!',
          content: newUser,
          dateTime: new Date().toISOString(),
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  // Signup for Admin
  async createAdmin(adminSignup) {
    try {
      const {email, pass_word, full_name, birth_day, gender, user_role, phone} = adminSignup;

      // Check email if exists
      let checkEmail = await this.prisma.users.findFirst({
        where: {
          email
        }
      });

      if (checkEmail) {
        throw new BadRequestException({
          statusCode: 400,
          message: "Email already exists!",
          dateTime: new Date().toISOString()
        })
      } else {
        let newUser = {
          email,
          pass_word: bcrypt.hashSync(pass_word, 10),
          full_name,
          birth_day,
          gender,
          user_role: Role.Admin,
          phone,
        };

        await this.prisma.users.create({
          data: newUser,
        });

        return {
          statusCode: 200,
          message: 'Sign up successfully!',
          content: newUser,
          dateTime: new Date().toISOString(),
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status); 
    }
  }

  // Login
  async login(userLogin) {
    try {
      const { email, pass_word } = userLogin;

      let checkUser = await this.prisma.users.findFirst({
        where: {
          email,
        },
      });

      if (checkUser) {
        if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
          checkUser = { ...checkUser, pass_word: '' };

          // generate token with user_id and user_role inside 
          let tokenGenerate = await this.jwtService.signAsync(
            { user_id: Number(checkUser.user_id), user_role: checkUser.user_role },
            { secret: this.configService.get('KEY'), expiresIn: '60m' },
          );

          return {
            statusCode: 200,
            message: 'Login successfully!',
            content: {
              userLogin: checkUser,
              token: tokenGenerate,
            },
            dateTime: new Date().toISOString(),
          };
        } else {
          // throw new HttpException('Password is incorrect!', 400);
          throw new BadRequestException({
            statusCode: 400,
            message: 'Request is invalid',
            content: 'Password is incorrect!',
            dateTime: new Date().toISOString(),
          });
        }
      } else {
        // throw new HttpException('Email or password is incorrect!', 400);
        throw new BadRequestException({
          statusCode: 400,
          message: 'Request is invalid',
          content: 'Email or password is incorrect!',
          dateTime: new Date().toISOString(),
        });
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}