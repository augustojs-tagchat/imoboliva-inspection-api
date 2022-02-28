import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateInspectionPointDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  options: string[];
}
