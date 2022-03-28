import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import RoleGuard from 'src/authentication/guard/role.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Patch(':user_id')
  public async update(
    @Param() params: { user_id: string },
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return await this.userService.updateUser(params.user_id, updateUserDto);
  }
}
