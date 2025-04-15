import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../encryption/encryption.service';

@Module({
  imports: [
    UserModule,
    // PassportModule,
    // JwtModule.registerAsync({
    //   useFactory: () => ({
    //     secret: "CeciDoitEtreUneVariableD'enrivronnement",
    //     signOptions: { expiresIn: '1d' },
    //   }),
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, EncryptionService],
})
export class AuthModule {}
