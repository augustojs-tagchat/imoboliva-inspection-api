import { IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { IInspectionPoint } from '../interface/inspection-point.interface';

export class AddNewAreaDTO {
  @IsNotEmpty()
  @IsString()
  area_id: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  inspection_points: IInspectionPoint[];
}
