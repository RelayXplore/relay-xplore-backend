import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../modules/auth/auth.service';
import { AuthTokenStatus } from '../../modules/auth/auth-token.entity';
import { env } from '../../constants/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(@Request() req, payload: any) {
    const token = req?.headers?.authorization?.split(' ')?.[1]?.trim();
    const foundAccessToken = await this.authService.findAccessToken(token);

    if (!foundAccessToken) {
      throw new UnauthorizedException('Unauthorized JWT Access Token');
    }

    if (foundAccessToken.status !== AuthTokenStatus.active) {
      throw new UnauthorizedException('Unauthorized Invalid JWT Access Token');
    }

    return payload.user;
  }
}
