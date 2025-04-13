import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  // 사용자 정보 조회 (ID로 조회)
  async getUserInfoById(id: string) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id },
      include: {
        user_info: true, // user_info 포함
      },
    });

    return userInfo;
  }

  // 사용자 생성
  async createUser(userInfo: CreateUserDto) {
    // 트랜잭션 : 모든 쿼리 성공 시, 커밋(commit)
    await this.prisma.$transaction(async (prismaTransaction) => {
      const newUser = await prismaTransaction.user.create({
        data: {
          id: userInfo.id,
          password: userInfo.password,
        },
      });

      await prismaTransaction.user_info.create({
        data: {
          user_id: newUser.user_id,
          name: userInfo.name,
        },
      });
    });
  }
}
