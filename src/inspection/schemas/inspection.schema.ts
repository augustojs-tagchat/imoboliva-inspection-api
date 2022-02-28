import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, ObjectId } from 'mongoose';
import { IAddress } from '../interface/address.interface';
import { IRealState } from '../interface/real-state.interface';
import { AreaDocument } from '../../areas/schemas/area.entity';

export type InspectionDocument = Inspection & Document;

@Schema({ collection: 'inspection', timestamps: true })
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

  @Prop({ required: false, type: IRealState })
  real_state_id: ObjectId;

  @Prop({ required: true, enum: ['pending', 'started', 'done'] })
  active: 'pending' | 'started' | 'done';

  @Prop({ required: false })
  image_url: string;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
