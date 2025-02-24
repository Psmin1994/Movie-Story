import { Request, Response, NextFunction } from "express";
import passport from "passport";
import tokenUtil from "utils/token.util.js";
import { AppError } from "middlewares/errorHandler.js";
import { JwtUserDTO } from "dtos/user.dto";
import { COOKIE_OPTIONS } from "config/cookieOptions.js";

export default {
  naver: (req: Request, res: Response, next: NextFunction) => {
    const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_CALLBACK_URL } = process.env;

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !NAVER_CALLBACK_URL) {
      const err = new Error("Failed to load environment variables");

      return next(err);
    }

    const redirectUrl = (req.query.redirectUrl as string) || "http://localhost:3000/"; // 기본값 설정

    // 네이버 로그인 페이지로 리디렉션
    passport.authenticate("naver", {
      session: false,
      state: encodeURIComponent(redirectUrl),
      // scope: ["profile", "email"],
    })(req, res, next);
  },

  naverCallback: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "naver",
      {
        session: false, // 세션 X (JWT 사용)
      },
      async (err: AppError | Error, user: JwtUserDTO) => {
        if (err) return next(err);

        const redirectUrl = req.query.state ? decodeURIComponent(req.query.state as string) : "http://localhost:3000/";

        try {
          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken(user);

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken(user);

          res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

          // RefreshToken 쿠키로 발급
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        } catch (err) {
          return next(err);
        }
      }
    )(req, res, next);
  },

  kakao: (req: Request, res: Response, next: NextFunction) => {
    const { KAKAO_CLIENT_ID, KAKAO_CALLBACK_URL } = process.env;

    if (!KAKAO_CLIENT_ID || !KAKAO_CALLBACK_URL) {
      const err = new Error("Failed to load environment variables");

      return next(err);
    }

    const redirectUrl = (req.query.redirectUrl as string) || "http://localhost:3000/"; // 기본값 설정

    // 네이버 로그인 페이지로 리디렉션
    passport.authenticate("kakao", {
      session: false,
      state: encodeURIComponent(redirectUrl),
      // scope: ["profile", "email"],
    })(req, res, next);
  },

  kakaoCallback: (req: Request, res: Response, next: NextFunction) => {
    // 로그인 콜백
    passport.authenticate(
      "kakao",
      {
        session: false, // 세션을 사용하지 않음 (JWT 사용 시)
      },
      async (err: AppError | Error, user: JwtUserDTO) => {
        if (err) return next(err);

        const redirectUrl = req.query.state ? decodeURIComponent(req.query.state as string) : "http://localhost:3000/";

        try {
          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken(user);

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken(user);

          res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

          // RefreshToken 쿠키로 발급
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        } catch (err) {
          return next(err);
        }
      }
    )(req, res, next);
  },

  google: (req: Request, res: Response, next: NextFunction) => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
      const err = new Error("Failed to load environment variables");

      return next(err);
    }

    const redirectUrl = (req.query.redirectUrl as string) || "http://localhost:3000/"; // 기본값 설정

    // 구글 로그인 페이지로 리디렉션
    passport.authenticate("google", {
      session: false,
      state: encodeURIComponent(redirectUrl),
      // scope: ["profile", "email"],
    })(req, res, next);
  },

  googleCallback: (req: Request, res: Response, next: NextFunction) => {
    // 로그인 콜백
    passport.authenticate(
      "google",
      {
        session: false, // 세션을 사용하지 않음 (JWT 사용 시)
      },
      async (err: AppError | Error, user: JwtUserDTO) => {
        if (err) return next(err);

        const redirectUrl = req.query.state ? decodeURIComponent(req.query.state as string) : "http://localhost:3000/";

        try {
          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken(user);

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken(user);

          res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

          // RefreshToken 쿠키로 발급
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        } catch (err) {
          return next(err);
        }
      }
    )(req, res, next);
  },

  github: (req: Request, res: Response, next: NextFunction) => {
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
      const err = new Error("Failed to load environment variables");

      return next(err);
    }

    const redirectUrl = (req.query.redirectUrl as string) || "http://localhost:3000/"; // 기본값 설정

    // 구글 로그인 페이지로 리디렉션
    passport.authenticate("github", {
      session: false,
      state: encodeURIComponent(redirectUrl),
      // scope: ["profile", "email"],
    })(req, res, next);
  },

  githubCallback: (req: Request, res: Response, next: NextFunction) => {
    // 로그인 콜백
    passport.authenticate(
      "github",
      {
        session: false, // 세션을 사용하지 않음 (JWT 사용 시)
      },
      async (err: AppError | Error, user: JwtUserDTO) => {
        if (err) return next(err);

        const redirectUrl = req.query.state ? decodeURIComponent(req.query.state as string) : "http://localhost:3000/";

        try {
          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken(user);

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken(user);

          res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

          // RefreshToken 쿠키로 발급
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        } catch (err) {
          return next(err); // 예외 처리
        }
      }
    )(req, res, next);
  },
};
