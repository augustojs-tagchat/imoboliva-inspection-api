import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { IAddress } from '../interface/address.interface';
import { IRealState } from '../interface/real-state.interface';
import { Area, AreaDocument } from '../../areas/schemas/area.schema';
import { ObjectId } from 'mongodb';

export type EntryInspectionDocument = EntryInspection & Document;

@Schema({ collection: 'entry_inspection', timestamps: true })
export class EntryInspection {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true })
  user_id: ObjectId;

  @Prop({ type: IAddress })
  address: IAddress;

  @Prop({ type: mongoose.Types.DocumentArray, ref: 'areas' })
  areas: AreaDocument[] | Area[];

  @Prop({ required: false, type: IRealState })
  real_state_id: ObjectId;

  @Prop({ required: true, enum: ['pending', 'started', 'done'] })
  active: 'pending' | 'started' | 'done';

  @Prop({ required: false })
  image_url: string;

  @Prop({ required: false })
  id_inspection: string;
}

export const EntryInspectionSchema =
  SchemaFactory.createForClass(EntryInspection);
