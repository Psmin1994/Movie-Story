import { Strategy as JwtStrategy } from "passport-jwt";
import userStorage from "../models/user.model.js";
import authStorage from "../models/auth.model.js";

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }

  // 헤더에서 토큰 추출
  // if (!token && req.headers.authorization) {
  //   token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  // }

  return token;
};

export default (passport) => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        // header에 bearer스키마에 담겨온 토큰 해석할 때
        // token을 localStorage에 담았을 때 사용
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.ACCESS_TOKEN_SECRET, // 암호 해독 키
        ignoreExpiration: false, // 만료된 토큰은 거부
      },
      async (payload, done) => {
        try {
          let id = payload.id;

          let user = null;

          if (payload.provider) {
            user = await authStorage.getOauthUserById(id);
          } else {
            let { user_id } = await userStorage.getUserById(id);

            let userInfo = await userStorage.getUserInfo(user_id);

            user = { id, ...userInfo };
          }

          if (user) {
            return done(null, user); // 사용자 있으면 인증 성공
          }

          return done(null, false); // 사용자 없으면 인증 실패
        } catch (err) {
          done(err);
        }
      }
    )
  );
};
