import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { IAddress } from '../interface/address.interface';

export class CreateInspectionDto {
  @IsNotEmpty()
  @IsString()
  real_state_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  address: IAddress;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  date: Date;
}
