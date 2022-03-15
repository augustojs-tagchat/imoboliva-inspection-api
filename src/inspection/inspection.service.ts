import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.schema';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Model, isValidObjectId } from 'mongoose';
import { UserService } from 'src/users/user.service';
import mongoose from 'mongoose';
import {
  EntryInspectionDocument,
  EntryInspection,
} from './schemas/entry-inspection.schema';
import { Area } from 'src/areas/schemas/area.schema';
import { FilesService } from 'src/files/files.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,

    @InjectModel(EntryInspection.name)
    private readonly entryInspectionModel: Model<EntryInspectionDocument>,

    private readonly userService: UserService,

    private readonly filesService: FilesService,
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

    const inspectionEntry = new this.entryInspectionModel({
      address,
      active: 'pending',
      name,
      date,
      real_state_areas: [],
      real_state_id,
      user_id: user._id,
      id_inspection: inspection._id,
    });

    await inspectionEntry.save();

    return await inspection.save();
  }

  public async updateEntryInspection(
    inspectionId: string,
    area: any,
    images?: Array<Express.Multer.File>,
  ) {
    const inspectionEntry = await this.entryInspectionModel.findOne({
      id_inspection: inspectionId,
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

    await this.entryInspectionModel.updateOne(
      { _id: inspectionEntry._id },
      {
        areas: areasArray,
      },
    );
  }

  public async findByUserId(userId: string) {
    const id = new mongoose.Types.ObjectId(userId);

    const inspections = await this.inspectionModel.find({
      user_id: id,
    });

    return inspections;
  }

  public async findAll() {
    return await this.inspectionModel.find();
  }

  public async updateInspectionAreas(
    inspectionId: string,
    userId: any,
    area: Area,
  ) {
    const inspection = await this.inspectionModel.findOne({
      _id: inspectionId,
    });

    if (!inspection) {
      throw new HttpException(
        'Inspection with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(String(inspection.user_id) === String(userId))) {
      throw new HttpException(
        'User does not have permission to edit this inspection',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedAreas = inspection.real_state_areas;

    let areasAlreadyExist;

    if (updatedAreas) {
      areasAlreadyExist = updatedAreas.find((id) => id._id === area._id);
    }

    if (!areasAlreadyExist) {
      updatedAreas.push(area);
    } else {
      const indexArea = updatedAreas.findIndex((id) => id._id === area._id);

      updatedAreas[indexArea] = area;
    }

    await this.inspectionModel.updateOne(
      {
        _id: inspection._id,
      },
      { real_state_areas: updatedAreas },
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

    await this.entryInspectionModel.findOneAndUpdate({
      id_inspection: inspectionId,
      active: 'done',
    });

    await this.inspectionModel.findOneAndUpdate({
      _id: inspectionId,
      active: 'done',
    });
  }

  async getExitInspection(inspectionId: string) {
    const idIsValid = ObjectId.isValid(inspectionId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = await this.entryInspectionModel.findOne({
      id_inspection: inspectionId,
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
