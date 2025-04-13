import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class NaverAuthGuard extends AuthGuard('naver') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const state = req.query?.state;

    return {
      session: false,
      state,
    };
  }

  handleRequest(err, user, info, context) {
    if (err || !user) throw new UnauthorizedException('네이버 로그인 실패');

    return user;
  }
}
