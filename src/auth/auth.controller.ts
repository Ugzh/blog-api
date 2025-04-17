import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/_utils/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './_utils/dtos/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('/login')
  loginUser(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
