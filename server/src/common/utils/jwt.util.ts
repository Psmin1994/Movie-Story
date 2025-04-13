// common/utils/jwt.util.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUserDTO } from '@modules/auth/dtos/jwt-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtil {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 로그인 성공 시 Token 생성
  generateTokens(user: JwtUserDTO) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  generateAccessToken(payload: JwtUserDTO) {
    try {
      const secretKey = this.configService.get<string>('ACCESS_TOKEN_SECRET');

      if (!secretKey) {
        throw new Error('Access token secret not configured');
      }

      return this.jwtService.sign(payload, {
        secret: secretKey,
        expiresIn: '20s',
        algorithm: 'HS256',
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          `Failed to generate access token: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw err;
      }
    }
  }

  generateRefreshToken(payload: JwtUserDTO) {
    try {
      const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET');

      if (!secretKey) {
        throw new Error('Refresh token secret not configured');
      }

      return this.jwtService.sign(payload, {
        secret: secretKey,
        expiresIn: '2m',
        algorithm: 'HS256',
      });
    } catch (err) {
      if (err instanceof Error) {
        throw new HttpException(
          `Failed to generate refresh token: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw err;
      }
    }
  }

  verifyAccessToken(token: string) {
    try {
      const secretKey = this.configService.get<string>('ACCESS_TOKEN_SECRET');

      if (!secretKey) {
        throw new Error('Access token secret not configured');
      }

      return this.jwtService.verify<JwtUserDTO>(token, { secret: secretKey });
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'TokenExpiredError') {
          throw new HttpException('Access token expired', HttpStatus.FORBIDDEN);
        } else if (err.name === 'JsonWebTokenError') {
          throw new HttpException(
            'Invalid access token',
            HttpStatus.UNAUTHORIZED,
          );
        }

        throw new HttpException(
          `Failed to verify access token: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw err;
      }
    }
  }

  verifyRefreshToken(token: string) {
    try {
      const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET');

      if (!secretKey) {
        throw new Error('Refresh token secret not configured');
      }

      return this.jwtService.verify<JwtUserDTO>(token, { secret: secretKey });
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'TokenExpiredError') {
          throw new HttpException(
            'Refresh token expired',
            HttpStatus.FORBIDDEN,
          );
        } else if (err.name === 'JsonWebTokenError') {
          throw new HttpException(
            'Invalid refresh token',
            HttpStatus.UNAUTHORIZED,
          );
        }

        throw new HttpException(
          `Failed to verify refresh token: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw err;
      }
    }
  }
}
