import express from "express";
import ctrl from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/", ctrl.getMovie); // 영화 목록 불러오기
router.get("/:id", ctrl.getMovieById);
router.get("/movie_genre/:id", ctrl.getGenreByMovieId);
router.get("/movie_actor/:id", ctrl.getActorByMovieId);
router.get("/movie_director/:id", ctrl.getDirectorByMovieId);

router.get("/genre/:id", ctrl.getMovieByGenreId);

export default router;
