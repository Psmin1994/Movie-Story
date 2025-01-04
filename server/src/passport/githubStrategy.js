import { Strategy as GithubStrategy } from "passport-github2";
import authStorage from "../models/auth.model.js";

export default (passport) => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
          let user = await authStorage.getOauthUserById(profile._json.node_id);

          console.log(user);

          if (!user) {
            // 사용자 없으면 새로 생성
            user = {
              provider: "github",
              provider_user_id: profile._json.node_id,
              nickname: profile._json.login,
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
