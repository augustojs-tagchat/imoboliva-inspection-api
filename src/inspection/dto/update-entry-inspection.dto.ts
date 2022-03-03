import { AreaDocument } from 'src/areas/schemas/area.schema';
import { ObjectId } from 'mongoose';

export class UpdateEntryInspectionDTO {
  _id: string;
  name: string;
  active: boolean;
  inspection_points: any;
  created_at: Date;
  updated_at: Date;
}
