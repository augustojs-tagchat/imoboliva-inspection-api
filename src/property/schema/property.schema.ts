import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

class IDimension {
  width?: number;
  height?: number;
}

class ILocation {
  latitude: number;
  longitude: number;
}

@Schema({
  collection: 'property',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class Property {
  _id: ObjectId;

  @Prop({ required: true })
  ref_code: string;

  @Prop()
  district: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  about?: string;

  // Medias (From CDN ?)
  @Prop()
  photos?: string[];

  @Prop()
  videos?: string[];

  // Properties
  @Prop()
  type: string;

  @Prop()
  isRural: boolean;

  @Prop()
  isRenting: boolean;

  @Prop()
  isSelling: boolean;

  // Values
  @Prop()
  sellValue?: number;

  @Prop()
  rentValue?: number;

  @Prop()
  condominiumTax?: number;

  @Prop()
  iptu?: number;

  @Prop()
  itbi?: number;

  @Prop()
  registerValue?: number;

  // Counters (Number Of)
  @Prop()
  baths: number;

  @Prop()
  rooms: number;

  @Prop()
  suites?: number;

  @Prop()
  m2Built: number;

  @Prop()
  m2Total: number;

  @Prop()
  hectare?: number;

  @Prop()
  floor?: number;

  @Prop()
  garage?: number;

  @Prop()
  builtInCloset?: boolean;

  @Prop()
  furnished?: boolean;

  @Prop()
  petFriendly?: boolean;

  @Prop({ type: IDimension })
  dimensions?: IDimension;

  // Amenities
  @Prop()
  amenities: string[];

  // Location Information
  @Prop({ type: ILocation })
  location?: ILocation;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
