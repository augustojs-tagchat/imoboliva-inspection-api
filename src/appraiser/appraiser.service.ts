import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appraiser, AppraiserDocument } from './schemas/appraiser.schema';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { Model } from 'mongoose';
@Injectable()
export class AppraiserService {
  constructor(
    @InjectModel(Appraiser.name)
    private appraiserModel: Model<AppraiserDocument>,
  ) {}

  public async create(registerDto: RegisterDto) {
    const appraiser = new this.appraiserModel(registerDto);
    return appraiser.save();
  }

  public async findByEmail(email: string) {
    return await this.appraiserModel.findOne({ email: email });
  }

  public async findById(userId: string) {
    return await this.appraiserModel.findOne({ _id: userId });
  }
}
