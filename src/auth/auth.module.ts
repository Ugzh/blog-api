import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../encryption/encryption.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, EncryptionService, JwtStrategy],
})
export class AuthModule {}
