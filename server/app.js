import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passports/index.js";
import morganMiddleware from "middleware/morgan.js";
import logger from "config/winston.js";
import "dotenv/config";

// router
import movieRouter from "./src/routes/movie.route.ts";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";

const app = express();

const __filename = new URL(import.meta.url).pathname.replace(/^.*?([A-Za-z]:)/, "$1");
const __dirname = path.dirname(__filename);

// middleware
const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    // allow : true 요청 허용
    if (!origin) {
      // origin이 없는 경우
      callback(null, true); // 허용
    } else if (whitelist.includes(origin)) {
      // 허용된 출처라면
      callback(null, true); // 허용
    } else {
      // 허용되지 않은 출처라면
      callback(new Error(`Not Allowed Origin: ${origin}`)); // 거부
    }
  },
  credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morganMiddleware);

app.use(passport.initialize());

// router
app.use("/movie", movieRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

// error handler
app.use((err, req, res, next) => {
  logger.error(err); // 전체 에러 로깅

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal server error";

  // 개발 환경에서만 스택 정보를 보냄
  if (process.env.NODE_ENV === "dev") {
    res.status(statusCode).json({ message: errorMessage, stack: err.stack });
  } else {
    res.status(statusCode).json({ message: errorMessage });
  }
});

export default app;
