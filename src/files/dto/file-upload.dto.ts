import { ObjectId } from 'mongoose';

export class FileUploadDTO {
  dataBuffer: Buffer;
  fileName: string;
  fileSize: number;
  mimetype: string;
  urlFileName: string;
}
