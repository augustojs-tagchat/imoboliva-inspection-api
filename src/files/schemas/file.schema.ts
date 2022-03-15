import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export type FileDocument = File & Document;

@Schema({
  collection: 'file',
  timestamps: { createdAt: 'created_at', updatedAt: 'update_at' },
})
export class File {
  _id: ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string;

  @Prop()
  file_size: number;

  @Prop()
  mimetype: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
