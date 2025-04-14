import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from '../user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;

  @IsEnum(UserRoleEnum)
  role: string;

  @IsString()
  @IsOptional()
  profile_url_image: string;
}
