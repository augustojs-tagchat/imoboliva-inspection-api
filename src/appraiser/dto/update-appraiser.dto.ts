import { PartialType } from '@nestjs/mapped-types';
import { CreateAppraiserDto } from './create-appraiser.dto';

export class UpdateAppraiserDto extends PartialType(CreateAppraiserDto) {}
