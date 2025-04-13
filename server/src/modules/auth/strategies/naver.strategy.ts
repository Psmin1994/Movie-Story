import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

interface NaverProfile extends Profile {
  _json: {
    email?: string;
  };
}

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID')!,
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('NAVER_CALLBACK_URL')!,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: NaverProfile,
    done: Function,
  ) {
    try {
      const user = await this.authService.validateOAuthLogin({
        provider: 'naver',
        provider_user_id: profile.id,
        email: profile._json.email,
        nickname: profile.displayName,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
}
