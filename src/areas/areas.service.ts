import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { Model } from 'mongoose';
import { ObjectId, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Area, AreaDocument } from './schemas/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private areaModel: Model<AreaDocument>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
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

  async getAll() {
    const areas = await this.areaModel.find();
    return areas;
  }
}
