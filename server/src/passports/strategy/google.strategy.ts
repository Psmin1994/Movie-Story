import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { CreateOauthUserDTO } from "dtos/user.dto";
import AuthDAO from "models/auth.model.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let data = profile._json;

      let checked = await AuthDAO.checkOauthUserById(data.sub);

      if (!checked) {
        // 사용자 없으면 새로 생성
        let newUserInfo: CreateOauthUserDTO = {
          provider: profile.provider,
          provider_user_id: data.sub,
          nickname: data.name,
          access_token: accessToken,
          refresh_token: refreshToken,
        };

        let oAuthUser = await AuthDAO.createOauthUser(newUserInfo);

        return done(null, { id: oAuthUser.provider_user_id, provider: oAuthUser.provider });
      } else {
        // 사용자 있으면 Update
        let oAuthUser = await AuthDAO.updateOauthUser({
          provider_user_id: data.sub,
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

export default googleStrategy;
