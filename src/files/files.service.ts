import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';
import mongoose from 'mongoose';
import { FileUploadDTO } from './dto/file-upload.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<FileDocument>,
  ) {}

  async imageUpload(fileUploadDto: FileUploadDTO) {
    const s3 = new S3({
      endpoint: process.env.PUBLIC_DO_SPACES_ENDPOINT,
      accessKeyId: process.env.PUBLIC_DO_SPACES_KEY,
      secretAccessKey: process.env.PUBLIC_DO_SPACES_SECRET,
    });

    const body = {
      Bucket: `${process.env.PUBLIC_DO_SPACES_NAME}/imob-oliva/inspection/areas`,
      Key: fileUploadDto.fileName,
      ACL: 'public-read',
      Body: fileUploadDto.dataBuffer,
      ContentType: fileUploadDto.mimetype,
    };

    return new Promise<File>((resolve, reject) => {
      s3.putObject(body, async (err) => {
        if (err) {
          reject(err);
        } else {
          const urlFile = `https://${process.env.PUBLIC_DO_SPACES_NAME}.${
            process.env.PUBLIC_DO_SPACES_ENDPOINT
          }/area-image-${new Date()}`;

          const newFile = new this.fileModel({
            key: fileUploadDto.fileName,
            mimetype: fileUploadDto.mimetype,
            file_size: fileUploadDto.fileSize,
            url: urlFile,
          });

          await newFile.save();
          resolve(newFile);
        }
      });
    });
  }
}
