import { ObjectId } from 'mongodb';
import { IsNotEmpty, MinLength } from 'class-validator';
import { File, FileDocument } from 'src/files/schemas/file.schema';

export class IInspectionPoint {
  @IsNotEmpty()
  _id: string | ObjectId;

  @IsNotEmpty()
  description: string;

  active: boolean;

  images?: FileDocument[];

  @IsNotEmpty()
  entry: {
    selected_points: string[];
    note: string;
  };
  @IsNotEmpty()
  exit: {
    selected_points: string[];
    note: string;
  };
  @IsNotEmpty()
  @MinLength(1, { each: true })
  options: string[];
}
