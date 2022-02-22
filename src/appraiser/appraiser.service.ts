import { Injectable } from '@nestjs/common';
import { CreateAppraiserDto } from './dto/create-appraiser.dto';
import { UpdateAppraiserDto } from './dto/update-appraiser.dto';

@Injectable()
export class AppraiserService {
  create(createAppraiserDto: CreateAppraiserDto) {
    return 'This action adds a new appraiser';
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
