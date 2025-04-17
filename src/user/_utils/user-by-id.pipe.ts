import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserDocument } from '../schema/user.schema';
import { UserRepository } from '../user.repository';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UserByIdPipe
  implements PipeTransform<string, Promise<UserDocument>>
{
  constructor(private userRepository: UserRepository) {}

  transform(userId: string): Promise<UserDocument> {
    if (!isValidObjectId(userId))
      throw new BadRequestException('Wrong user id');
    return this.userRepository.findUserById(userId);
  }
}
