import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Area, AreaDocument } from './schemas/area.schema';
import { FilesService } from 'src/files/files.service';
import { ObjectId } from 'mongodb';
import { UpdateAreaDTO } from './dto/update-area.dto';
import { PaginationDTO } from 'src/property/dto/pagination.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<AreaDocument>,
  ) {}

  public async create(createAreaDto: CreateAreaDto) {
    const newArea = await this.areaModel.findOne({ name: createAreaDto.name });

    if (newArea) {
      throw new HttpException(
        'Name for new area already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    createAreaDto.active = false;
    const area = new this.areaModel(createAreaDto);
    return area.save();
  }

  public async getAll(pagination: PaginationDTO) {
    const page = parseInt(pagination.page, 10) || 1;
    const limit = parseInt(pagination.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await this.areaModel.countDocuments();

    let query = this.areaModel.find();

    query = query.skip(startIndex).limit(limit);

    const data = await query;

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
      data,
      count: data.length,
      paginatedData,
    };
  }

  public async findAreaById(areaId: string) {
    const idIsValid = ObjectId.isValid(areaId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const area = await this.areaModel.findById(areaId);

    if (!area) {
      throw new HttpException(
        'Area with this Id does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    return area;
  }

  public async updateArea(areaId: string, updateAreaDto: UpdateAreaDTO) {
    const area = await this.findAreaById(areaId);

    return await this.areaModel.updateOne(
      { _id: area._id },
      { ...updateAreaDto },
    );
  }

  public async deleteArea(areaId: string) {
    const area = await this.findAreaById(areaId);

    return await this.areaModel.deleteOne({
      _id: area._id,
    });
  }
}
