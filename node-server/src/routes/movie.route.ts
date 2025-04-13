import express from "express";
import ctrl from "controllers/movie.controller.js";

const router = express.Router();

router.get("/", ctrl.getMovies); // 영화 전체 목록 불러오기
router.get("/genre", ctrl.getGenres); // 영화 장르 목록 불러오기
router.get("/chart", ctrl.getBoxOffice); // Top 10 불러오기
router.get("/search", ctrl.getMovieBySearch); // 제목 검색
router.get("/overview/:id", ctrl.getMovieById); // 특정 영화 기본 정보 불러오기
router.get("/details/:id", ctrl.getMovieDetailsById); // 특정 영화 추가 정보 불러오기
router.get("/actor/:id", ctrl.getActorByMovieId); // 영화 출연 배우 불러오기
router.get("/director/:id", ctrl.getDirectorByMovieId); // 영화 연출 감독 불러오기

export default router;
