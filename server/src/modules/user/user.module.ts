import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // UserService를 다른 모듈에서 사용할 수 있도록 exports 배열에 추가
})
export class UserModule {}
