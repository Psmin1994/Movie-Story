import { Strategy as NaverStrategy } from "passport-naver-v2";
import { CreateOauthUserDTO } from "dtos/user.dto";
import AuthDAO from "models/auth.model.js";

const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.NAVER_CLIENT_ID!,
    clientSecret: process.env.NAVER_CLIENT_SECRET!,
    callbackURL: process.env.NAVER_CALLBACK_URL!,
    svcType: 0,
  },
  // accessToken : 추가적인 Naver API 사용 시 필요
  async (accessToken, refreshToken, profile, done) => {
    try {
      let data = profile._json;

      let checked = await AuthDAO.checkOauthUserById(data.id);

      if (!checked) {
        // 사용자 없으면 새로 생성
        let newUserInfo: CreateOauthUserDTO = {
          provider: profile.provider,
          provider_user_id: data.id,
          nickname: data.nickname,
          email: data.email,
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

export default naverStrategy;
