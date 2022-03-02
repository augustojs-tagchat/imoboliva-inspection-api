import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { InspectionPointsService } from './inspection-points.service';
import { CreateInspectionPointDto } from './dto/create-inspection-point.dto';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';

@Controller('inspection-points')
export class InspectionPointsController {
  constructor(
    private readonly inspectionPointsService: InspectionPointsService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createInspectionPointDto: CreateInspectionPointDto) {
    return this.inspectionPointsService.create(createInspectionPointDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public async getAll() {
    return await this.inspectionPointsService.findAll();
  }
}
