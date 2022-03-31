import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schema/property.schema';
import { PaginationDTO } from './dto/pagination.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) {}

  public async findAll(pagination: PaginationDTO) {
    const page = parseInt(pagination.page, 10) || 1;
    const limit = parseInt(pagination.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await this.propertyModel.countDocuments();

    let query = this.propertyModel.find();

    query = query.skip(startIndex).limit(limit);

    const properties = await query;

    // Pagination result
    const paginatedData = {
      next: {
        page: 1,
        limit: 1,
      },
      prev: {
        page: 1,
        limit: 1,
      },
    };

    if (endIndex < total) {
      paginatedData.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      paginatedData.prev = {
        page: page - 1,
        limit,
      };
    }

    return {
      properties,
      count: properties.length,
      paginatedData,
    };
  }
}
