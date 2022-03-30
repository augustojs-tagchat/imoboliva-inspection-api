import { IsNotEmpty, IsString } from 'class-validator';

export class UploadInspectionPointImagesDTO {
  @IsString()
  @IsNotEmpty()
  inspection_id: string;

  @IsString()
  @IsNotEmpty()
  area_id: string;
}
