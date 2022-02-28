import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('inspections')
  @UseGuards(JwtAuthenticationGuard)
  inspections() {
    return { status: 200, data: 'Your inspections' };
  }
}
