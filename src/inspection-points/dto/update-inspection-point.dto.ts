import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionPointDto } from './create-inspection-point.dto';

export class UpdateInspectionPointDto extends PartialType(CreateInspectionPointDto) {}
