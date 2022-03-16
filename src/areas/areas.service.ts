import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { Model } from 'mongoose';
import { isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Area, AreaDocument } from './schemas/area.schema';
import { FilesService } from 'src/files/files.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<AreaDocument>,

    private readonly filesService: FilesService,
  ) {}

  public async create(createAreaDto: CreateAreaDto) {
    const newArea = await this.areaModel.findOne({ name: createAreaDto.name });

    if (newArea) {
      throw new HttpException(
        'Name for new area already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    createAreaDto.active = false;
    const area = new this.areaModel(createAreaDto);
    return area.save();
  }

  public async getAll() {
    const areas = await this.areaModel.find();
    return areas;
  }

  public async findAreaById(areaId: string) {
    const idIsValid = ObjectId.isValid(areaId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const area = await this.areaModel.findById(areaId);

    if (!area) {
      throw new HttpException(
        'Area with this Id does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    return area;
  }

  // public async uploadAreaImages(image: Express.Multer.File) {
  //   await this.filesService.imageUpload({
  //     dataBuffer: image.buffer,
  //     fileName: image.originalname,
  //     fileSize: image.size,
  //     mimetype: image.mimetype,
  //   });
  // }
}
