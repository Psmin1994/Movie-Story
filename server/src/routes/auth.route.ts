import express from "express";
import ctrl from "controllers/auth.controller.js";

const router = express.Router();

// 네이버 OAuth
router.get("/naver", ctrl.naver);
router.get("/naver/callback", ctrl.naverCallback);

// 카카오 OAuth
router.get("/kakao", ctrl.kakao);
router.get("/kakao/callback", ctrl.kakaoCallback);

// 구글 OAuth
router.get("/google", ctrl.google);
router.get("/google/callback", ctrl.googleCallback);

// 구글 OAuth
router.get("/github", ctrl.github);
router.get("/github/callback", ctrl.githubCallback);

export default router;
