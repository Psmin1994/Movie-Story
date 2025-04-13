// src/common/exception/prisma-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(err: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let message = 'Database error occurred';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          message = 'Data already exists';
          statusCode = HttpStatus.CONFLICT;
          break;

        case 'P2025':
          message = 'Data not found';
          statusCode = HttpStatus.NOT_FOUND;
          break;

        default:
          message = 'Database error occurred';
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
      }
    } else if (err instanceof PrismaClientInitializationError) {
      message = 'Failed to connect to the database';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (err instanceof PrismaClientValidationError) {
      message = 'Invalid request';
      statusCode = HttpStatus.BAD_REQUEST;
    }

    res.status(statusCode).json({
      message,
      errorType: 'PrismaException',
      timestamp: new Date().toISOString(),
    });
  }
}
