import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';
import { CreateInspectionDto } from './create-inspection.dto';

class InspectionPoints {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  options: string[];
}

export class UpdateInspectionAreasDTO {
  _id: any;
  note: any;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  inspection_points: InspectionPoints[];
}
