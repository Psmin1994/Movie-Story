import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "./src/passport/index.js";
import morganMiddleware from "./src/middleware/morgan.js";

// router
import movieRouter from "./src/routes/movie.route.js";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";

const app = express();

let dirname = import.meta.dirname;

// middleware
const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000", undefined];

const corsOptions = {
  origin: (origin, callback) => {
    whitelist.includes(origin) ? callback(null, true) : callback(new Error("Not Allowed Origin!"));
  }, // 출처 허용 옵션, 모든 출처 허용 (true)
  credentials: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가
app.use(express.static(`${dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morganMiddleware);

app.use(passport.initialize());

// router
app.use("/movie", movieRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

// error handler
app.use((err, req, res, next) => {
  console.log("error : \n", err);

  res.status(500).json({
    error: err,
    message: "Server Error!!",
  });
});

export default app;
