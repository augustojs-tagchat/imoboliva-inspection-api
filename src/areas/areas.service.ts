import { Injectable } from '@nestjs/common';
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

  create(createAreaDto: CreateAreaDto) {
    createAreaDto.active = false;
    const area = new this.areaModel(createAreaDto);
    return area.save();
  }
}
