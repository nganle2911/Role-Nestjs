// user/user.controller.ts
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from './users.service';
import { ApiHeader } from '@nestjs/swagger';
@Controller('users')
export class UserController {

  constructor(private readonly usersService: UsersService) {}


  // Get admin
  @Get("get-admin")
  @Roles(Role.User) // Xác định vai trò cần thiết để truy cập
  @UseGuards(RolesGuard) // Sử dụng RolesGuard để kiểm tra phân quyền
  getAdmin() {
    // Logic lấy danh sách người dùng
    return this.usersService.getAdmin();
  }
}