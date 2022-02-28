import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';

@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @Get(':user_id')
  findOne(@Param() params: { user_id: string }) {
    return this.inspectionService.findByUserId(params.user_id);
  }

  @Get()
  findAll() {
    return this.inspectionService.findAll();
  }
}
