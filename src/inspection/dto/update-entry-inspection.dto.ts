import { IsNotEmpty } from 'class-validator';

export class UpdateEntryInspectionDTO {
  @IsNotEmpty()
  area_id: string;

  @IsNotEmpty()
  inspection_points: {
    _id: string;
    description: string;
    entry: {
      note: string;
      selected_points: string[];
    };
  }[];
}
