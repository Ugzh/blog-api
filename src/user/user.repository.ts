import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './_utils/dtos/create-user.dto';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class UserRepository {
  private readonly USER_NOT_FOUND = new HttpException(
    'User not found',
    HttpStatus.NOT_FOUND,
  );
  private readonly USERNAME_ALREADY_EXIST = new HttpException(
    'Username already exist',
    HttpStatus.NOT_FOUND,
  );

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly encryptionService: EncryptionService,
  ) {}

  findUserByEmail = (email: string) => {
    return this.userModel.findOne({ email }).orFail(this.USER_NOT_FOUND).exec();
  };

  findUserById = (userId: string) => {
    return this.userModel.findById(userId).orFail(this.USER_NOT_FOUND).exec();
  };

  findUserByUsername = (username: string) => {
    return this.userModel
      .findOne()
      .where({ username })
      .orFail(this.USER_NOT_FOUND)
      .exec();
  };

  createUser = async (createUserDto: CreateUserDto) => {
    const hashPassword = this.encryptionService.encrypt(createUserDto.password);
    const user = await this.userModel
      .exists({
        username: createUserDto.username,
      })
      .exec();
    if (isValidObjectId(user?._id)) throw this.USERNAME_ALREADY_EXIST;

    return this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      username: createUserDto.username,
      role: createUserDto.role,
      profile_image_url: createUserDto.profile_url_image,
      created_at: Date.now(),
    });
  };
}
