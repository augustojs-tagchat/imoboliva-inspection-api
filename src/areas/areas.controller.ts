import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { Express } from 'express';

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
  async findAll() {
    return await this.areasService.getAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('images')
  @UseInterceptors(FileInterceptor('image'))
  public async imagesUpload(@UploadedFile() image: Express.Multer.File) {
    return await this.areasService.uploadAreaImages(image);
  }
}
