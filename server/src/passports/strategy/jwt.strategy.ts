import { Request } from "express";
import { Strategy as JwtStrategy, VerifiedCallback } from "passport-jwt";
import UserDAO from "models/user.model.js";
import AuthDAO from "models/auth.model.js";
import { JwtUserDTO } from "dtos/user.dto";

const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }

  return token;
};

const jwtStrategy = new JwtStrategy(
  {
    // 1. header에 bearer 스키마에 담겨온 토큰 해석할 때,
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // 2. token을 특정 헤더(headerName)에 담았을 때 사용
    // jwtFromRequest: ExtractJwt.fromHeader("headerName")

    jwtFromRequest: cookieExtractor, // jwt 추출 함수
    secretOrKey: process.env.ACCESS_TOKEN_SECRET!, // 암호 해독 키
    ignoreExpiration: false, // 만료된 토큰은 거부
  },
  async (payload: JwtUserDTO, done: VerifiedCallback) => {
    try {
      if (payload.provider) {
        let oauthUser = await AuthDAO.getOauthUserById(payload.id);

        return done(null, { id: oauthUser.provider_user_id, provider: oauthUser.provider, nickname: oauthUser.nickname });
      } else {
        let user = await UserDAO.getUserById(payload.id);

        return done(null, { id: user.id, nickname: user.user_info?.nickname }); // 사용자 있으면 인증 성공
      }
    } catch (err) {
      return done(err);
    }
  }
);

export default jwtStrategy;
