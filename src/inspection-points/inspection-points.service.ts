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
import { UploadInspectionPointImagesDTO } from './dto/upload-inspection-point-images.dto';
import { InspectionService } from 'src/inspection/inspection.service';
import { FilesService } from 'src/files/files.service';
import { FileDocument } from 'src/files/schemas/file.schema';
import { Area } from 'src/areas/schemas/area.schema';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspection/schemas/inspection.schema';

@Injectable()
export class InspectionPointsService {
  constructor(
    @InjectModel(InspectionPoint.name)
    private readonly inspectionPointModel: Model<InspectionPointDocument>,

    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,

    private readonly inspectionService: InspectionService,

    private readonly filesService: FilesService,
  ) {}

  private validObjectId(id: string) {
    const idIsValid = ObjectId.isValid(id);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }
  }

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

  public async uploadImages(
    inspectionPointId: string,
    images: Array<Express.Multer.File>,
    uploadInspectionPointImagesDto: UploadInspectionPointImagesDTO,
  ) {
    this.validObjectId(inspectionPointId);

    this.validObjectId(uploadInspectionPointImagesDto.area_id);

    this.validObjectId(uploadInspectionPointImagesDto.inspection_id);

    const inspection = await this.inspectionService.findById(
      uploadInspectionPointImagesDto.inspection_id,
    );

    const { real_state_areas } = inspection;

    // select area
    const selectedArea: Area = real_state_areas.find(
      (area) => String(area._id) === uploadInspectionPointImagesDto.area_id,
    );

    if (!selectedArea) {
      throw new HttpException(
        'Area with this id does not exist in this inspection ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const filteredAreas = real_state_areas.filter(
      (area) => String(area._id) !== uploadInspectionPointImagesDto.area_id,
    );

    // select inspection point
    const selectedInspectionPoint = selectedArea.inspection_points.find(
      (inspectionPoint) => String(inspectionPoint._id) === inspectionPointId,
    );

    if (!selectedInspectionPoint) {
      throw new HttpException(
        'Inspection point with this id does not exist in this inspection ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const filteredInspectionPoints = selectedArea.inspection_points.filter(
      (inspectionPoint) => String(inspectionPoint._id) !== inspectionPointId,
    );

    if (!selectedInspectionPoint.images) {
      selectedInspectionPoint.images = [];
    }

    const promisesImages = images.map(async (image) => {
      return await this.filesService.uploadFile(
        {
          dataBuffer: image.buffer,
          fileName: image.originalname,
          fileSize: image.size,
          mimetype: image.mimetype,
          urlFileName: `${selectedArea._id}-${image.originalname}`,
        },
        inspection._id,
        String(selectedArea._id),
      );
    });

    const uploadedImages = await Promise.all(promisesImages);

    selectedInspectionPoint.images.push(...uploadedImages);

    filteredInspectionPoints.push(selectedInspectionPoint);

    selectedArea.inspection_points = filteredInspectionPoints;

    filteredAreas.push(selectedArea);

    return await this.inspectionModel.updateOne(
      { _id: inspection._id },
      {
        real_state_areas: filteredAreas,
      },
    );
  }
}
