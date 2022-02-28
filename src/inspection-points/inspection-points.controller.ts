import { Controller, Post, Body, Get } from '@nestjs/common';
import { InspectionPointsService } from './inspection-points.service';
import { CreateInspectionPointDto } from './dto/create-inspection-point.dto';

@Controller('inspection-points')
export class InspectionPointsController {
  constructor(
    private readonly inspectionPointsService: InspectionPointsService,
  ) {}

  @Post()
  create(@Body() createInspectionPointDto: CreateInspectionPointDto) {
    return this.inspectionPointsService.create(createInspectionPointDto);
  }
}
