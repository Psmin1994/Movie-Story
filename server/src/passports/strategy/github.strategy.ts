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
  async (
    accessToken: string,
    refreshToken: string,
    profile: { provider: string; provider_user_id: string; _json: any },
    done: VerifyCallback
  ) => {
    try {
      let data = profile._json;

      let check = await AuthDAO.checkOauthUserById(data.id);

      if (!check) {
        // 사용자 없으면 새로 생성
        let newUserInfo: CreateOauthUserDTO = {
          provider: profile.provider,
          provider_user_id: data.id,
          nickname: data.login,
          access_token: accessToken,
          refresh_token: refreshToken,
        };

        let oAuthUser = await AuthDAO.createOauthUser(newUserInfo);

        return done(null, { id: oAuthUser.provider_user_id, provider: oAuthUser.provider });
      } else {
        // 사용자 있으면 Update
        let oAuthUser = await AuthDAO.updateOauthUser({
          provider_user_id: data.id,
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
