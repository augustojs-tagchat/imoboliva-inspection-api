import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appraiser, AppraiserDocument } from './schemas/appraiser.schema';
import { CreateAppraiserDto } from './dto/create-appraiser.dto';
import { UpdateAppraiserDto } from './dto/update-appraiser.dto';
import { Model } from 'mongoose';
@Injectable()
export class AppraiserService {
  constructor(
    @InjectModel(Appraiser.name)
    private appraiserModel: Model<AppraiserDocument>,
  ) {}

  async create(createAppraiserDto: CreateAppraiserDto) {
    const appraiser = new this.appraiserModel(createAppraiserDto);
    return appraiser.save();
  }

  findAll() {
    return `This action returns all appraiser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appraiser`;
  }

  update(id: number, updateAppraiserDto: UpdateAppraiserDto) {
    return `This action updates a #${id} appraiser`;
  }

  remove(id: number) {
    return `This action removes a #${id} appraiser`;
  }
}
