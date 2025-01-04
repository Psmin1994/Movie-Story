import tokenUtil from "../utils/token.util.js";
import userStorage from "../models/user.model.js";

const tokenVerity = async (req, res, next) => {
  if (!req.cookies.accessToken && !req.cookies.refreshToken) {
    // case 1 : Token이 없을 경우
    return res.json({ isLogin: false });
  }

  try {
    const accessToken = req.cookies.accessToken;

    // AccessToken 검증
    const decode = await tokenUtil.verifyAccessToken(accessToken);

    // case 2 : AccessToken이 유효인 경우
    let user = await userStorage.getUserInfo(decode.id);

    return res.json({ isLogin: true, user });
  } catch (err) {
    // AccessToken이 만료된 경우.
    if (err.code === "TOKEN_EXPIRED") {
      try {
        const refreshToken = req.cookies.refreshToken;

        // RefreshToken 검증
        const refreshDecode = await tokenUtil.verifyRefreshToken(refreshToken);

        try {
          // case 3 : AccessToken은 만료, RefreshToken은 유효인 경우
          const user = await userStorage.getUserInfo(refreshDecode.id);

          // 새로운 AccessToken 생성
          let newAccessToken = await tokenUtil.generateAccessToken(user.id);

          // 새로운 RefreshToken 생성
          let newRefreshToken = await tokenUtil.generateRefreshToken(user.id);

          // AccessToken 재발급
          res.cookie("accessToken", newAccessToken, {
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          // RefreshToken 재발급
          res.cookie("refreshToken", newRefreshToken, {
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          return res.json({ isLogin: false });
        } catch (err) {
          return next(err);
        }
      } catch {
        // case 4 : AccessToken 만료, RefreshToken 만료인 경우
        if (err.code === "TOKEN_EXPIRED") {
          // RefreshToken 만료 시, 초기화
          res.clearCookie("refreshToken", {
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          return res.json({ isLogin: false });
        } else {
          next(err);
        }
      }
    } else {
      next(err);
    }
  }
};

export default tokenVerity;
