import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async findAll() {
    return await this.areasService.getAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch()
  public async update() {
    return await this.areasService.updateArea();
  }
}
