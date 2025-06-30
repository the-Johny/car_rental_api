/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'your-fallback-secret-key',
    });
  }
  async validate(payload: any) {
    try {
      // Validate user still exists and is active
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = await this.authService.validateUser(payload.sub);
      return {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
