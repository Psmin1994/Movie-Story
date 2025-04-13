import { CreateUserDTO } from "dtos/user.dto";
import { prisma, handlePrismaError } from "config/prismaClient.js";
import { AppError } from "middlewares/errorHandler.js";

class UserDAO {
  static async checkUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true }, // id만 조회하여 존재 여부 확인
      });

      return user !== null; // 존재하면 true, 없으면 false
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 사용자 정보 조회 (ID로 조회)
  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          user_info: true, // user_info 포함
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return user;
    } catch (err) {
      throw handlePrismaError(err);
    }
  }

  // 사용자 추가 정보 조회 (user_id로 조회)
  static async getUserInfo(userId: number) {
    try {
      const userInfo = await prisma.user_info.findUnique({
        where: { user_id: userId },
      });

      return userInfo;
    } catch (err) {
      throw err;
    }
  }

  // 사용자 생성
  static async createUser(userInfo: CreateUserDTO) {
    try {
      // 트랜잭션 : 모든 쿼리 성공 시, 커밋(commit)
      await prisma.$transaction(async (prismaTransaction) => {
        const newUser = await prismaTransaction.user.create({
          data: {
            id: userInfo.id,
            password: userInfo.password,
          },
        });

        await prismaTransaction.user_info.create({
          data: {
            user_id: newUser.user_id,
            nickname: userInfo.nickname,
          },
        });
      });
    } catch (err) {
      throw handlePrismaError(err);
    }
  }
}

export default UserDAO;
