import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.schema';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Model, isValidObjectId } from 'mongoose';
import { UserService } from 'src/users/user.service';
import mongoose from 'mongoose';
import { Area } from 'src/areas/schemas/area.schema';
import { FilesService } from 'src/files/files.service';
import { ObjectId } from 'mongodb';
import { AddNewAreaDTO } from './dto/add-areas.dto';
import { AreasService } from 'src/areas/areas.service';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,

    private readonly userService: UserService,

    private readonly filesService: FilesService,

    private readonly areasService: AreasService,
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
      real_state_areas: [],
      real_state_id,
      user_id: user._id,
    });

    return await inspection.save();
  }

  public async updateEntryInspection(
    inspectionId: string,
    area: any,
    images?: Array<Express.Multer.File>,
  ) {
    const idIsValid = ObjectId.isValid(inspectionId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspectionEntry = await this.inspectionModel.findOne({
      _id: inspectionId,
    });

    if (!inspectionEntry) {
      throw new HttpException(
        'Inspection Entry with this id not found',
        HttpStatus.NOT_FOUND,
      );
    }

    let areasArray = [];
    if (inspectionEntry.areas) {
      areasArray = [...inspectionEntry.areas];
    }

    area.images = [];

    if (images) {
      const promisesImages = images.map(async (image) => {
        return await this.filesService.imageUpload({
          dataBuffer: image.buffer,
          fileName: image.originalname,
          fileSize: image.size,
          mimetype: image.mimetype,
          urlFileName: `${inspectionEntry._id}-${area._id}-${image.originalname}`,
        });
      });

      area.images = await Promise.all(promisesImages);
    }

    areasArray.push(area);

    await this.inspectionModel.updateOne(
      { _id: inspectionEntry._id },
      {
        real_state_areas: areasArray,
      },
    );
  }

  public async findByUserId(userId: string) {
    const idIsValid = ObjectId.isValid(userId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspections = await this.inspectionModel.find({
      user_id: userId,
    });

    return inspections;
  }

  public async findAll() {
    return await this.inspectionModel.find();
  }

  public async updateInspectionAreas(
    inspectionId: string,
    userId: string | ObjectId,
    area: AddNewAreaDTO,
  ) {
    const idIsValid = ObjectId.isValid(inspectionId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = await this.inspectionModel.findOne({
      _id: inspectionId,
    });

    if (!inspection) {
      throw new HttpException(
        'Inspection with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const newArea = await this.areasService.findAreaById(area.area_id);

    let areaAlreadyExists;

    if (inspection.real_state_areas) {
      areaAlreadyExists = inspection.real_state_areas.filter(
        (inspection_areas) => String(inspection_areas._id) === area.area_id,
      );
    }

    if (areaAlreadyExists.length > 0) {
      throw new HttpException(
        'Area already added to this inspection',
        HttpStatus.BAD_REQUEST,
      );
    }

    newArea.inspection_points = area.inspection_points;

    if (!(String(inspection.user_id) === String(userId))) {
      throw new HttpException(
        'User does not have permission to edit this inspection',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.inspectionModel.updateOne(
      { _id: inspectionId },
      {
        real_state_areas: newArea,
      },
    );
  }

  public async finishInspection(inspectionId: string) {
    const idIsValid = ObjectId.isValid(inspectionId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = await this.inspectionModel.findOne({
      _id: inspectionId,
    });

    if (!inspection) {
      throw new HttpException(
        'Inspection with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.inspectionModel.updateOne(
      {
        _id: inspectionId,
      },
      {
        active: 'done',
      },
    );
  }

  async getExitInspection(inspectionId: string) {
    const idIsValid = ObjectId.isValid(inspectionId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = await this.inspectionModel.findOne({
      _id: inspectionId,
      active: 'done',
    });

    if (!inspection) {
      throw new HttpException(
        'Inspection done with this Id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return inspection.areas;
  }
}
