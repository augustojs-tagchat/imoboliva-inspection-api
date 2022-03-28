import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

// export class UpdateInspectionPointDto extends PartialType(
//   CreateInspectionPointDto,
// ) {}

export class UpdateInspectionPointDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  options: string[];
}
