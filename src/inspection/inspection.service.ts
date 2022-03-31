import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inspection, InspectionDocument } from './schemas/inspection.schema';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { Model, isValidObjectId } from 'mongoose';
import { UserService } from 'src/users/user.service';
import { Area } from 'src/areas/schemas/area.schema';
import { FilesService } from 'src/files/files.service';
import { ObjectId } from 'mongodb';
import { AddNewAreaDTO } from './dto/add-areas.dto';
import { AreasService } from 'src/areas/areas.service';
import { UpdateEntryInspectionDTO } from './dto/update-entry-inspection.dto';
import { FileDocument } from 'src/files/schemas/file.schema';
import { UpdateExitInspectionDTO } from './dto/update-exit-inspection.dto';
import { validObjectId } from 'src/utils/validObjectId';
@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,

    private readonly userService: UserService,

    private readonly filesService: FilesService,

    private readonly areasService: AreasService,
  ) {}

  public async findById(inspectionId: string) {
    const idIsValid = ObjectId.isValid(inspectionId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const inspection = await this.inspectionModel.findById(inspectionId);

    if (!inspection) {
      throw new HttpException(
        'Inspection with this Id does not exist!',
        HttpStatus.NOT_FOUND,
      );
    }

    return inspection;
  }

  async create(
    createInspectionDto: CreateInspectionDto,
    image: Express.Multer.File,
  ) {
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

    let inspectionImage: FileDocument;

    if (image) {
      const inspection = new this.inspectionModel({
        address,
        active: 'pending',
        name,
        date,
        real_state_areas: [],
        real_state_id,
        user_id: user._id,
        image: null,
      });

      inspectionImage = await this.filesService.uploadFile(
        {
          dataBuffer: image.buffer,
          fileName: image.originalname,
          fileSize: image.size,
          mimetype: image.mimetype,
          urlFileName: `${real_state_id}-${image.originalname}`,
        },
        inspection._id,
      );

      await inspection.save();

      return await this.inspectionModel.updateOne(
        { _id: inspection._id },
        {
          image: inspectionImage,
        },
      );
    }

    const inspection = new this.inspectionModel({
      address,
      active: 'pending',
      name,
      date,
      real_state_areas: [],
      real_state_id,
      user_id: user._id,
      image: null,
    });

    return await inspection.save();
  }

  public async updateEntryInspection(
    inspectionId: string,
    updateEntryInspectionDto: UpdateEntryInspectionDTO,
    images: Array<Express.Multer.File>,
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
        'Inspection with this id does not Id',
        HttpStatus.BAD_REQUEST,
      );
    }

    let selectedArea: Area;
    let updatedAreas;

    inspection.real_state_areas.forEach((area) => {
      if (String(area._id) === String(updateEntryInspectionDto.area_id)) {
        selectedArea = area;
        updatedAreas = inspection.real_state_areas.filter(
          (real_state_area) => real_state_area._id !== area._id,
        );
      }
    });

    if (!selectedArea) {
      throw new HttpException(
        'Area with this Id in this inspection does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    selectedArea.active = true;

    selectedArea.inspection_points.forEach((inspection_point) => {
      const inspectionPointFound =
        updateEntryInspectionDto.inspection_points.find(
          (updateInspectionPoint) =>
            updateInspectionPoint._id === String(inspection_point._id),
        );

      if (inspectionPointFound) {
        inspection_point.entry = inspectionPointFound.entry;
      }
    });

    inspection.real_state_areas = updatedAreas;

    inspection.real_state_areas.push(selectedArea);

    if (images) {
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

      if (selectedArea.images) {
        selectedArea.images.push(...uploadedImages);
      } else {
        selectedArea.images = uploadedImages;
      }

      return await this.inspectionModel.updateOne(
        { _id: inspection._id },
        {
          real_state_areas: inspection.real_state_areas,
          images: selectedArea.images,
        },
      );
    }

    return await this.inspectionModel.updateOne(
      { _id: inspection._id },
      {
        real_state_areas: inspection.real_state_areas,
      },
    );
  }

  public async updateExitInspection(
    inspectionId: string,
    updateExitInspectionDTO: UpdateExitInspectionDTO,
    images: Array<Express.Multer.File>,
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
        'Inspection with this id does not Id',
        HttpStatus.BAD_REQUEST,
      );
    }

    let selectedArea: Area;
    let updatedAreas;

    inspection.real_state_areas.forEach((area) => {
      if (String(area._id) === String(updateExitInspectionDTO.area_id)) {
        selectedArea = area;
        updatedAreas = inspection.real_state_areas.filter(
          (real_state_area) => real_state_area._id !== area._id,
        );
      }
    });

    if (!selectedArea) {
      throw new HttpException(
        'Area with this Id in this inspection does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    selectedArea.active = true;

    selectedArea.inspection_points.forEach((inspection_point) => {
      const inspectionPointFound =
        updateExitInspectionDTO.inspection_points.find(
          (updateInspectionPoint) =>
            updateInspectionPoint._id === String(inspection_point._id),
        );

      if (inspectionPointFound) {
        inspection_point.exit = inspectionPointFound.exit;
      }
    });

    inspection.real_state_areas = updatedAreas;

    inspection.real_state_areas.push(selectedArea);

    if (images) {
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

      if (selectedArea.images) {
        selectedArea.images.push(...uploadedImages);
      } else {
        selectedArea.images = uploadedImages;
      }

      return await this.inspectionModel.updateOne(
        { _id: inspection._id },
        {
          real_state_areas: inspection.real_state_areas,
          images: selectedArea.images,
        },
      );
    }

    return await this.inspectionModel.updateOne(
      { _id: inspection._id },
      {
        real_state_areas: inspection.real_state_areas,
      },
    );
  }

  public async findByUserId(userId: string) {
    validObjectId(userId);

    const user = await this.userService.findById(userId);

    const inspections = await this.inspectionModel.find({
      user_id: user._id,
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

    // if (!(String(inspection.user_id) === String(userId))) {
    //   throw new HttpException(
    //     'User does not have permission to edit this inspection',
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    inspection.real_state_areas.push(newArea);

    if (inspection.active === 'started') {
      return await this.inspectionModel.updateOne(
        { _id: inspectionId },
        {
          real_state_areas: inspection.real_state_areas,
        },
      );
    }

    return await this.inspectionModel.updateOne(
      { _id: inspectionId },
      {
        real_state_areas: newArea,
        active: 'started',
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

    inspection.real_state_areas.forEach((area) => (area.active = false));

    const active = inspection.active === 'started' ? 'entry_done' : 'exit_done';

    await this.inspectionModel.updateOne(
      {
        _id: inspectionId,
      },
      {
        active,
        real_state_areas: inspection.real_state_areas,
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

  public async deleteInspection(inspectionId: string) {
    const inspection = await this.findById(inspectionId);

    return await this.inspectionModel.deleteOne({ _id: inspection._id });
  }
}
