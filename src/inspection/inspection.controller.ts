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
  UploadedFile,
  Delete,
  Query,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateEntryInspectionDTO } from './dto/update-entry-inspection.dto';
import { UpdateExitInspectionDTO } from './dto/update-exit-inspection.dto';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AddNewAreaDTO } from './dto/add-areas.dto';
import RoleGuard from 'src/authentication/guard/role.guard';
import { PaginationDTO } from 'src/property/dto/pagination.dto';

@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createInspectionDto: CreateInspectionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    createInspectionDto.address = JSON.parse(
      String(createInspectionDto.address),
    );

    return this.inspectionService.create(createInspectionDto, image);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('entry/:inspection_id')
  @UseInterceptors(FilesInterceptor('images'))
  public async updateEntryInspection(
    @Body() updateEntryInspectionDto: UpdateEntryInspectionDTO,
    @Param() params: { inspection_id: string },
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const parsedInspectionPoints = JSON.parse(
      String(updateEntryInspectionDto.inspection_points),
    );

    const { data } = parsedInspectionPoints;

    const dataArray = [...data];

    updateEntryInspectionDto.inspection_points = dataArray;

    return await this.inspectionService.updateEntryInspection(
      params.inspection_id,
      updateEntryInspectionDto,
      images,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('exit/:inspection_id')
  @UseInterceptors(FilesInterceptor('images'))
  public async updateExitInspection(
    @Body() updateExitInspectionDTO: UpdateExitInspectionDTO,
    @Param() params: { inspection_id: string },
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const parsedInspectionPoints = JSON.parse(
      String(updateExitInspectionDTO.inspection_points),
    );

    const { data } = parsedInspectionPoints;

    const dataArray = [...data];

    updateExitInspectionDTO.inspection_points = dataArray;

    return await this.inspectionService.updateExitInspection(
      params.inspection_id,
      updateExitInspectionDTO,
      images,
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('user/:user_id')
  public async findOne(@Param() params: { user_id: string }) {
    return await this.inspectionService.findByUserId(params.user_id);
  }

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public async findAll(@Query() pagination: PaginationDTO) {
    return await this.inspectionService.findAll(pagination);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':inspection_id')
  async update(
    @Req() request: RequestWithUser,
    @Param() params: { inspection_id: string },
    @Body() addNewAreaDto: AddNewAreaDTO,
  ) {
    return await this.inspectionService.updateInspectionAreas(
      params.inspection_id,
      request.user._id,
      addNewAreaDto,
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

  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtAuthenticationGuard)
  @Delete(':inspection_id')
  public async delete(@Param() params: { inspection_id: string }) {
    return await this.inspectionService.deleteInspection(params.inspection_id);
  }
}
