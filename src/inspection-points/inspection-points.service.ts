import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInspectionPointDto } from './dto/create-inspection-point.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  InspectionPoint,
  InspectionPointDocument,
} from './schemas/inspection-point.schema';
import { UpdateInspectionPointDTO } from './dto/update-inspection-point.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class InspectionPointsService {
  constructor(
    @InjectModel(InspectionPoint.name)
    private inspectionPointModel: Model<InspectionPointDocument>,
  ) {}

  public async findById(inspectionPointId: string) {
    const idIsValid = ObjectId.isValid(inspectionPointId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspectionPoint = await this.inspectionPointModel.findById(
      inspectionPointId,
    );

    if (!inspectionPoint) {
      throw new HttpException(
        'Inspection point with this Id does not exist!',
        HttpStatus.NOT_FOUND,
      );
    }

    return inspectionPoint;
  }

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

  public async updateInspectionPoint(
    inspectionPointId: string,
    updateInspectionPointDto: UpdateInspectionPointDTO,
  ) {
    const inspectionPoint = await this.findById(inspectionPointId);

    return await this.inspectionPointModel.updateOne(
      { _id: inspectionPoint._id },
      { ...updateInspectionPointDto },
    );
  }

  public async deleteInspectionPoint(inspectionPointId: string) {
    const inspectionPoint = await this.findById(inspectionPointId);

    return await this.inspectionPointModel.deleteOne({
      _id: inspectionPoint._id,
    });
  }
}
