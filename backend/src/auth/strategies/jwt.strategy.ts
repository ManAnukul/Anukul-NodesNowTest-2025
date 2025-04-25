import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtDto } from '../dto/jwt-auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (
          request: Request & { cookies?: { access_token?: string } },
        ): string | null => {
          return request.cookies?.access_token || null;
        },
      ]),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: jwtDto) {
    return { id: payload.id, email: payload.email };
  }
}
