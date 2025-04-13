import { CreateOauthUserDTO, UpdateOauthUserDTO } from "dtos/user.dto";
import { AppError } from "middlewares/errorHandler.js";
import { prisma, handlePrismaError } from "config/prismaClient.js";

class AuthDAO {
  static async checkOauthUserById(userId: string) {
    try {
      const user = await prisma.oauth_user.findUnique({
        where: { provider_user_id: userId },
        select: { oauth_id: true }, // id만 조회하여 존재 여부 확인
      });

      return user !== null; // 존재하면 true, 없으면 false
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 특정 oauth 유저를 ID로 조회
  static async getOauthUserById(userId: string) {
    try {
      const oAuthUser = await prisma.oauth_user.findUnique({
        where: {
          provider_user_id: userId,
        },
      });

      if (!oAuthUser) {
        throw new AppError("User not found", 404);
      }

      // 해당 ID의 유저가 없으면 null 반환
      return oAuthUser;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 새 oauth 유저 생성
  static async createOauthUser(userInfo: CreateOauthUserDTO) {
    try {
      const newOAuthUser = await prisma.oauth_user.create({
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
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // oauth 유저 업데이트
  static async updateOauthUser(userInfo: UpdateOauthUserDTO) {
    try {
      const updatedOAuthUser = await prisma.oauth_user.update({
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
    } catch (err) {
      throw handlePrismaError(err);
    }
  }
}

export default AuthDAO;
