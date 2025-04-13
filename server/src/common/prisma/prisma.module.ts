import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 전역 모듈로 설정
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
