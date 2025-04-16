import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../user/user.repository';
import JwtPayloadInterface from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "CeciDoitEtreUneVariableD'enrivronnement",
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayloadInterface) {
    return this.userRepository.findUserByEmail(payload.email);
  }
}
