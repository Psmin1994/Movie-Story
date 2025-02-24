import express from "express";
import ctrl from "controllers/movie.controller.js";

const router = express.Router();

router.get("/", ctrl.getMovie); // 영화 전체 목록 불러오기
router.get("/search", ctrl.getMovieBySearch); // 영화 전체 목록 불러오기
router.get("/chart", ctrl.getBoxOffice); // 영화 전체 목록 불러오기
router.get("/:id", ctrl.getMovieById); // 특정 영화 불러오기
router.get("/info/:id", ctrl.getMovieInfoById); // 특정 영화 불러오기
router.get("/genre/:id", ctrl.getGenreByMovieId); // 영화 장르 불러오기
router.get("/actor/:id", ctrl.getActorByMovieId); // 영화 출연 배우 불러오기
router.get("/director/:id", ctrl.getDirectorByMovieId); // 영화 연출 감독 불러오기

router.get("/sort/genre/:id", ctrl.getMovieByGenreId); // 장르별 영화 불러오기

export default router;
