import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SchedulerService } from '@modules/scheduler/scheduler.service';
import { PrismaExceptionFilter } from '@common/exception/prisma-exception.filter';
import { AppHttpExceptionFilter } from '@common/exception/app-http-exception.filter';
import { GlobalExceptionFilter } from '@common/exception/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 의존성 주입
  const configService = app.get(ConfigService);
  const schedulerService = app.get(SchedulerService);

  // 테스트 메서드 호출
  const initData = async () => {
    await schedulerService.testScraping();
    await schedulerService.testUpdateRank();
  };

  // initData();

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 정의되지 않은 필드 제거
      transform: true, // 데이터 변환
    }),
  );

  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));

  // 두 개의 필터 등록
  app.useGlobalFilters(
    new PrismaExceptionFilter(), // Prisma 관련 예외 처리
    new AppHttpExceptionFilter(), // Http 관련 예외처리
    new GlobalExceptionFilter(), // 일반적인 예외 처리
  );

  await app.listen(configService.get<number>('PORT') ?? 5000);
}

bootstrap();
