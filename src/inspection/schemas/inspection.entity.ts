import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { IAddress } from '../interface/address.interface';
import { IRealState } from '../interface/real-state.interface';

export type InspectionDocument = Inspection & Document;

@Schema({ collection: 'inspection', timestamps: true })
export class Inspection {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: IAddress })
  address: IAddress;

  @Prop({ required: false, type: IRealState })
  real_state: IRealState;

  @Prop({ required: true, enum: ['pending', 'started', 'done'] })
  active: 'pending' | 'started' | 'done';

  @Prop({ required: false })
  image_url: string;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
