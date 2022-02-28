import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { Model } from 'mongoose';
import { ObjectId, isValidObjectId } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public async create(registerDto: RegisterDto) {
    const appraiser = new this.userModel({ ...registerDto, role: 'appraiser' });
    return appraiser.save();
  }

  public async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async findById(userId: ObjectId) {
    const appraiser = await this.userModel.findOne({ _id: userId });

    if (appraiser) {
      return appraiser;
    }

    throw new HttpException(
      'Appraiser with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
