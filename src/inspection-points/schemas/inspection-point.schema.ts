import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export type InspectionPointDocument = InspectionPoint & Document;

class Entry {
  selected_points: string[];
  note: string;
}

class Exit {
  selected_points: string[];
  note: string;
}

@Schema({
  collection: 'inspection_points',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class InspectionPoint {
  _id: ObjectId;

  @Prop()
  options: string[];

  @Prop()
  description: string;

  @Prop()
  active: boolean;

  @Prop({ type: Entry, default: { selected_points: [], note: '' } })
  entry: Entry;

  @Prop({ type: Exit, default: { selected_points: [], note: '' } })
  exit: Exit;
}

export const InspectionPointSchema =
  SchemaFactory.createForClass(InspectionPoint);
