import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function validObjectId(objectId: string) {
  const idIsValid = ObjectId.isValid(objectId);

  if (!idIsValid) {
    throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
  }
}
