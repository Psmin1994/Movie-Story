import { Strategy as GithubStrategy } from "passport-github2";
import { VerifyCallback } from "passport-oauth2";
import { CreateOauthUserDTO } from "dtos/user.dto";
import AuthDAO from "models/auth.model.js";

const githubStrategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
  },
  async (accessToken: string, refreshToken: string, profile, done: VerifyCallback) => {
    try {
      let { id, username } = profile;

      let exists = await AuthDAO.checkOauthUserById(id);

      if (!exists) {
        // 사용자 없으면 새로 생성
        let newUserInfo: CreateOauthUserDTO = {
          provider: profile.provider,
          provider_user_id: id,
          nickname: username,
          access_token: accessToken,
          refresh_token: refreshToken,
        };

        let oAuthUser = await AuthDAO.createOauthUser(newUserInfo);

        return done(null, { id: oAuthUser.provider_user_id, provider: oAuthUser.provider });
      } else {
        // 사용자 있으면 Update
        let oAuthUser = await AuthDAO.updateOauthUser({
          provider_user_id: id,
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        return done(null, { id: oAuthUser.provider_user_id, provider: oAuthUser.provider });
      }
    } catch (err) {
      return done(err);
    }
  }
);

export default githubStrategy;
