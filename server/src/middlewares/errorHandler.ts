import { Request, Response, NextFunction } from "express";

// 커스텀 에러 타입 정의 (옵션)
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = "CustomError";
    this.statusCode = statusCode;

    // 스택 트레이스 : 클래스의 생성자 부분을 스택에서 제외
    Error.captureStackTrace(this, this.constructor);
  }
}

// 에러 핸들링 미들웨어
const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Server error occurred";

  if (err instanceof AppError) {
    // 커스텀 에러인 경우
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    // 기본 Error 객체인 경우
    message = err.message;
  }

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === "dev") {
    console.log(err.stack);
  }

  res.status(statusCode).json({ message });
};

export { errorHandler, AppError };
