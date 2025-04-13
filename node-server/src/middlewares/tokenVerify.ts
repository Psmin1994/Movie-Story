import { Request, Response, NextFunction } from "express";
import UserDAO from "models/user.model.js";
import AuthDAO from "models/auth.model.js";
import tokenUtil from "utils/token.util.js";

const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.accessToken;

    // accessToken이 null 또는 undefined인 경우 처리
    if (!token) {
      return next();
    }

    let user = null;

    let decode = await tokenUtil.verifyAccessToken(token);

    if (decode.provider) {
      let oauthUser = await AuthDAO.getOauthUserById(decode.id);

      user = { id: oauthUser.provider_user_id, provider: oauthUser.provider, nickname: oauthUser.nickname! };
    } else {
      let data = await UserDAO.getUserById(decode.id);

      user = { id: data.id, nickname: data.user_info?.nickname }; // 사용자 있으면 인증 성공
    }

    req.user = user;

    return next();
  } catch (err) {
    return next(err);
  }
};

export default tokenVerify;
