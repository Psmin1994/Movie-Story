import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtUtil } from '@common/utils/jwt.util';
import { JwtUserDTO } from './dtos/jwt-user.dto';
import { COOKIE_OPTIONS } from '@common/config/cookie.config';
import { NaverAuthGuard } from './guards/naver-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtUtil: JwtUtil,
  ) {}

  @Get('refresh')
  async refresh(@Request() req, @Response() res) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      const newAccessToken = await this.authService.tokenRefresh(refreshToken);

      // AccessToken 재발급
      res.cookie('accessToken', newAccessToken, COOKIE_OPTIONS);

      return {
        success: true,
        message: 'User refreshed',
      };
    } catch (err) {
      // RefreshToken 만료인 경우
      res.clearCookie('accessToken', COOKIE_OPTIONS);
      res.clearCookie('refreshToken', COOKIE_OPTIONS);

      throw err; // 글로벌 예외 필터에서 처리
    }
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {}

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@Request() req, @Response() res) {
    const redirectUrl = req.query.state
      ? decodeURIComponent(req.query.state as string)
      : 'http://localhost:3000/';

    const { accessToken, refreshToken } = await this.jwtUtil.generateTokens(
      req.user,
    );

    // RefreshToken 쿠키로 발급
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);

    // RefreshToken 쿠키로 발급
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    // 클라이언트로 리디렉션
    return res.redirect(redirectUrl);
  }
}
