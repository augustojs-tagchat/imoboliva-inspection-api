import { Controller, Get, Param } from '@nestjs/common';
import { AppraiserService } from './appraiser.service';

@Controller('appraiser')
export class AppraiserController {
  constructor(private readonly appraiserService: AppraiserService) {}

  @Get(':id')
  public async findOne(@Param('id') userId: string) {
    return await this.appraiserService.findById(userId);
  }
}
