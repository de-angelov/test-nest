import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../dto/toke-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configS: ConfigService) {
    const extractors = [(request: Request) => request.cookies.Authentication];
    const options = {
      jwtFromRequest: ExtractJwt.fromExtractors(extractors),
      secretOrKey: configS.getOrThrow('JWT_SECRET'),
    };

    super(options);
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
