import passport from "passport";
import localStrategy from "./strategy/local.strategy.js";
import jwtStrategy from "./strategy/jwt.strategy.js";
import kakaoStrategy from "./strategy/kakao.strategy.js";
import googleStrategy from "./strategy/google.strategy.js";
import naverStrategy from "./strategy/naver.strategy.js";
import githubStrategy from "./strategy/github.strategy.js";

// 로컬 로그인
passport.use("local", localStrategy);

// JWT 검증
passport.use("jwt", jwtStrategy);

// kakao 로그인
passport.use("kakao", kakaoStrategy);

// google 로그인
passport.use("google", googleStrategy);

// naver 로그인
passport.use("naver", naverStrategy);

// github 로그인
passport.use("github", githubStrategy);

export default passport;
