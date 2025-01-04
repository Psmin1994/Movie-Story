import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authStorage from "../models/auth.model.js";

export default (passport) => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
          let user = await authStorage.getOauthUserById(profile.id);

          if (!user) {
            // 사용자 없으면 새로 생성
            user = {
              provider: profile.provider,
              provider_user_id: profile.id,
              nickname: profile.displayName,
              email: profile.emails[0].value,
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
