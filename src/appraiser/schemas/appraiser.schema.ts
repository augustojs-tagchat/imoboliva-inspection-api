import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppraiserDocument = Appraiser & Document;

@Schema({ collection: 'appraiser', timestamps: true })
export class Appraiser {
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
