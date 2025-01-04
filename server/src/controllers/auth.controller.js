import passport from "passport";
import tokenUtil from "../utils/token.util.js";

export default {
  naver: (req, res, next) => {
    const redirectUrl = req.query.redirectUrl || "http://localhost:3000"; // 기본값 설정

    // 네이버 로그인 페이지로 리디렉션
    passport.authenticate("naver", { session: false, state: encodeURIComponent(redirectUrl) })(req, res, next);
  },

  naverCallback: (req, res, next) => {
    try {
      // 로그인 콜백
      passport.authenticate(
        "naver",
        {
          session: false, // 세션을 사용하지 않음 (JWT 사용 시)
          failureRedirect: "/", // 실패 시 이동할 URL
        },
        async (err, user) => {
          const redirectUrl = req.query.state ? decodeURIComponent(req.query.state) : "http://localhost:3000/movie";

          if (err || !user) {
            return res.redirect(redirectUrl);
            // 로그인 실패 시 리디렉션
          }

          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken({ id: user.provider_user_id, provider: user.provider });

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken({ id: user.provider_user_id, provider: user.provider });

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

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        }
      )(req, res, next);
    } catch (err) {
      next(err); // 예외 처리
    }
  },

  kakao: (req, res, next) => {
    const redirectUrl = req.query.redirectUrl || "http://localhost:3000"; // 기본값 설정

    // 네이버 로그인 페이지로 리디렉션
    passport.authenticate("kakao", { session: false, state: encodeURIComponent(redirectUrl) })(req, res, next);
  },

  kakaoCallback: (req, res, next) => {
    try {
      // 로그인 콜백
      passport.authenticate(
        "kakao",
        {
          session: false, // 세션을 사용하지 않음 (JWT 사용 시)
          failureRedirect: "/", // 실패 시 이동할 URL
        },
        async (err, user) => {
          const redirectUrl = req.query.state ? decodeURIComponent(req.query.state) : "http://localhost:3000/movie";

          if (err || !user) {
            return res.redirect(redirectUrl);
            // 로그인 실패 시 리디렉션
          }

          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken({ id: user.provider_user_id, provider: user.provider });

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken({ id: user.provider_user_id, provider: user.provider });

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

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        }
      )(req, res, next);
    } catch (err) {
      next(err); // 예외 처리
    }
  },

  google: (req, res, next) => {
    const redirectUrl = req.query.redirectUrl || "http://localhost:3000"; // 기본값 설정

    // 구글 로그인 페이지로 리디렉션
    passport.authenticate("google", {
      session: false,
      state: encodeURIComponent(redirectUrl),
      scope: ["profile", "email"],
    })(req, res, next);
  },

  googleCallback: (req, res, next) => {
    try {
      // 로그인 콜백
      passport.authenticate(
        "google",
        {
          session: false, // 세션을 사용하지 않음 (JWT 사용 시)
          failureRedirect: req.query.state ? decodeURIComponent(req.query.state) : "/", // 실패 시 이동할 URL
        },
        async (err, user) => {
          const redirectUrl = req.query.state ? decodeURIComponent(req.query.state) : "/";

          if (err || !user) {
            return res.redirect(redirectUrl);
            // 로그인 실패 시 리디렉션
          }
          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken({ id: user.provider_user_id, provider: user.provider });

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken({ id: user.provider_user_id, provider: user.provider });

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

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        }
      )(req, res, next);
    } catch (err) {
      next(err); // 예외 처리
    }
  },

  github: (req, res, next) => {
    const redirectUrl = req.query.redirectUrl || "http://localhost:3000"; // 기본값 설정

    // 구글 로그인 페이지로 리디렉션
    passport.authenticate("github", {
      session: false,
      state: encodeURIComponent(redirectUrl),
      // scope: ["profile", "email"],
    })(req, res, next);
  },

  githubCallback: (req, res, next) => {
    try {
      // 로그인 콜백
      passport.authenticate(
        "github",
        {
          session: false, // 세션을 사용하지 않음 (JWT 사용 시)
          failureRedirect: req.query.state ? decodeURIComponent(req.query.state) : "/", // 실패 시 이동할 URL
        },
        async (err, user) => {
          const redirectUrl = req.query.state ? decodeURIComponent(req.query.state) : "/";

          if (err || !user) {
            return res.redirect(redirectUrl);
            // 로그인 실패 시 리디렉션
          }

          // AccessToken 생성
          const accessToken = await tokenUtil.generateAccessToken({ id: user.provider_user_id, provider: user.provider });

          // RefreshToken 생성
          const refreshToken = await tokenUtil.generateRefreshToken({ id: user.provider_user_id, provider: user.provider });

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

          // 클라이언트로 리디렉션
          res.redirect(redirectUrl);
        }
      )(req, res, next);
    } catch (err) {
      next(err); // 예외 처리
    }
  },
};
