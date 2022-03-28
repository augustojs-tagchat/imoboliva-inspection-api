import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

class Entry {
  selected_points: string[];
  note: string;
}

class Exit {
  selected_points: string[];
  note: string;
}

export class IInspectionPoints {
  _id: string | ObjectId;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsArray()
  options: string[];

  entry: Entry;

  exit: Exit;
}
