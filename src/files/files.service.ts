import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { FileUploadDTO } from './dto/file-upload.dto';
import { getFileExtension } from 'src/utils/getFileExtension';
import { getFileName } from 'src/utils/getFileName';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<FileDocument>,
  ) {}

  async uploadFile(
    fileUploadDto: FileUploadDTO,
    inspectionId?: string,
    areaId?: string,
  ) {
    const s3: S3 = new S3({
      endpoint: process.env.PUBLIC_DO_SPACES_ENDPOINT,
      accessKeyId: process.env.PUBLIC_DO_SPACES_KEY,
      secretAccessKey: process.env.PUBLIC_DO_SPACES_SECRET,
    });

    const cdnBucketPath = areaId
      ? `imob-oliva/inspection/${inspectionId}/areas/${areaId}`
      : `imob-oliva/inspection/${inspectionId}`;

    const extension = getFileExtension(fileUploadDto.fileName);
    const filename = getFileName(fileUploadDto.fileName);
    const milliseconds = new Date().getTime().toString();
    const finalFilename = filename + '-' + milliseconds + '.' + extension;

    // console.log('fileUploadDto::', fileUploadDto);

    const body = {
      Bucket: `${process.env.PUBLIC_DO_SPACES_NAME}/${cdnBucketPath}`,
      Key: finalFilename,
      ACL: 'public-read',
      Body: fileUploadDto.dataBuffer,
      ContentType: fileUploadDto.mimetype,
    };

    return new Promise<FileDocument>((resolve, reject) => {
      s3.upload(body, async (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cdnPath = data.Location.split('.com/');
          console.log('cdnPath::', cdnPath);
          const urlFile = `${process.env.PUBLIC_CDN_URL}${cdnPath}`;

          const newFile = new this.fileModel({
            key: finalFilename,
            mimetype: fileUploadDto.mimetype,
            file_size: fileUploadDto.fileSize,
            url: urlFile,
          });

          console.log('newFile::', newFile);
          await newFile.save();
          resolve(newFile);
        }
      });
    });
  }
}
