import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEntryInspectionDTO {
  @IsNotEmpty()
  area_id: string;

  inspection_point_id: string;

  @IsOptional()
  inspection_points: {
    _id: string;
    description: string;
    entry: {
      note: string;
      selected_points: string[];
    };
  }[];
}
