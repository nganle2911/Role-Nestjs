import { Injectable,HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();
  async getUsers() {
    // Logic lấy danh sách người dùng
    try {
      let getUsers = await this.prisma.users.findMany();
      let data = getUsers.map((user) => ({ ...user, pass_word: '' }));

      return {
        statusCode: 200,
        message: 'Get users successfully!',
        content: data,
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}