import passport from "passport";
import userStorage from "../models/user.model.js";
import authStorage from "../models/auth.model.js";
import { createPasswordAndSalt } from "../utils/crypto.util.js";
import tokenUtil from "../utils/token.util.js";

export default {
  info: async (req, res, next) => {
    try {
      let user = req.user;

      return res.json({ nickname: user.nickname });
    } catch (err) {
      return next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      // RefreshToken 검증
      const refreshDecode = await tokenUtil.verifyRefreshToken(refreshToken);

      // RefreshToken은 유효인 경우, 사용자 정보 가져오기
      let user = null;
      let newAccessToken = null;

      if (refreshDecode.provider) {
        // OAuth
        user = await authStorage.getOauthUserById(refreshDecode.id);

        newAccessToken = await tokenUtil.generateAccessToken({ id: user.id, provider: user.provider });
      } else {
        user = await userStorage.getUserById(refreshDecode.id);

        newAccessToken = await tokenUtil.generateAccessToken({ id: user.id });
      }

      // AccessToken 재발급
      res.cookie("accessToken", newAccessToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.json({ message: "Token refreshed" });
    } catch (err) {
      // RefreshToken 만료인 경우
      if (err.code === "TOKEN_EXPIRED") {
        res.clearCookie("accessToken", {
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        res.clearCookie("refreshToken", {
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(401).json({ message: err.message });
      }

      if (err.code === "TOKEN_NOT_FOUND") {
        res.clearCookie("accessToken", {
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(401).json({ message: err.message });
      }

      if (err.code === "ACCESS_TOKEN_ERROR") {
        return res.status(401).json({ message: err.message });
      }

      next(err);
    }
  },

  login: (req, res, next) => {
    try {
      passport.authenticate("local", { session: false }, async (err, userId, response) => {
        if (err) return next(err);

        if (!userId) return res.json(response);

        // AccessToken 생성
        const accessToken = await tokenUtil.generateAccessToken({ id: userId });

        // RefreshToken 생성
        const refreshToken = await tokenUtil.generateRefreshToken({ id: userId });

        // RefreshToken 쿠키로 발급
        res.cookie("accessToken", accessToken, {
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // https Only
        });

        // RefreshToken 쿠키로 발급
        res.cookie("refreshToken", refreshToken, {
          sameSite: "strict",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
          success: true,
          message: "로그인 성공",
        });
      })(req, res, next); // 미들웨어 내의 미드뤠어는 (req, res, next)를 붙여줍니다.
    } catch (err) {
      if (err.code === "ACCESS_TOKEN_ERROR") {
        return res.status(401).json({ message: err.message });
      }

      if (err.code === "REFRESH_TOKEN_ERROR") {
        return res.status(401).json({ message: err.message });
      }

      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      let { id, password } = req.body;

      const checked = await userStorage.checkUser(id);

      if (checked) {
        return res.json({ success: false, msg: "이미 존재하는 아이디입니다" });
      }
      // 암호화된 비밀번호 생성
      req.body.password = await createPasswordAndSalt(password);

      // DB에 새로운 사용자 등록
      await userStorage.createUser(req.body);

      return res.json({ success: true, msg: "회원가입 완료." });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      // 로그아웃 요청시 토큰을 쿠키에서 삭제
      res.clearCookie("accessToken", {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.clearCookie("refreshToken", {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      // RefreshToken 삭제
      if (req.cookies.refreshToken) await tokenUtil.DeleteRefreshToken(req.cookies.refreshToken);

      return res.json({ message: "User Logout" });
    } catch (err) {
      next(err);
    }
  },
};
