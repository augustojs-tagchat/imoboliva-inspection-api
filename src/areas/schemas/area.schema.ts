import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { InspectionPoint } from 'src/inspection-points/schemas/inspection-point.schema';

export type AreaDocument = Area & Document;

@Schema({
  collection: 'areas',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class Area {
  _id: ObjectId;

  @Prop()
  active: boolean;

  @Prop({ required: true })
  name: string;

  @Prop()
  note: string;

  @Prop({ type: mongoose.Types.DocumentArray, ref: 'inspection_points' })
  inspection_points: InspectionPoint[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
