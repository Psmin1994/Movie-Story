import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoUtil } from './crypto.util';
import { JwtUtil } from './jwt.util';

@Global() // 전역 모듈로 설정
@Module({
  imports: [JwtModule],
  providers: [CryptoUtil, JwtUtil],
  exports: [CryptoUtil, JwtUtil],
})
export class UtilsModule {}
