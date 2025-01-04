import passport from "passport";
import local from "./localStrategy.js";
import jwt from "./jwtStrategy.js";
import naver from "./naverStrategy.js";
import google from "./googleStrategy.js";
import github from "./githubStrategy.js";
import kakao from "./kakaoStrategy.js";

// 로컬 로그인
local(passport);

// JWT 검증
jwt(passport);

// naver 로그인
naver(passport);

// google 로그인
google(passport);

// github 로그인
github(passport);

// kakao 로그인
kakao(passport);

export default passport;
