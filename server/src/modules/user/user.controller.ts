import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtUtil } from '@common/utils/jwt.util';
import { CreateUserDto } from './dtos/create-user.dto';
import { COOKIE_OPTIONS } from '@common/config/cookie.config';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtUtil: JwtUtil,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(@Request() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { accessToken, refreshToken } = await this.jwtUtil.generateTokens(
      req.user,
    );

    // RefreshToken 쿠키로 발급
    res.cookie('accessToken', accessToken, COOKIE_OPTIONS);

    // RefreshToken 쿠키로 발급
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    return {
      success: true,
      message: 'Login Done!',
    };
  }

  @Post('register')
  async register(@Request() req, @Response() res) {
    let createUserInfo: CreateUserDto = req.body;

    console.log(createUserInfo);

    await this.userService.createUser(createUserInfo);

    return {
      success: true,
      message: 'Register Done!',
    };
  }
}
