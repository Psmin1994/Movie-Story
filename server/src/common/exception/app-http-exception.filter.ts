// src/common/exception/global-exception.filter.ts
import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AppHttpExceptionFilter implements ExceptionFilter {
  catch(err: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'dev') {
      console.error(err.stack);
    }

    // 클라이언트에 응답 전송
    res.status(err.getStatus()).json({
      message: err.message,
      errorType: 'AppHttpException',
      timestamp: new Date().toISOString(),
    });
  }
}
