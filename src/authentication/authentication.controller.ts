import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import RequestWithUser from './interface/requestWithUser.interface';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;

    const cookie = this.authenticationService.getCookieWithJwtToken(user._id);

    response.setHeader('Set-Cookie', cookie);

    user.password = undefined;
    return response.send(user);
  }
}
