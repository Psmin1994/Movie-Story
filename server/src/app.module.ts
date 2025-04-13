import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapingModule } from '@modules/scraping/scraping.module';
import { SchedulerService } from '@modules/scheduler/scheduler.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '@common/prisma/prisma.module';
import { UtilsModule } from '@common/utils/utils.module';
import { MovieModule } from '@modules/movie/movie.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'), // 정적 파일 경로 설정
      serveRoot: '/', // /static 경로로 접근 가능
    }),
    PrismaModule,
    UtilsModule,
    ScrapingModule,
    MovieModule,
    UserModule,
    AuthModule,
  ],
  providers: [SchedulerService],
})
export class AppModule {}
