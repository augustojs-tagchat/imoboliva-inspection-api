import { IsNotEmpty } from 'class-validator';

export class UpdateExitInspectionDTO {
  @IsNotEmpty()
  area_id: string;

  @IsNotEmpty()
  inspection_points: {
    _id: string;
    description: string;
    exit: {
      note: string;
      selected_points: string[];
    };
  }[];
}
