import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from '../user-role.enum';
import { Optional } from 'class-validator-extended';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;

  @Optional()
  @IsEnum(UserRoleEnum)
  role: string;

  @IsString()
  @IsOptional()
  profile_url_image: string;
}
