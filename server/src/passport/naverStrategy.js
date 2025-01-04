import { Strategy as NaverStrategy } from "passport-naver-v2";
import authStorage from "../models/auth.model.js";

export default (passport) => {
  passport.use(
    "naver",
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_CALLBACK_URL,
        svcType: 0,
      },
      // accessToken : 추가적인 Naver API 사용 시 필요
      async (accessToken, refreshToken, profile, done) => {
        try {
          let res = profile._json.response;

          console.log(res);

          let user = await authStorage.getOauthUserById(profile.id);

          if (!user) {
            // 사용자 없으면 새로 생성
            user = {
              provider: profile.provider,
              provider_user_id: profile.id,
              nickname: profile.name,
              email: profile.email,
              accessToken,
              refreshToken,
            };

            await authStorage.createOauthUser(user);
          } else {
            // 사용자 있으면 Update
            await authStorage.UpdateOauthUser({
              accessToken: accessToken || user.accessToken,
              refreshToken: refreshToken || user.refreshToken,
              provider_user_id: profile.id,
            });
          }

          return done(null, user); // 사용자 없으면 인증 실패
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
