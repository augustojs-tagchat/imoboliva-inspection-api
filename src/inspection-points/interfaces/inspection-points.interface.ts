import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class Entry {
  selected_points: string[];
  note: string;
}

class Exit {
  selected_points: string[];
  note: string;
}

export class IInspectionPoints {
  @IsNotEmpty()
  @IsString()
  _id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsArray()
  options: string[];

  entry: Entry;

  exit: Exit;
}
