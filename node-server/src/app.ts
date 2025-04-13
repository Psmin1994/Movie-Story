import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import passport from "passports/index.js";
import morganMiddleware from "middlewares/morgan.js";
import { errorHandler } from "middlewares/errorHandler.js";
import "dotenv/config";

// router
import movieRouter from "routes/movie.route.js";
import userRouter from "routes/user.route.js";
import authRouter from "routes/auth.route.js";

const app = express();

const __filename = new URL(import.meta.url).pathname.replace(/^.*?([A-Za-z]:)/, "$1");
const __dirname = path.dirname(__filename);

app.set("port", process.env.PORT || 5000);

// CORS
const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000", undefined];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // callback (error : Error | null, allow : boolean)
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

// middleware
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
app.use(errorHandler); // 에러 핸들러 미들웨어 적용

export default app;
