import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy'; // ✅ import 추가
import { NaverStrategy } from './strategies/naver.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, NaverStrategy],
})
export class AuthModule {}
