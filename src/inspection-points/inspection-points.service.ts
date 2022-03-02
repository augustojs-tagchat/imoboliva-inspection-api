import { Injectable } from '@nestjs/common';
import { CreateInspectionPointDto } from './dto/create-inspection-point.dto';
import { Model } from 'mongoose';
import { ObjectId, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  InspectionPoint,
  InspectionPointDocument,
} from './schemas/inspection-point.schema';

@Injectable()
export class InspectionPointsService {
  constructor(
    @InjectModel(InspectionPoint.name)
    private inspectionPointModel: Model<InspectionPointDocument>,
  ) {}

  public async create(createInspectionPointDto: CreateInspectionPointDto) {
    const inspectionPoint = new this.inspectionPointModel(
      createInspectionPointDto,
    );

    return await inspectionPoint.save();
  }

  public async findAll() {
    const inspectionPoints = await this.inspectionPointModel.find();
    return inspectionPoints;
  }
}
