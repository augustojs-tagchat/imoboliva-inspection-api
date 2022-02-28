import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { IAddress } from '../interface/address.interface';

export class CreateInspectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  address: IAddress;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
