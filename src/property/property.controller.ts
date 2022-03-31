import { Controller, Get, Query } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PaginationDTO } from './dto/pagination.dto';
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  public async findAll(@Query() pagination: PaginationDTO) {
    return await this.propertyService.findAll(pagination);
  }
}
