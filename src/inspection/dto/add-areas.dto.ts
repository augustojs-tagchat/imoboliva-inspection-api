import { IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionPoint } from 'src/inspection-points/schemas/inspection-point.schema';
import { IInspectionPoint } from '../interface/inspection-point.interface';

export class AddNewAreaDTO {
  @IsNotEmpty()
  @IsString()
  area_id: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => IInspectionPoint)
  inspection_points: IInspectionPoint[];
}
