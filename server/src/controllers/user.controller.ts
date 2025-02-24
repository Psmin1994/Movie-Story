import { Request, Response, NextFunction } from "express";
import passport from "passport";
import UserDAO from "models/user.model.js";
import { createPasswordAndSalt } from "utils/crypto.util.js";
import tokenUtil from "utils/token.util.js";
import { AppError } from "middlewares/errorHandler.js";
import { COOKIE_OPTIONS } from "config/cookieOptions.js";
import { CreateUserDTO } from "dtos/user.dto";

export default {
  info: (req: Request, res: Response) => {
    let user = req.user;

    res.json(user);
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      // RefreshToken 검증
      const decode = await tokenUtil.verifyRefreshToken(refreshToken);

      // RefreshToken은 유효인 경우, AccessToken 생성
      let newAccessToken = await tokenUtil.generateAccessToken(decode);

      // AccessToken 재발급
      res.cookie("accessToken", newAccessToken, COOKIE_OPTIONS);

      res.json({ message: "Token refreshed" });
    } catch (err) {
      // RefreshToken 만료인 경우
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);

      return next(err);
    }
  },

  login: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, async (err: AppError | Error, user: any) => {
      if (err) return next(err);

      try {
        let userId = user.id;

        // AccessToken 생성
        const accessToken = await tokenUtil.generateAccessToken({ id: userId });

        // RefreshToken 생성
        const refreshToken = await tokenUtil.generateRefreshToken({ id: userId });

        // RefreshToken 쿠키로 발급
        res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

        // RefreshToken 쿠키로 발급
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

        res.status(200).json({
          success: true,
          message: "User login",
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next); // 미들웨어 내의 미드뤠어는 (req, res, next)를 붙여줍니다.
  },

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { id, password, name } = req.body;

      const checked = await UserDAO.checkUserById(id);

      if (checked) {
        throw new AppError("User already exists", 409);
      }

      let newUserInfo: CreateUserDTO = { id, password, nickname: name };

      // 암호화된 비밀번호 생성
      newUserInfo.password = await createPasswordAndSalt(password);

      // DB에 새로운 사용자 등록
      await UserDAO.createUser(newUserInfo);

      res.json({ success: true, message: "register done" });
    } catch (err) {
      return next(err);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 저장소에서 RefreshToken 삭제
      // if (req.cookies.refreshToken) await tokenUtil.DeleteRefreshToken(req.cookies.refreshToken);

      // 로그아웃 요청시 토큰을 쿠키에서 삭제
      res.clearCookie("accessToken", COOKIE_OPTIONS);

      res.clearCookie("refreshToken", COOKIE_OPTIONS);

      res.json({ message: "User logout" });
    } catch (err) {
      return next(err);
    }
  },
};
