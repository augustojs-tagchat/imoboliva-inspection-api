import { Controller, Get, Post, Body, Param, Patch, Req } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { CreateEntryInspectionDTO } from './dto/create-entry-inspection.dto';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';

@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @Post('entry')
  createEntryInspection(
    @Body() createEntryInspectionDto: CreateEntryInspectionDTO,
  ) {
    return this.inspectionService.createEntryInspection(
      createEntryInspectionDto,
    );
  }

  @Get(':user_id')
  findOne(@Param() params: { user_id: string }) {
    return this.inspectionService.findByUserId(params.user_id);
  }

  @Get()
  findAll() {
    return this.inspectionService.findAll();
  }

  @Patch(':inspection_id')
  async update(
    @Req() request: RequestWithUser,
    @Param() params: { inspection_id: string },
  ) {
    return await this.inspectionService.updateInspectionAreas(
      params.inspection_id,
      request.user._id,
    );
  }
}
