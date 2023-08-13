import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();
  async getUsers() {
    try {
      let getUsers = await this.prisma.users.findMany();
      let data = getUsers.map((user) => ({ ...user, pass_word: '' }));

      return {
        statusCode: HttpStatus.OK,
        message: 'Get users successfully!',
        content: data,
        dateTime: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
