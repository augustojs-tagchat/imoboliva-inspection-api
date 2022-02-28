import { Injectable } from '@nestjs/common';
import { CreateInspectionPointDto } from './dto/create-inspection-point.dto';
import { Model } from 'mongoose';
import { ObjectId, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  InspectionPoint,
  InspectionPointDocument,
} from '../inspection-points/schemas/inspection-point.entity';

@Injectable()
export class InspectionPointsService {
  constructor(
    @InjectModel(InspectionPoint.name)
    private inspectionPointModel: Model<InspectionPointDocument>,
  ) {}

  create(createInspectionPointDto: CreateInspectionPointDto) {
    const inspectionPoint = new this.inspectionPointModel(
      createInspectionPointDto,
    );

    return inspectionPoint.save();
  }
}
