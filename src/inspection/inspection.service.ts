import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { Model, isValidObjectId } from 'mongoose';
import { IRealState } from './interface/real-state.interface';
import { UserService } from 'src/users/user.service';
import mongoose from 'mongoose';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createInspectionDto: CreateInspectionDto) {
    const { address, name, email, real_state_id } = createInspectionDto;

    const user = await this.userService.findByEmail(email);

    const isValid = isValidObjectId(real_state_id);

    if (!isValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = new this.inspectionModel({
      address,
      active: 'pending',
      name,
      email,
      real_state_id,
      user_id: user._id,
    });

    return inspection.save();
  }

  async findByUserId(userId: string) {
    const id = new mongoose.Types.ObjectId(userId);

    const inspections = await this.inspectionModel.find({
      user_id: id,
    });

    return inspections;
  }

  findAll() {
    return this.inspectionModel.find();
  }
}
