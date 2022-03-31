import { Controller, Get } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  public async findAll() {
    return await this.propertyService.findAll();
  }
}
