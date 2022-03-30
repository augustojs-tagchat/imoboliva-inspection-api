import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import RoleGuard from 'src/authentication/guard/role.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public async getAll() {
    return await this.userService.findAll();
  }

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Patch(':user_id')
  public async update(
    @Param() params: { user_id: string },
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return await this.userService.updateUser(params.user_id, updateUserDto);
  }

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Delete(':user_id')
  public async delete(@Param() params: { user_id: string }) {
    return await this.userService.deleteUser(params.user_id);
  }

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Patch(':user_id/admin')
  public async createAdmin(@Param() params: { user_id: string }) {
    return await this.userService.userToAdmin(params.user_id);
  }
}
