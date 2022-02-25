import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type AppraiserDocument = Appraiser & Document;

@Schema({ collection: 'appraiser', timestamps: true })
export class Appraiser {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;
}

export const AppraiserSchema = SchemaFactory.createForClass(Appraiser);
