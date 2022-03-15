import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

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
