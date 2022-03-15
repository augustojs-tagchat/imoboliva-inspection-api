import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateEntryInspectionDTO } from './dto/update-entry-inspection.dto';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import { Area } from 'src/areas/schemas/area.schema';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

import removeSpacesAndEspecialsCharacters from '../utils/removeSpacesAndEspecialsCharacters';

@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('entry/:inspection_id')
  @UseInterceptors(FilesInterceptor('image'))
  public async updateEntryInspection(
    @Body() updateEntryInspectionDto: UpdateEntryInspectionDTO,
    @Param() params: { inspection_id: string },
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const { _id, name, active, inspection_points } = updateEntryInspectionDto;

    // const inspectionPointsFormatted = inspection_points.map((point) =>
    //   removeSpacesAndEspecialsCharacters(point),
    // );

    const isActive = active === 'true';
    const inspectionPointsArrayParsed = JSON.parse(inspection_points);

    const areaToJson = {
      _id,
      name,
      active: isActive,
      inspection_points: inspectionPointsArrayParsed,
    };

    return await this.inspectionService.updateEntryInspection(
      params.inspection_id,
      areaToJson,
      images,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':user_id')
  public async findOne(@Param() params: { user_id: string }) {
    return await this.inspectionService.findByUserId(params.user_id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public async findAll() {
    return await this.inspectionService.findAll();
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

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':inspection_id/finish')
  async finish(@Param() params: { inspection_id: string }) {
    return await this.inspectionService.finishInspection(params.inspection_id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':inspection_id/exit')
  async exit(@Param() params: { inspection_id: string }) {
    return await this.inspectionService.getExitInspection(params.inspection_id);
  }
}
