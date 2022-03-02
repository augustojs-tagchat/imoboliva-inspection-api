import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type InspectionPointDocument = InspectionPoint & Document;

@Schema({
  collection: 'inspection_points',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class InspectionPoint {
  _id: ObjectId;

  @Prop()
  description: string;

  @Prop()
  options: string[];

  @Prop()
  active: boolean;
}

export const InspectionPointSchema =
  SchemaFactory.createForClass(InspectionPoint);
