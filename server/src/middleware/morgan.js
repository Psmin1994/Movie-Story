import morgan from "morgan";
import logger from "../config/winston.js";

// 로그 작성을 위한 옵션.
const format = process.env.NODE_ENV === "production" ? "combined" : "[:date[iso]] :method :url :status :response-time ms";

// 로깅 스킵 여부
const skip = (_, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.statusCode < 500; // 코드가 500 이상이면 로그 기록
  }

  return false;
};

// 로그 작성을 위한 Output stream옵션.
const stream = {
  write: (message) => {
    const statusCode = parseInt(message.split(" ")[2], 10);

    if (statusCode >= 400) {
      logger.error(message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")); // 에러 로그로 기록
    } else {
      logger.info(message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")); // 정상 로그로 기록
    }
  },
};

const options = {
  skip,
  stream,
};

// 적용될 moran 미들웨어 형태
const morganMiddleware = morgan(format, options);

export default morganMiddleware;
