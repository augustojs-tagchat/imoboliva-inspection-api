import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.schema';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Model, isValidObjectId } from 'mongoose';
import { UserService } from 'src/users/user.service';
import mongoose from 'mongoose';
import { CreateEntryInspectionDTO } from './dto/create-entry-inspection.dto';
import {
  EntryInspectionDocument,
  EntryInspection,
} from './schemas/entry-inspection.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,

    @InjectModel(EntryInspection.name)
    private readonly entryInspectionModel: Model<EntryInspectionDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createInspectionDto: CreateInspectionDto) {
    const { address, name, email, real_state_id, date } = createInspectionDto;

    const user = await this.userService.findByEmail(email);

    const newInspection = await this.inspectionModel.findOne({ name: name });

    if (newInspection) {
      throw new HttpException(
        'Name for inspection already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid = isValidObjectId(real_state_id);

    if (!isValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = new this.inspectionModel({
      address,
      active: 'pending',
      name,
      date,
      real_state_areas: null,
      real_state_id,
      user_id: user._id,
    });

    return inspection.save();
  }

  async createEntryInspection(
    createEntryInspectionDto: CreateEntryInspectionDTO,
  ) {
    const { address, name, real_state_id, areas, inspection_id, user_id } =
      createEntryInspectionDto;

    const isValid = isValidObjectId(real_state_id);

    if (!isValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = new this.entryInspectionModel({
      address,
      areas,
      inspection_id,
      active: 'started',
      name,
      real_state_id,
      user_id: user_id,
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

  async updateInspectionAreas(inspectionId: string, userId: ObjectId) {
    //
  }
}
