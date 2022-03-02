import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class User {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['admin', 'appraiser'] })
  role: string;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
