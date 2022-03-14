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
import { ObjectId } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';

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
    @Param() params: { inspection_id: ObjectId },
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const { _id, active, name, inspection_points, created_at, updated_at } =
      updateEntryInspectionDto;

    const areaToJson = {
      _id,
      active,
      name,
      inspection_points,
      created_at,
      updated_at,
    };

    const inspectionPointsArray = areaToJson.inspection_points;

    areaToJson.inspection_points = inspectionPointsArray;

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
}
