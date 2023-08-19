import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  async getAdmin() {
    try {
      let getAdmin = await this.prisma.users.findMany({
        where: {
          user_role: Role.Admin
        }
      });
      console.log("getAdmin", getAdmin)
      let data = getAdmin.map((admin) => ({ ...admin, pass_word: '' }));

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
