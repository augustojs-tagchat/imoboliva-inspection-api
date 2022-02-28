import { IsNotEmpty, IsString } from 'class-validator';
import { IAddress } from '../interface/address.interface';

export class CreateEntryInspectionDTO {
  inspection_id: string;

  @IsNotEmpty()
  @IsString()
  real_state_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  address: IAddress;

  @IsNotEmpty()
  user_id: string;

  areas: any[];
}
