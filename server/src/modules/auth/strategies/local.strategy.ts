import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'id', // 요청에서 ID를 username 대신 사용
      passwordField: 'password',
      session: false,
    });
  }

  async validate(id: string, password: string): Promise<{ id: string }> {
    const user = await this.authService.validateUser(id, password);

    return user;
  }
}
