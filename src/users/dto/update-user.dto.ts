import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  role: string;
}
