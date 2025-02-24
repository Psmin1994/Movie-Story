import { Request, Response } from "express";
import morgan, { Options } from "morgan";
import logger from "config/winston.js";
import stripAnsi from "strip-ansi"; // ANSI 코드 제거 라이브러리

const isProduction = process.env.NODE_ENV === "production";

// 로그 포맷
const format = isProduction ? "combined" : ":method :url :status :response-time ms";

const options: Options<Request, Response> = {
  // 로깅 스킵 여부
  skip: (req, res) => isProduction && res.statusCode < 500,

  // 로그 작성을 위한 Output stream옵션.
  stream: {
    write: (message: string) => {
      const sanitizedMessage = stripAnsi(message); // ANSI 코드 제거

      // 상태 코드 추출 (정규식 개선, 로그 메시지 형식이 바뀔 수 있음을 고려)
      const statusCodeMatch = sanitizedMessage.match(/\s(\d{3})\s/);

      const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1], 10) : 0;

      // 상태 코드가 400 이상이면 에러 로그로 기록
      if (statusCode >= 400) {
        logger.error(sanitizedMessage); // 에러 로그로 기록
      } else {
        logger.info(sanitizedMessage); // 정상 로그로 기록
      }

      // 콘솔 출력 (개발 환경에서만)
      if (!isProduction) {
        console.log(sanitizedMessage);
      }
    },
  },
};

// 적용될 moran 미들웨어 형태
const morganMiddleware = morgan(format, options);

export default morganMiddleware;
