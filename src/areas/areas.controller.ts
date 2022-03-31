import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { PaginationDTO } from 'src/property/dto/pagination.dto';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDTO } from './dto/update-area.dto';

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
  async findAll(@Query() pagination: PaginationDTO) {
    return await this.areasService.getAll(pagination);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':area_id')
  public async update(
    @Param() params: { area_id: string },
    @Body() updateAreaDto: UpdateAreaDTO,
  ) {
    return await this.areasService.updateArea(params.area_id, updateAreaDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':area_id')
  public async delete(@Param() params: { area_id: string }) {
    return await this.areasService.deleteArea(params.area_id);
  }
}
