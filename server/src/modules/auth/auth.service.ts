import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { UserService } from '@modules/user/user.service';
import { CryptoUtil } from '@common/utils/crypto.util';
import { JwtUtil } from '@common/utils/jwt.util';
import { JwtUserDTO } from './dtos/jwt-user.dto';
import { CreateOauthUserDTO } from './dtos/create-oauth-user.dto';
import { UpdateOauthUserDTO } from './dtos/update-oauth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private cryptoUtil: CryptoUtil,
    private jwtUtil: JwtUtil,
  ) {}

  // id, password 로그인 검증
  async validateUser(id: string, password: string): Promise<{ id: string }> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = this.cryptoUtil.verifyPassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { id: user.id };
  }

  // token 검증 (자동 로그인)
  async validateUserByJwt(payload: JwtUserDTO) {
    let result: { id: string; nickname: string } | null = null;

    if (payload.provider) {
      let oauthUser = await this.getOauthUserById(payload.id);

      if (oauthUser) {
        result = {
          id: oauthUser.provider_user_id,
          nickname: oauthUser.nickname,
        };
      }
    } else {
      let user = await this.userService.getUserInfoById(payload.id);

      if (user) {
        result = { id: user.id, nickname: user.user_info!.name };
      }
    }

    return result;
  }

  // RefreshToken으로 AccessToken 재생성
  async tokenRefresh(refreshToken: string) {
    const payload: JwtUserDTO =
      await this.jwtUtil.verifyRefreshToken(refreshToken);

    let newAccessToken = await this.jwtUtil.generateAccessToken(payload);

    return newAccessToken;
  }

  // 특정 oauth 유저를 ID로 조회
  async getOauthUserById(userId: string) {
    const oAuthUser = await this.prisma.oauth_user.findUnique({
      where: {
        provider_user_id: userId,
      },
    });

    return oAuthUser;
  }

  // 새 oauth 유저 생성
  async createOauthUser(userInfo: CreateOauthUserDTO) {
    const newOAuthUser = await this.prisma.oauth_user.create({
      data: {
        provider: userInfo.provider,
        provider_user_id: userInfo.provider_user_id,
        nickname: userInfo.nickname,
        email: userInfo.email,
        access_token: userInfo.access_token,
        refresh_token: userInfo.refresh_token,
      },
    });

    return newOAuthUser; // 새로 생성된 사용자 ID 반환
  }

  // oauth 유저 업데이트
  async updateOauthUser(userInfo: UpdateOauthUserDTO) {
    const updatedOAuthUser = await this.prisma.oauth_user.update({
      where: {
        provider_user_id: userInfo.provider_user_id,
      },
      data: {
        access_token: userInfo.access_token,
        refresh_token: userInfo.refresh_token,
        updated_at: new Date(), // 업데이트된 시간 설정
      },
    });

    return updatedOAuthUser;
  }

  async validateOAuthLogin(user: CreateOauthUserDTO): Promise<JwtUserDTO> {
    let storedUser = await this.getOauthUserById(user.provider_user_id);

    if (!storedUser) {
      // 사용자 없으면 새로 생성
      let newUserInfo: CreateOauthUserDTO = user;

      let oAuthUser = await this.createOauthUser(newUserInfo);

      return { id: oAuthUser.provider_user_id, provider: oAuthUser.provider };
    } else if (
      user.access_token !== storedUser.access_token ||
      user.refresh_token !== storedUser.refresh_token
    ) {
      // 사용자 있으면 Update
      let oAuthUser = await this.updateOauthUser({
        provider_user_id: user.provider_user_id,
        access_token: user.access_token,
        refresh_token: user.refresh_token,
      });

      return {
        id: oAuthUser.provider_user_id,
        provider: oAuthUser.provider,
      };
    } else {
      return {
        id: storedUser.provider_user_id,
        provider: storedUser.provider,
      };
    }
  }
}
