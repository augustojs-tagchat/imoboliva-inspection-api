import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { CreateEntryInspectionDTO } from './dto/create-entry-inspection.dto';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import { Area } from 'src/areas/schemas/area.schema';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { UpdateInspectionAreasDTO } from './dto/update-inspection-areas.dto';

@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('entry')
  createEntryInspection(
    @Body() createEntryInspectionDto: CreateEntryInspectionDTO,
  ) {
    return this.inspectionService.createEntryInspection(
      createEntryInspectionDto,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':user_id')
  findOne(@Param() params: { user_id: string }) {
    return this.inspectionService.findByUserId(params.user_id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll() {
    return this.inspectionService.findAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':inspection_id')
  async update(
    @Req() request: RequestWithUser,
    @Param() params: { inspection_id: string },
    @Body() inspectionAreaDto: Area,
  ) {
    return await this.inspectionService.updateInspectionAreas(
      params.inspection_id,
      request.user._id,
      inspectionAreaDto,
    );
  }
}
