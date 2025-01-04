import { Strategy as KakaoStrategy } from "passport-kakao";
import authStorage from "../models/auth.model.js";

export default (passport) => {
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await authStorage.getOauthUserById(profile.id);

          if (!user) {
            // 사용자 없으면 새로 생성
            user = {
              provider: profile.provider,
              provider_user_id: profile.id,
              nickname: profile.displayName,
              email: null,
              accessToken,
              refreshToken,
            };

            await authStorage.createOauthUser(user);
          } else {
            // 사용자 있으면 Update
            await authStorage.UpdateOauthUser({
              accessToken: accessToken || user.accessToken,
              refreshToken: refreshToken || user.refreshToken,
              provider_user_id: profile.provider_user_id,
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
