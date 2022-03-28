import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { InspectionPointsService } from './inspection-points.service';
import { CreateInspectionPointDto } from './dto/create-inspection-point.dto';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { UpdateInspectionPointDTO } from './dto/update-inspection-point.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadInspectionPointImagesDTO } from './dto/upload-inspection-point-images.dto';

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

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':inspection_point_id')
  public async update(
    @Param() params: { inspection_point_id: string },
    @Body() updateInspectionPointDto: UpdateInspectionPointDTO,
  ) {
    return await this.inspectionPointsService.updateInspectionPoint(
      params.inspection_point_id,
      updateInspectionPointDto,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':inspection_point_id')
  public async delete(@Param() params: { inspection_point_id: string }) {
    return await this.inspectionPointsService.deleteInspectionPoint(
      params.inspection_point_id,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':inspection_point_id/images')
  @UseInterceptors(FilesInterceptor('images'))
  public async images(
    @Param() params: { inspection_point_id: string },
    @Body() uploadInspectionPointImagesDto: UploadInspectionPointImagesDTO,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return await this.inspectionPointsService.uploadImages(
      params.inspection_point_id,
      images,
      uploadInspectionPointImagesDto,
    );
  }
}
