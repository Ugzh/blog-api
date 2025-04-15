import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './_utils/dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(createUserDto: CreateUserDto) {
    if (
      !createUserDto ||
      !createUserDto.username ||
      !createUserDto.password ||
      !createUserDto.email
    )
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    return this.userRepository.createUser(createUserDto);
  }
}
