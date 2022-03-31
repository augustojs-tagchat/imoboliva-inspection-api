import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PaginationDTO } from './dto/pagination.dto';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public async findAll(@Query() pagination: PaginationDTO) {
    return await this.propertyService.findAll(pagination);
  }
}
