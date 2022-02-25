import { IsString, IsNotEmpty } from 'class-validator';
import { IAddress } from '../interface/address.interface';

export class CreateInspectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  address: IAddress;
}
