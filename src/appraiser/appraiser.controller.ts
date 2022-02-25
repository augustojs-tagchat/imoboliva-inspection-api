import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { AppraiserService } from './appraiser.service';

@Controller('appraiser')
export class AppraiserController {
  constructor(private readonly appraiserService: AppraiserService) {}

  @Get('inspections')
  @UseGuards(JwtAuthenticationGuard)
  inspections() {
    return { status: 200, data: 'Your inspections' };
  }

  // @Get(':id')
  // public async findOne(@Param('id') userId: string) {}
}
