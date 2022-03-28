import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  MinLength,
  ArrayNotEmpty,
} from 'class-validator';
import { IInspectionPoints } from 'src/inspection-points/interfaces/inspection-points.interface';

export class UpdateAreaDTO {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IInspectionPoints)
  inspection_points: IInspectionPoints[];
}
