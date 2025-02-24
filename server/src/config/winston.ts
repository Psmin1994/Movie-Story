import path from "path";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const __filename: string = new URL(import.meta.url).pathname.replace(/^.*?([A-Za-z]:)/, "$1");
const __dirname: string = path.dirname(__filename);

// winston.format에서 프로퍼티 가져오기
const { combine, timestamp, simple, colorize, printf } = winston.format;

// 로그 파일 저장 경로 지정
const logDir = `${__dirname}/../../logs`;

// 로그 출력 포맷 정의 함수
const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  // 날짜 [라벨] : 메세지
});

const logger = winston.createLogger({
  //* 로그 출력 형식 정의
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
    // label({ label: "Movie-Story" }),
    logFormat // log 출력 포맷
    // format: combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의. level이나 message는 콘솔에서 자동 정의
  ),

  // 실제 로그 어떻게 저장할 것인가
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    // info: 2 보다 높은 error: 0 와 warn: 1 로그들도 자동 포함해서 저장)
    new winstonDaily({
      level: "info", // info 레벨
      datePattern: "YYYY-MM-DD", // 파일 날짜 형식
      dirname: logDir, // 파일 경로
      filename: `%DATE%.info.log`, // 파일 이름
      maxFiles: 14, // 최근 14일치 저장
      zippedArchive: true, // gzip으로 압축할지 여부
    }),
    // error 레벨 로그를 저장할 파일 설정
    // (info에 자동 포함되지만 일부러 따로 빼서 설정)
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(logDir, "error"), // /logs/error 에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 14,
      zippedArchive: true,
    }),
  ],
  // uncaughtException 발생시 파일 설정
  exceptionHandlers: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(logDir, "exception"),
      filename: `%DATE%.exception.log`,
      maxFiles: 14,
      zippedArchive: true,
    }),
  ],
});

// 개발 환경에서는 콘솔 로그 활성화
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(), // 로그 색상 활성화
        simple() // 간단한 포맷
      ),
    })
  );
}

export default logger;
