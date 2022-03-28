import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { IInspectionPoints } from 'src/inspection-points/interfaces/inspection-points.interface';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  active: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IInspectionPoints)
  inspection_points: IInspectionPoints[];
}
