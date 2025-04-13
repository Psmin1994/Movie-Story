import express from "express";
import ctrl from "controllers/user.controller.js";
import userValidator from "middlewares/userValidation.js";
import tokenVerify from "middlewares/tokenVerify.js";

const router = express.Router();

router.get("/info", tokenVerify, ctrl.info); // 토큰 인증
router.get("/refresh", ctrl.refreshToken); // 토큰 재발급
router.get("/logout", tokenVerify, ctrl.logout); // 유저 로그아웃

router.post("/login", ctrl.login); // 유저 로그인
router.post("/register", userValidator.register, ctrl.register); // 유저 회원가입

export default router;
