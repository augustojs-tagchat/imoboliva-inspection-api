import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { FileUploadDTO } from './dto/file-upload.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<FileDocument>,
  ) {}

  async imageUpload(fileUploadDto: FileUploadDTO) {
    const s3: S3 = new S3({
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

    return new Promise<FileDocument>((resolve, reject) => {
      s3.upload(body, async (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cdnPath = data.Location.split('.com/').pop();
          const urlFile = `${process.env.PUBLIC_CDN_URL}${cdnPath}`;

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
