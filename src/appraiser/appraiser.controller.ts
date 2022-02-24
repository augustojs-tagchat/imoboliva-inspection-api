import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppraiserService } from './appraiser.service';
import { CreateAppraiserDto } from './dto/create-appraiser.dto';
import { UpdateAppraiserDto } from './dto/update-appraiser.dto';

@Controller('appraiser')
export class AppraiserController {
  constructor(private readonly appraiserService: AppraiserService) {}

  @Post()
  async create(@Body() createAppraiserDto: CreateAppraiserDto) {
    return await this.appraiserService.create(createAppraiserDto);
  }

  @Get()
  findAll() {
    return this.appraiserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appraiserService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppraiserDto: UpdateAppraiserDto,
  ) {
    return this.appraiserService.update(+id, updateAppraiserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appraiserService.remove(+id);
  }
}
