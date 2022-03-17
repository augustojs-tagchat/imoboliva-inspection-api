import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IAddress } from '../interface/address.interface';
import { IRealState } from '../interface/real-state.interface';
import { AreaDocument } from '../../areas/schemas/area.schema';
import { Area } from '../../areas/schemas/area.schema';
import { ObjectId } from 'mongodb';
import { FileDocument } from 'src/files/schemas/file.schema';

export type InspectionDocument = Inspection & Document;

@Schema({
  collection: 'inspection',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class Inspection {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true })
  user_id: ObjectId;

  @Prop({ type: IAddress })
  address: IAddress;

  @Prop({ type: mongoose.Types.DocumentArray, ref: 'areas' })
  areas: AreaDocument[];

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false, type: IRealState })
  real_state_id: ObjectId;

  @Prop()
  real_state_areas: Area[] | null;

  @Prop({ required: true, enum: ['pending', 'started', 'done'] })
  active: 'pending' | 'started' | 'done';

  @Prop({ type: mongoose.Types.DocumentArray, ref: 'file', required: false })
  image?: FileDocument;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
