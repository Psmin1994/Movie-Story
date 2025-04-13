import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { JwtUserDTO } from '../dtos/jwt-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');

    if (!secret) {
      throw new Error('Access token secret not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.accessToken, // 쿠키에서 JWT 가져오기
      ]),
      ignoreExpiration: false, // 토큰 만료 여부 확인
      secretOrKey: secret, // 환경변수에서 JWT 시크릿 키 가져옴
    });
  }

  async validate(payload: JwtUserDTO) {
    // accessToken이 없거나 유효하지 않으면 null 반환
    if (!payload) {
      return null;
    }

    const user = await this.authService.validateUserByJwt(payload);

    return user; // req.user에 저장됨
  }
}
