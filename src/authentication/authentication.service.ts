import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AppraiserService } from 'src/appraiser/appraiser.service';
import { LoginDTO } from './dto/login.dto';
@Injectable()
export class AuthenticationService {
  constructor(private readonly appraiser: AppraiserService) {}

  public async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const appraiser = await this.appraiser.findByEmail(registerDto.email);

    if (appraiser) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.appraiser.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  public async login(loginDto: LoginDTO) {
    const appraiser = await this.appraiser.findByEmail(loginDto.email);

    if (!appraiser) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.verifyPassword(loginDto.password, appraiser.password);
  }

  private async verifyPassword(
    appraiserPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      appraiserPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
