import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../encryption/encryption.service';
import { LoginDto } from './dtos/login.dto';
import JwtPayloadInterface from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    const passwordStatus = this.encryptionService.compare(
      password,
      user.password,
    );
    if (!passwordStatus.isPasswordCorrect)
      throw new UnauthorizedException('Wrong credentials');

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayloadInterface = {
      email: user.email,
      id: user._id.toString(),
      role: user.role,
    };
    return {
      user: user,
      token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: "CeciDoitEtreUneVariableD'enrivronnement",
      }),
    };
  }
}
