import { ObjectId } from 'mongoose';

export interface TokenPayload {
  userId: ObjectId;
}
