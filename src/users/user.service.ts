import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from 'src/authentication/dto/register.dto';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UpdateUserDTO } from './dto/update-user.dto';
import { validObjectId } from 'src/utils/validObjectId';

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

  public async findAll() {
    let usersArray = [];

    const users = await this.userModel.find();

    usersArray = users.map((user) => {
      user.password = undefined;
      return user;
    });

    return usersArray;
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

  public async getUniqueEmailUser(email: string) {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      return user;
    }

    throw new HttpException(
      'User with this email already exists',
      HttpStatus.NOT_FOUND,
    );
  }

  public async findById(userId: ObjectId | string) {
    const appraiser = await this.userModel.findOne({ _id: userId });

    if (appraiser) {
      return appraiser;
    }

    throw new HttpException(
      'Appraiser with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async updateUser(userId: string, updateUserDto: UpdateUserDTO) {
    const idIsValid = ObjectId.isValid(userId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userModel.updateOne(
      { _id: user._id },
      {
        ...updateUserDto,
      },
    );
  }

  public async deleteUser(userId: string) {
    const idIsValid = ObjectId.isValid(userId);

    if (!idIsValid) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userModel.deleteOne({ _id: user._id });
  }

  public async userToAdmin(userId: string) {
    validObjectId(userId);

    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userModel.updateOne({ _id: user._id }, { role: 'admin' });
  }
}
