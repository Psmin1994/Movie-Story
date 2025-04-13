import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch() // 모든 예외를 처리하는 필터
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = err.status || 500;

    res.status(status).json({
      message: err.message || 'Internal server error',
      errorType: 'GlobalException',
      timestamp: new Date().toISOString(),
    });
  }
}
